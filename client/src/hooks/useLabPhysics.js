/**
 * useLabPhysics.js — Custom hook for drag/pour logic in 3D lab
 * Phase 3.1.1 Task [8]: Raycaster hit detection, drag state machine, tilt constraints
 *
 * State Machine: idle → hovering → dragging → released → idle
 *
 * Features:
 * - Raycaster-based hit detection on an invisible drag plane (XY)
 * - Drag offset tracking so objects don't snap to cursor
 * - Object locking during drag (prevents other interactions)
 * - Tilt constraint: canTilt only within configurable radius of target position
 * - Pouring detection: triggers when near target and tilted
 * - Velocity tracking for liquid slosh effects
 */
import { useState, useRef, useCallback, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3, Vector2, Raycaster, Plane, MathUtils } from 'three';

/**
 * @typedef {Object} LabPhysicsConfig
 * @property {Array<number>} [targetPosition=[0,0,0]] - Position of the target container (beaker)
 * @property {number} [tiltRadius=50] - Max distance from target where tilting is allowed
 * @property {number} [pourThresholdY=1.2] - Minimum Y position to trigger pouring
 * @property {number} [pourThresholdX=2.5] - Maximum X distance from target for pouring
 * @property {Array<number>} [homePosition=[0,0,0]] - Object's rest position (returns here on release)
 */

/**
 * Custom hook for 3D lab object physics interactions.
 *
 * @param {LabPhysicsConfig} config - Configuration options
 * @returns {object} Physics state, handlers, and refs
 */
export default function useLabPhysics(config = {}) {
  const {
    targetPosition = [0, 0, 0],
    tiltRadius = 50,
    pourThresholdY = 1.2,
    pourThresholdX = 2.5,
    homePosition = [0, 0, 0],
  } = config;

  // ─── State ────────────────────────────────────────────────────────────
  const [dragState, setDragState] = useState('idle'); // idle | hovering | dragging | released
  const isDragging = dragState === 'dragging';
  const isHovering = dragState === 'hovering';

  // ─── Refs ─────────────────────────────────────────────────────────────
  const currentPosition = useRef(new Vector3(...homePosition));
  const dragOffset = useRef(new Vector3());
  const isPouring = useRef(false);
  const isTilted = useRef(false);
  const velocity = useRef(new Vector2(0, 0));
  const lastPosition = useRef(new Vector3(...homePosition));
  const lockedObjectId = useRef(null);

  // ─── Three.js utilities ───────────────────────────────────────────────
  const { camera } = useThree();

  // Invisible drag plane (XY plane at z=0)
  const dragPlane = useMemo(
    () => new Plane(new Vector3(0, 0, 1), 0),
    []
  );
  const planeIntersection = useRef(new Vector3());

  // Target position as Vector3 for distance calculations
  const targetVec3 = useMemo(
    () => new Vector3(...targetPosition),
    [targetPosition]
  );

  // ─── Can Tilt Logic ───────────────────────────────────────────────────
  /**
   * Check if the object can tilt at its current position.
   * Only allows tilting within `tiltRadius` of the target container.
   */
  const computeCanTilt = useCallback(
    (pos) => {
      const distance = pos.distanceTo(targetVec3);
      return distance <= tiltRadius;
    },
    [targetVec3, tiltRadius]
  );

  const [canTilt, setCanTilt] = useState(false);

  // ─── Pouring Logic ────────────────────────────────────────────────────
  /**
   * Check if the object is in a valid pouring position.
   * Requires: near target X, above threshold Y, and canTilt.
   */
  const computeIsPouring = useCallback(
    (pos) => {
      return (
        Math.abs(pos.x - targetVec3.x) < pourThresholdX &&
        pos.y > pourThresholdY &&
        computeCanTilt(pos)
      );
    },
    [targetVec3, pourThresholdX, pourThresholdY, computeCanTilt]
  );

  // ─── Event Handlers ───────────────────────────────────────────────────

  /**
   * Handle pointer entering an object (hover start).
   */
  const onPointerEnter = useCallback(
    () => {
      if (dragState === 'idle') {
        setDragState('hovering');
        document.body.style.cursor = 'grab';
      }
    },
    [dragState]
  );

  /**
   * Handle pointer leaving an object (hover end).
   */
  const onPointerLeave = useCallback(
    () => {
      if (dragState === 'hovering') {
        setDragState('idle');
        document.body.style.cursor = 'default';
      }
    },
    [dragState]
  );

  /**
   * Handle pointer down (start drag).
   * Performs raycaster hit detection on the drag plane
   * and calculates the offset so the object doesn't snap.
   */
  const onPointerDown = useCallback(
    (e) => {
      e.stopPropagation();

      setDragState('dragging');
      document.body.style.cursor = 'grabbing';

      // Raycaster hit detection on XY drag plane
      const raycaster = e.raycaster || new Raycaster();
      const mouse = e.pointer || _getMouseFromEvent(e);

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersection.current);

      // Calculate offset so object doesn't snap to cursor center
      dragOffset.current
        .copy(planeIntersection.current)
        .sub(currentPosition.current);

      // Lock this object to prevent other interactions
      lockedObjectId.current = e.object?.uuid || null;

      // Capture pointer for off-mesh dragging
      if (e.target && e.target.setPointerCapture) {
        try {
          e.target.setPointerCapture(e.pointerId);
        } catch (_) {
          /* ignore capture errors */
        }
      }
    },
    [camera, dragPlane]
  );

  /**
   * Handle pointer move (update drag position).
   * Projects the pointer onto the drag plane and updates position.
   */
  const onPointerMove = useCallback(
    (e) => {
      if (dragState !== 'dragging') return;
      e.stopPropagation();

      // Raycaster projection onto drag plane
      const raycaster = e.raycaster || new Raycaster();
      const mouse = e.pointer || _getMouseFromEvent(e);

      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersection.current);

      // Calculate new position (intersection minus stored offset)
      const newPos = planeIntersection.current.clone().sub(dragOffset.current);
      newPos.z = homePosition[2]; // Keep aligned to original Z depth
      currentPosition.current.copy(newPos);

      // Update tilt and pour states
      const tiltable = computeCanTilt(newPos);
      setCanTilt(tiltable);
      isPouring.current = computeIsPouring(newPos);
      isTilted.current = isPouring.current;
    },
    [dragState, camera, dragPlane, homePosition, computeCanTilt, computeIsPouring]
  );

  /**
   * Handle pointer up (end drag → released state).
   * Object returns to home position.
   */
  const onPointerUp = useCallback(
    (e) => {
      if (dragState !== 'dragging') return;
      e.stopPropagation();

      setDragState('released');
      document.body.style.cursor = 'default';

      // Reset physics state
      isPouring.current = false;
      isTilted.current = false;
      setCanTilt(false);
      lockedObjectId.current = null;

      // Reset position to home
      currentPosition.current.set(...homePosition);

      // Release pointer capture
      if (e.target && e.target.releasePointerCapture) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (_) {
          /* ignore */
        }
      }

      // Transition back to idle after a brief delay
      // (allows release animation to play)
      setTimeout(() => setDragState('idle'), 100);
    },
    [dragState, homePosition]
  );

  // ─── Frame Update Helper ──────────────────────────────────────────────
  /**
   * Call this inside useFrame to update velocity tracking and
   * smoothly interpolate group position/rotation.
   *
   * @param {THREE.Group} groupRef - The group to animate
   * @param {number} delta - Frame delta time
   * @param {object} [options] - Additional options
   * @param {number} [options.lerpSpeed=0.2] - Position interpolation speed
   * @param {number} [options.tiltAngle=Math.PI/3.5] - Tilt angle when pouring
   * @param {number} [options.tiltLerpSpeed=0.15] - Rotation interpolation speed
   */
  const updateFrame = useCallback(
    (groupRef, delta, options = {}) => {
      const {
        lerpSpeed = 0.2,
        tiltAngle = Math.PI / 3.5,
        tiltLerpSpeed = 0.15,
      } = options;

      if (!groupRef) return;

      const d = delta || 0.016;

      // Calculate velocity for liquid slosh effects
      const velX =
        (currentPosition.current.x - lastPosition.current.x) / d;
      const velZ =
        (currentPosition.current.z - lastPosition.current.z) / d;
      velocity.current.x = MathUtils.lerp(
        velocity.current.x,
        velX * 0.05,
        0.1
      );
      velocity.current.y = MathUtils.lerp(
        velocity.current.y,
        velZ * 0.05,
        0.1
      );
      lastPosition.current.copy(currentPosition.current);

      // Smoothly move the group to the current drag position
      groupRef.position.lerp(currentPosition.current, lerpSpeed);

      // Apply tilt rotation when pouring
      const targetRotZ = isTilted.current ? tiltAngle : 0;
      groupRef.rotation.z = MathUtils.lerp(
        groupRef.rotation.z,
        targetRotZ,
        tiltLerpSpeed
      );
    },
    []
  );

  // ─── Event Handlers Bundle ────────────────────────────────────────────
  const eventHandlers = useMemo(
    () => ({
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      onPointerCancel: onPointerUp, // Treat cancel as up
    }),
    [onPointerDown, onPointerMove, onPointerUp, onPointerEnter, onPointerLeave]
  );

  // ─── Return ───────────────────────────────────────────────────────────
  return {
    // State
    dragState,
    isDragging,
    isHovering,
    canTilt,
    isPouring,
    isTilted,
    velocity,
    currentPosition,

    // Event handlers (spread onto meshes)
    eventHandlers,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,

    // Frame update helper
    updateFrame,
  };
}

// ─── Internal Helpers ─────────────────────────────────────────────────────

/**
 * Extract normalized mouse coordinates from a DOM event.
 * @param {Event} e - The pointer event
 * @returns {THREE.Vector2}
 */
function _getMouseFromEvent(e) {
  const rect = document.body.getBoundingClientRect();
  return new Vector2(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    -((e.clientY - rect.top) / rect.height) * 2 + 1
  );
}
