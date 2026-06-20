/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/immutability */
/**
 * ParticleEmitter.jsx — Reusable particle system for gases and explosions
 * Phase 3.1.3 Task [10]: BufferGeometry-based particles with useFrame update loop
 *
 * Features:
 * - H2 gas: 200 white/translucent points with upward velocity
 * - CO2 gas: 150 grey points dispersing outward
 * - Exothermic: radial velocity burst with orange/red color gradient
 * - BufferGeometry for performance (no individual Mesh per particle)
 * - 2-second particle lifetime with fade-out
 * - GSAP camera shake on exothermic fire
 * - Framer Motion scale pulse on HUD overlays
 */
import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, AdditiveBlending } from 'three';
import PropTypes from 'prop-types';
// GSAP will be loaded dynamically when needed

// ─── Particle Configuration ──────────────────────────────────────────────────

const PARTICLE_CONFIG = {
  H2: {
    count: 200,
    color: new Color('#ffffff'),
    opacity: 0.7,
    size: 0.06,
    lifetime: 2.0,
    velocityFn: () => [
      (Math.random() - 0.5) * 0.2,   // x: random(-0.1, 0.1)
      0.5 + Math.random() * 1.0,       // y: random(0.5, 1.5) upward
      (Math.random() - 0.5) * 0.2,     // z: random(-0.1, 0.1)
    ],
  },
  CO2: {
    count: 150,
    color: new Color('#888888'),
    opacity: 0.6,
    size: 0.08,
    lifetime: 2.0,
    velocityFn: () => {
      // Disperse outward in all directions
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.7;
      return [
        Math.cos(angle) * speed,
        0.2 + Math.random() * 0.5,    // Some upward bias
        Math.sin(angle) * speed,
      ];
    },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ParticleEmitter({
  gasType = 'H2',
  isExothermic = false,
  active = false,
  position = [0, 0, 0],
}) {
  const pointsRef = useRef();
  const { gl } = useThree();
  const hasShaken = useRef(false);

  // Get config for this gas type
  const config = useMemo(() => {
    return PARTICLE_CONFIG[gasType] || PARTICLE_CONFIG.H2;
  }, [gasType]);

  const particleCount = config.count;

  // ─── Initialize particle data ───────────────────────────────────────
  const { positions, velocities, lifetimes, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const life = new Float32Array(particleCount);
    const col = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Start at origin (will be offset by position prop via group)
      pos[i3] = 0;
      pos[i3 + 1] = 0;
      pos[i3 + 2] = 0;

      // Initial velocity
      const v = config.velocityFn();
      vel[i3] = v[0];
      vel[i3 + 1] = v[1];
      vel[i3 + 2] = v[2];

      // Stagger lifetimes so particles don't all spawn at once
      life[i] = Math.random() * config.lifetime;

      // Color
      col[i3] = config.color.r;
      col[i3 + 1] = config.color.g;
      col[i3 + 2] = config.color.b;

      // Size
      sz[i] = config.size * (0.5 + Math.random() * 0.5);
    }

    return { positions: pos, velocities: vel, lifetimes: life, colors: col, sizes: sz };
  }, [particleCount, config]);

  // ─── Apply exothermic burst ─────────────────────────────────────────
  const applyExothermicBurst = useCallback(() => {
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Radial velocity burst — all particles fly outward
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.3) * Math.PI;
      const speed = 1.5 + Math.random() * 2.0;

      velocities[i3] = Math.cos(angle) * Math.cos(elevation) * speed;
      velocities[i3 + 1] = Math.abs(Math.sin(elevation)) * speed + 0.5;
      velocities[i3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed;

      // Orange/red color gradient
      const t = Math.random();
      colors[i3] = 1.0;                        // R: always full
      colors[i3 + 1] = 0.2 + t * 0.5;          // G: orange range
      colors[i3 + 2] = t * 0.1;                 // B: minimal

      // Reset lifetime
      lifetimes[i] = 0;

      // Reset position to origin
      positions[i3] = (Math.random() - 0.5) * 0.3;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.3;
    }
  }, [particleCount, positions, velocities, lifetimes, colors]);

  // ─── GSAP Camera Shake on Exothermic ────────────────────────────────
  useEffect(() => {
    if (active && isExothermic && !hasShaken.current) {
      hasShaken.current = true;

      // Apply exothermic burst
      applyExothermicBurst();

      // Shake animation logic
      const triggerShake = async () => {
        const { default: gsap } = await import('gsap');
        const canvas = gl.domElement;
        if (canvas) {
          gsap.to(canvas, {
            x: '+=5',
            yoyo: true,
            repeat: 5,
            duration: 0.08,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(canvas, { x: 0 });
            },
          });
        }
      };

      triggerShake();

      // Dispatch custom event for Framer Motion HUD pulse
      window.dispatchEvent(
        new CustomEvent('exothermic-reaction', { detail: { gasType } })
      );
    }

    if (!active) {
      hasShaken.current = false;
    }
  }, [active, isExothermic, gl, applyExothermicBurst, gasType]);

  // ─── useFrame: Update particle positions every frame ────────────────
  useFrame((_, delta) => {
    if (!active || !pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.getAttribute('position');
    const colAttr = geometry.getAttribute('color');
    const sizeAttr = geometry.getAttribute('size');

    if (!posAttr) return;

    const posArray = posAttr.array;
    const colArray = colAttr?.array;
    const sizeArray = sizeAttr?.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Update lifetime
      lifetimes[i] += delta;

      // If particle expired, respawn it
      if (lifetimes[i] >= config.lifetime) {
        lifetimes[i] = 0;

        // Reset position to origin
        posArray[i3] = (Math.random() - 0.5) * 0.2;
        posArray[i3 + 1] = 0;
        posArray[i3 + 2] = (Math.random() - 0.5) * 0.2;

        // New velocity
        const v = isExothermic
          ? [
              (Math.random() - 0.5) * 3,
              Math.random() * 2 + 0.5,
              (Math.random() - 0.5) * 3,
            ]
          : config.velocityFn();
        velocities[i3] = v[0];
        velocities[i3 + 1] = v[1];
        velocities[i3 + 2] = v[2];

        // Reset color for non-exothermic
        if (!isExothermic && colArray) {
          colArray[i3] = config.color.r;
          colArray[i3 + 1] = config.color.g;
          colArray[i3 + 2] = config.color.b;
        }

        continue;
      }

      // Apply velocity
      posArray[i3] += velocities[i3] * delta;
      posArray[i3 + 1] += velocities[i3 + 1] * delta;
      posArray[i3 + 2] += velocities[i3 + 2] * delta;

      // Apply gravity (slight downward for realism)
      velocities[i3 + 1] -= 0.3 * delta;

      // Fade out: reduce opacity via size decrease
      const lifeRatio = lifetimes[i] / config.lifetime;
      const fadeOut = 1.0 - lifeRatio;

      if (sizeArray) {
        sizeArray[i] = config.size * fadeOut * (0.5 + Math.random() * 0.1);
      }

      // Color fade for exothermic (orange → dark red)
      if (isExothermic && colArray) {
        colArray[i3] = 1.0 * fadeOut;
        colArray[i3 + 1] = (0.5 * fadeOut) * (1.0 - lifeRatio * 0.7);
        colArray[i3 + 2] = 0.05 * fadeOut;
      }
    }

    posAttr.needsUpdate = true;
    if (colAttr) colAttr.needsUpdate = true;
    if (sizeAttr) sizeAttr.needsUpdate = true;
  });

  // Don't render if not active
  if (!active) return null;

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={particleCount}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={config.opacity}
        size={config.size}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

ParticleEmitter.propTypes = {
  gasType: PropTypes.oneOf(['H2', 'CO2']),
  isExothermic: PropTypes.bool,
  active: PropTypes.bool,
  position: PropTypes.arrayOf(PropTypes.number),
};
