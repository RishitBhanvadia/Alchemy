/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { shaderMaterial } from '@react-three/drei';
import { Color, Vector2 } from 'three';

/**
 * LiquidShaderMaterial - A custom shader material for fluid dynamics inside the flasks.
 * 
 * Uniforms:
 * - uTime: For continuous wave animation (passed from useFrame).
 * - uColor: Base color of the chemical.
 * - uFillAmount: How full the flask is (0.0 to 1.0). Controls the upper bounding plane.
 * - uTilt: Vector2 representing the tilt/slosh velocity (x, z).
 */
export const LiquidMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new Color('#00f3ff'),
        uFillAmount: 1.0, 
        uTilt: new Vector2(0, 0)
    },
    // VERTEX SHADER
    `
    uniform float uTime;
    uniform float uFillAmount;
    uniform vec2 uTilt;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        
        // We assume a standard cylinder mapped strictly from y=-0.5 to y=0.5 in geometry,
        // but scaled up by the mesh. We will apply displacement only to the top vertices.
        // For a cylinder geometry with heightSegments > 1, the top face has y = 0.5.
        
        vec3 pos = position;

        // Apply wave only if this vertex is near the top of the liquid body
        if(pos.y > 0.49) {
            // Very simple sine wave based on X, Z, and Time
            float wave = sin(pos.x * 5.0 + uTime * 3.0) * 0.05 
                       + cos(pos.z * 5.0 + uTime * 2.5) * 0.05;
            
            // Apply slosh (tilt) based on X and Z
            float slosh = (pos.x * uTilt.x) + (pos.z * uTilt.y);

            pos.y += wave + slosh;
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
    `,
    // FRAGMENT SHADER
    `
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        // Base color
        vec3 finalColor = uColor;

        // Add a slight gradient based on Y position for depth
        float depthMod = smoothstep(-0.5, 0.5, vPosition.y);
        finalColor = mix(finalColor * 0.6, finalColor * 1.2, depthMod);

        // Simple rim/edge highlight simulation on top
        if(vPosition.y > 0.45) {
            finalColor += vec3(0.1); // Add a little brightness to the surface
        }

        gl_FragColor = vec4(finalColor, 0.85); // Semi-transparent for liquid look
    }
    `
);

// We don't strictly need to extend here if we use it directly as <primitive object={new LiquidMaterial()} />
// but it's common practice to make it a globally available intrinsic component.
// However, to keep it simple and encapsulated without global side effects,
// we will just export the class and instantiate it in DraggableFlask.
