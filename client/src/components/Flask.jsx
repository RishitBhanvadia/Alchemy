/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/**
 * Flask.jsx — 3D Erlenmeyer Flask mesh with RigidBody physics and liquid shader
 * Phase 3.1 Task [7]: Wrapped in <RigidBody> with CCD enabled
 *
 * Features:
 * - RigidBody physics with CCD (prevents tunneling)
 * - Erlenmeyer flask shape: wide bottom tapering to narrow neck
 * - Glass material using MeshTransmissionMaterial
 * - Liquid fill using custom LiquidShader
 * - Rotation constraints for controlled pouring
 * - Supports dynamic, fixed, and kinematicPosition modes
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshTransmissionMaterial } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import PropTypes from 'prop-types';
import { createLiquidMaterial } from '../shaders/LiquidShader';

/**
 * Flask — A physics-enabled 3D Erlenmeyer flask with optional liquid fill.
 *
 * @param {object} props
 * @param {Array<number>} props.position - [x, y, z] world position
 * @param {number} props.fillLevel - Liquid fill 0.0–1.0
 * @param {string} props.colorA - Hex color for base liquid state
 * @param {string} props.colorB - Hex color for reacted/mixed state
 * @param {string} props.label - Chemical label text
 * @param {'dynamic'|'fixed'|'kinematicPosition'} props.type - RigidBody type
 * @param {number} props.bottomRadius - Flask bottom radius
 * @param {number} props.topRadius - Flask neck radius
 * @param {number} props.height - Flask height
 * @param {boolean} props.enablePhysics - Whether to wrap in RigidBody
 * @param {function} props.onCollisionEnter - Callback on collision
 */
export default function Flask({
  position = [0, 1, 0],
  fillLevel = 0,
  colorA = '#ffffff',
  colorB = '#ffffff',
  label = '',
  type = 'dynamic',
  bottomRadius = 0.6,
  topRadius = 0.25,
  height = 1.8,
  enablePhysics = true,
  onCollisionEnter,
}) {
  const rigidBodyRef = useRef();
  const liquidMatRef = useRef();

  // Create the liquid shader material (memoized)
  const liquidMaterial = useMemo(
    () => createLiquidMaterial(colorA, colorB, fillLevel),
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

  // Flask body dimensions
  const bodyHeight = height * 0.65;
  const neckHeight = height * 0.35;

  // Liquid dimensions
  const liquidHeight = bodyHeight * fillLevel;
  const liquidY = -(bodyHeight / 2) + (liquidHeight / 2);
  const liquidRadius = bottomRadius * 0.85;

  const flaskContent = (
    <group>
      {/* Flask body — wider bottom cylinder (Erlenmeyer approximation) */}
      <Cylinder
        args={[topRadius, bottomRadius, bodyHeight, 32, 1, true]}
        position={[0, 0, 0]}
      >
        <MeshTransmissionMaterial
          thickness={0.1}
          roughness={0}
          transmission={0.93}
          ior={1.5}
          chromaticAberration={0.04}
          backside
          color="#aaddff"
        />
      </Cylinder>

      {/* Flask neck — narrow cylinder extending upward */}
      <Cylinder
        args={[topRadius * 0.9, topRadius, neckHeight, 32, 1, true]}
        position={[0, (bodyHeight / 2) + (neckHeight / 2), 0]}
      >
        <MeshTransmissionMaterial
          thickness={0.08}
          roughness={0}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.03}
          backside
          color="#bbddff"
        />
      </Cylinder>

      {/* Flask bottom — solid disc */}
      <Cylinder
        args={[bottomRadius, bottomRadius, 0.05, 32]}
        position={[0, -(bodyHeight / 2), 0]}
      >
        <meshStandardMaterial color="#ddeeff" transparent opacity={0.4} />
      </Cylinder>

      {/* Liquid fill — only rendered when fillLevel > 0 */}
      {fillLevel > 0 && (
        <mesh position={[0, liquidY, 0]}>
          <cylinderGeometry args={[liquidRadius * 0.7, liquidRadius, liquidHeight, 32, 8]} />
          <primitive
            ref={liquidMatRef}
            object={liquidMaterial}
            attach="material"
          />
        </mesh>
      )}

      {/* Label — render chemical name on the flask */}
      {label && (
        <mesh position={[0, 0, bottomRadius + 0.01]}>
          {/* Label is handled by parent or overlay — placeholder position */}
        </mesh>
      )}
    </group>
  );

  // If physics is disabled, render without RigidBody
  if (!enablePhysics) {
    return <group position={position}>{flaskContent}</group>;
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
      {/* Collider — approximating the flask shape with a cuboid */}
      <CuboidCollider
        args={[bottomRadius, height / 2, bottomRadius]}
        position={[0, 0, 0]}
      />

      {flaskContent}
    </RigidBody>
  );
}

Flask.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  fillLevel: PropTypes.number,
  colorA: PropTypes.string,
  colorB: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(['dynamic', 'fixed', 'kinematicPosition']),
  bottomRadius: PropTypes.number,
  topRadius: PropTypes.number,
  height: PropTypes.number,
  enablePhysics: PropTypes.bool,
  onCollisionEnter: PropTypes.func,
};
