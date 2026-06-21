/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/**
 * LiquidShader.js — Advanced GLSL ShaderMaterial for liquid fill effects
 * Phase 3.1.2 Task [9]: Fluid dynamics shader with color mixing and wave animation
 *
 * Exports:
 * - createLiquidMaterial(colorA, colorB, fillLevel) → THREE.ShaderMaterial
 *
 * Uniforms:
 * - uColorA (vec3): Base liquid color
 * - uColorB (vec3): Mixed/reacted liquid color
 * - uFillLevel (float 0.0–1.0): Liquid fill height
 * - uTime (float): Animation time (updated via useFrame)
 * - uMixRatio (float 0.0–1.0): Blend between colorA and colorB (for reaction transitions)
 * - uWaveAmplitude (float): Wave height intensity
 * - uWaveFrequency (float): Wave frequency
 * - uTilt (vec2): Tilt/slosh velocity for dynamic surface deformation
 */
import { ShaderMaterial, Color, Vector2, DoubleSide } from 'three';

// ─── Vertex Shader ────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFillLevel;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  uniform vec2 uTilt;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWave;

  void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;

    vec3 pos = position;

    // Apply wave displacement to the top surface of the liquid
    // Only affects vertices near the top of the geometry
    float topThreshold = 0.45;
    if (pos.y > topThreshold) {
      // Multi-frequency wave for organic feel
      float wave1 = sin(pos.x * uWaveFrequency + uTime * 2.5) * uWaveAmplitude;
      float wave2 = cos(pos.z * uWaveFrequency * 0.7 + uTime * 1.8) * uWaveAmplitude * 0.6;
      float wave3 = sin((pos.x + pos.z) * uWaveFrequency * 1.3 + uTime * 3.2) * uWaveAmplitude * 0.3;

      // Apply slosh from tilt velocity
      float slosh = (pos.x * uTilt.x + pos.z * uTilt.y) * 0.5;

      float totalWave = wave1 + wave2 + wave3 + slosh;
      pos.y += totalWave;
      vWave = totalWave;
    } else {
      vWave = 0.0;
    }

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

// ─── Fragment Shader ──────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uFillLevel;
  uniform float uTime;
  uniform float uMixRatio;
  uniform float uWaveAmplitude;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWave;

  // Smooth noise function for organic color variation
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smooth interpolation

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // ── Fill boundary with soft edge ──
    float waveOffset = sin(vUv.x * 10.0 + uTime * 2.0) * 0.02
                     + cos(vUv.x * 7.0 + uTime * 1.5) * 0.015;
    float fillEdge = uFillLevel + waveOffset;
    float fillMask = smoothstep(fillEdge - 0.02, fillEdge + 0.02, vUv.y);

    // Below fillEdge = liquid, above = transparent
    // Invert: we want opacity below the fill line
    float liquidAlpha = 1.0 - fillMask;

    // ── Color mixing (colorA → colorB based on mixRatio) ──
    // mixRatio transitions during reactions (0 = pure A, 1 = pure B)
    vec3 baseColor = mix(uColorA, uColorB, uMixRatio);

    // ── Depth gradient for realistic liquid appearance ──
    float depthFactor = smoothstep(0.0, 1.0, vUv.y / max(uFillLevel, 0.01));
    vec3 deepColor = baseColor * 0.5;   // Darker at bottom
    vec3 surfaceColor = baseColor * 1.3; // Brighter at surface
    vec3 liquidColor = mix(deepColor, surfaceColor, depthFactor);

    // ── Subsurface scattering approximation ──
    float scatter = noise(vUv * 8.0 + uTime * 0.3) * 0.08;
    liquidColor += scatter;

    // ── Surface highlight (Fresnel-like) ──
    float surfaceHighlight = smoothstep(fillEdge - 0.05, fillEdge, vUv.y) *
                             (1.0 - smoothstep(fillEdge, fillEdge + 0.03, vUv.y));
    liquidColor += surfaceHighlight * 0.25;

    // ── Caustic shimmer effect ──
    float caustic = noise(vUv * 15.0 + vec2(uTime * 0.5, uTime * 0.3)) * 0.06;
    liquidColor += caustic * (1.0 - depthFactor); // More caustics at bottom

    // ── Final alpha ──
    // Semi-transparent with stronger opacity at the bottom
    float finalAlpha = liquidAlpha * mix(0.92, 0.75, depthFactor);

    // Discard fully transparent fragments
    if (finalAlpha < 0.01) discard;

    gl_FragColor = vec4(liquidColor, finalAlpha);
  }
`;

// ─── Factory Function ─────────────────────────────────────────────────────────

/**
 * Creates an advanced ShaderMaterial for liquid fill rendering.
 *
 * @param {string} colorA - Hex color for the base liquid (e.g., '#00f3ff')
 * @param {string} colorB - Hex color for the mixed/reacted state (e.g., '#ff69b4')
 * @param {number} fillLevel - Float 0.0–1.0 representing fill height
 * @param {object} [options] - Additional configuration
 * @param {number} [options.waveAmplitude=0.04] - Wave height intensity
 * @param {number} [options.waveFrequency=6.0] - Wave frequency
 * @param {number} [options.mixRatio=0.0] - Initial color mix ratio
 * @returns {THREE.ShaderMaterial}
 */
export function createLiquidMaterial(
  colorA = '#ffffff',
  colorB = '#ff69b4',
  fillLevel = 0.5,
  options = {}
) {
  const {
    waveAmplitude = 0.04,
    waveFrequency = 6.0,
    mixRatio = 0.0,
  } = options;

  return new ShaderMaterial({
    uniforms: {
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
      uFillLevel: { value: fillLevel },
      uTime: { value: 0.0 },
      uMixRatio: { value: mixRatio },
      uWaveAmplitude: { value: waveAmplitude },
      uWaveFrequency: { value: waveFrequency },
      uTilt: { value: new Vector2(0, 0) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
  });
}

/**
 * Smoothly transitions the mix ratio over a duration (for reaction animations).
 * Call this to animate colorA → colorB transitions.
 *
 * @param {THREE.ShaderMaterial} material - The liquid shader material
 * @param {number} targetMixRatio - Target mix ratio (0.0–1.0)
 * @param {number} duration - Transition duration in seconds (default 1.2s per PRD)
 * @returns {function} Cancel function to abort the transition
 */
export function animateColorTransition(material, targetMixRatio = 1.0, duration = 1.2) {
  if (!material || !material.uniforms) return () => {};

  const startRatio = material.uniforms.uMixRatio.value;
  const startTime = performance.now();
  let cancelled = false;

  function update() {
    if (cancelled) return;

    const elapsed = (performance.now() - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1.0);

    // Linear interpolation per PRD spec
    material.uniforms.uMixRatio.value =
      startRatio + (targetMixRatio - startRatio) * progress;

    if (progress < 1.0) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);

  return () => {
    cancelled = true;
  };
}

export default { createLiquidMaterial, animateColorTransition };
