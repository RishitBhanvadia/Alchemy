import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';

/**
 * ParticleSystem — Creates dynamic 3D visual effects for chemical reactions.
 * Uses InstancedMesh for high performance. Handles both underwater bubbles and surface smoke/gas.
 */
const ParticleSystem = ({ active }) => {
    // We'll use a single instanced mesh for bubbles.
    const bubbleCount = 40;
    const smokeCount = 30;

    const bubbleMeshRef = useRef();
    const smokeMeshRef = useRef();

    // Initialize bubble physics data
    const [bubbles] = React.useState(() => {
        return new Array(bubbleCount).fill().map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 1.5, // Spread across beaker radius
                -1.4 + Math.random() * 0.5,  // Start near bottom
                (Math.random() - 0.5) * 1.5
            ),
            velocity: 0.5 + Math.random() * 1.5, // Upward speed
            wobbleSpeed: 2 + Math.random() * 3,
            wobbleOffset: Math.random() * Math.PI * 2,
            scale: 0.2 + Math.random() * 0.3,
            life: Math.random() // Stagger start times
        }));
    });

    // Initialize smoke physics data
    const [smoke] = React.useState(() => {
        return new Array(smokeCount).fill().map(() => ({
            position: new THREE.Vector3(
                (Math.random() - 0.5) * 1.0, 
                1.0 + Math.random() * 0.5,  // Start near top
                (Math.random() - 0.5) * 1.0
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.8, // Slow outward spread
                1.0 + Math.random() * 1.0,   // Upward lift
                (Math.random() - 0.5) * 0.8
            ),
            scale: 0.5 + Math.random() * 1.0,
            life: Math.random(),
            opacityMod: Math.random()
        }));
    });

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state, delta) => {
        if (!active) return; // Only animate when reaction is triggered

        const time = state.clock.elapsedTime;

        // 1. Update Bubbles
        if (bubbleMeshRef.current) {
            bubbles.forEach((bubble, i) => {
                // Move up
                bubble.position.y += bubble.velocity * delta;
                
                // Sine wobble horizontally
                const wobbleX = Math.sin(time * bubble.wobbleSpeed + bubble.wobbleOffset) * 0.05;
                const wobbleZ = Math.cos(time * bubble.wobbleSpeed * 0.8 + bubble.wobbleOffset) * 0.05;
                
                // Reset to bottom if it reaches the surface (y ~ 0.8)
                if (bubble.position.y > 0.8) {
                    bubble.position.y = -1.4;
                    bubble.position.x = (Math.random() - 0.5) * 1.2;
                    bubble.position.z = (Math.random() - 0.5) * 1.2;
                }

                dummy.position.copy(bubble.position);
                dummy.position.x += wobbleX;
                dummy.position.z += wobbleZ;
                dummy.scale.setScalar(bubble.scale);
                dummy.updateMatrix();
                bubbleMeshRef.current.setMatrixAt(i, dummy.matrix);
            });
            bubbleMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        // 2. Update Smoke
        if (smokeMeshRef.current) {
            smoke.forEach((particle, i) => {
                // Move based on velocity (spreading outward and lifting upward)
                particle.position.addScaledVector(particle.velocity, delta);
                
                // Increase scale as it rises (dissipates)
                particle.scale += delta * 0.5;
                
                // Track lifecycle
                particle.life += delta * 0.5;

                // Reset when life exceeds 1 (fully dissipated)
                if (particle.life > 1.0) {
                    particle.life = 0;
                    particle.position.set(
                        (Math.random() - 0.5) * 1.0,
                        1.0, // Respawn at rim
                        (Math.random() - 0.5) * 1.0
                    );
                    particle.scale = 0.5 + Math.random();
                }

                // Smooth scaling
                dummy.position.copy(particle.position);
                dummy.scale.setScalar(particle.scale);
                dummy.updateMatrix();
                smokeMeshRef.current.setMatrixAt(i, dummy.matrix);
                
                // We'll pass the opacity modifier to instance colors if needed, but for simplicity
                // in InstancedMesh StandardMaterial without custom shaders, opacity is global.
                // We fake the fade-out visually by scaling them up heavily as they rise, 
                // making them look like dissipating cloud puffs.
            });
            smokeMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    if (!active) return null;

    return (
        <group>
            {/* Bubbles (White/Cyan, spherical) */}
            <instancedMesh ref={bubbleMeshRef} args={[null, null, bubbleCount]}>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshStandardMaterial 
                    color="#ffffff" 
                    transparent 
                    opacity={0.6} 
                    roughness={0.1} 
                    metalness={0.8} 
                />
            </instancedMesh>

            {/* Smoke (Grey/Green, semi-transparent spheres that scale up) */}
            <instancedMesh ref={smokeMeshRef} args={[null, null, smokeCount]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial 
                    color="#bbddbb" 
                    transparent 
                    opacity={0.2} 
                    depthWrite={false}
                />
            </instancedMesh>
        </group>
    );
};

ParticleSystem.propTypes = {
    active: PropTypes.bool.isRequired,
};

export default ParticleSystem;
