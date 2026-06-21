/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/**
 * Beaker.jsx — 3D Beaker mesh with RigidBody physics and liquid shader
 * Phase 3.1 Task [6]: Wrapped in <RigidBody> with CCD enabled
 *
 * Features:
 * - RigidBody physics with Continuous Collision Detection (prevents tunneling)
 * - Glass material using MeshTransmissionMaterial for realistic transparency
 * - Liquid fill using custom LiquidShader with animated wave effect
 * - Rotation constraints: enabledRotations={[true, false, false]} (X-axis tilt only)
 * - Supports both 'dynamic' (draggable) and 'fixed' (stationary target) modes
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshTransmissionMaterial } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import PropTypes from 'prop-types';
import { createLiquidMaterial } from '../shaders/LiquidShader';

/**
 * Beaker — A physics-enabled 3D beaker with optional liquid fill.
 *
 * @param {object} props
 * @param {Array<number>} props.position - [x, y, z] world position
 * @param {number} props.fillLevel - Liquid fill 0.0–1.0
 * @param {string} props.colorA - Hex color for base liquid state
 * @param {string} props.colorB - Hex color for reacted/mixed state
 * @param {'dynamic'|'fixed'|'kinematicPosition'} props.type - RigidBody type
 * @param {number} props.radius - Beaker cylinder radius
 * @param {number} props.height - Beaker cylinder height
 * @param {boolean} props.enablePhysics - Whether to wrap in RigidBody (true by default)
 * @param {function} props.onCollisionEnter - Callback when another object collides
 */
export default function Beaker({
  position = [0, 1, 0],
  fillLevel = 0,
  colorA = '#ffffff',
  colorB = '#ffffff',
  type = 'dynamic',
  radius = 0.6,
  height = 1.5,
  enablePhysics = true,
  onCollisionEnter,
}) {
  const rigidBodyRef = useRef();
  const liquidMeshRef = useRef();
  const liquidMatRef = useRef();

  // Create the liquid shader material (memoized for performance)
  const liquidMaterial = useMemo(
    () => createLiquidMaterial(colorA, colorB, fillLevel),
    // Only recreate on color changes, fillLevel is updated via uniform
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorA, colorB]
  );

  // Animate the liquid shader each frame
  useFrame((state) => {
    if (liquidMatRef.current) {
      liquidMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      liquidMatRef.current.uniforms.uFillLevel.value = fillLevel;
    }
  });

  // Calculate liquid mesh dimensions based on fillLevel
  const liquidHeight = height * fillLevel;
  const liquidY = -(height / 2) + (liquidHeight / 2);

  // The inner beaker content (glass walls + liquid)
  const beakerContent = (
    <group>
      {/* Glass walls — open-ended cylinder for realistic look */}
      <Cylinder args={[radius, radius, height, 32, 1, true]}>
        <MeshTransmissionMaterial
          thickness={0.12}
          roughness={0}
          transmission={0.92}
          ior={1.5}
          chromaticAberration={0.05}
          backside
          color="#aaeeff"
        />
      </Cylinder>

      {/* Glass bottom */}
      <Cylinder args={[radius, radius, 0.05, 32]} position={[0, -(height / 2), 0]}>
        <meshStandardMaterial color="#ddeeff" transparent opacity={0.4} />
      </Cylinder>

      {/* Liquid fill — only rendered when fillLevel > 0 */}
      {fillLevel > 0 && (
        <mesh
          ref={liquidMeshRef}
          position={[0, liquidY, 0]}
        >
          <cylinderGeometry args={[radius * 0.9, radius * 0.9, liquidHeight, 32, 8]} />
          <primitive
            ref={liquidMatRef}
            object={liquidMaterial}
            attach="material"
          />
        </mesh>
      )}
    </group>
  );

  // If physics is disabled, render without RigidBody
  if (!enablePhysics) {
    return <group position={position}>{beakerContent}</group>;
  }

  return (
    <RigidBody
      ref={rigidBodyRef}
      type={type}
      position={position}
      ccd={true}
      enabledRotations={[true, false, false]}
      restitution={0.1}
      friction={0.8}
      linearDamping={2.0}
      angularDamping={2.0}
      onCollisionEnter={onCollisionEnter}
    >
      {/* Collider shape matching the beaker cylinder */}
      <CuboidCollider args={[radius, height / 2, radius]} position={[0, 0, 0]} />

      {beakerContent}
    </RigidBody>
  );
}

Beaker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  fillLevel: PropTypes.number,
  colorA: PropTypes.string,
  colorB: PropTypes.string,
  type: PropTypes.oneOf(['dynamic', 'fixed', 'kinematicPosition']),
  radius: PropTypes.number,
  height: PropTypes.number,
  enablePhysics: PropTypes.bool,
  onCollisionEnter: PropTypes.func,
};
