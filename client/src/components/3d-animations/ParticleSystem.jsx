/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Object3D, Color } from 'three';
import PropTypes from 'prop-types';

const ParticleSystem = ({ active, config }) => {
    const bubbleCount = 40;
    const smokeCount = 30;
    const heatCount = 25;

    const bubbleMeshRef = useRef();
    const smokeMeshRef = useRef();
    const heatMeshRef = useRef();

    const isGas = config?.stateChange?.includes('Gas');
    const isExothermic = config?.thermal?.includes('Exothermic');
    const isEndothermic = config?.thermal?.includes('Endothermic');

    const bubbleColor = isExothermic ? new Color('#FF6B35') : new Color('#ffffff');
    const smokeColor = isGas ? new Color('#cccccc') : new Color('#bbddbb');
    const heatColor = isExothermic ? new Color('#FF6B35') : (isEndothermic ? new Color('#60A5FA') : new Color('#ffffff'));

    const bubbles = useMemo(() => {
        return new Array(bubbleCount).fill().map(() => ({
            position: new Vector3(
                (Math.random() - 0.5) * 1.5,
                -1.4 + Math.random() * 0.5,
                (Math.random() - 0.5) * 1.5
            ),
            velocity: 0.5 + Math.random() * 1.5,
            wobbleSpeed: 2 + Math.random() * 3,
            wobbleOffset: Math.random() * Math.PI * 2,
            scale: 0.2 + Math.random() * 0.3,
            life: Math.random()
        }));
    }, [bubbleCount]);

    const smoke = useMemo(() => {
        return new Array(smokeCount).fill().map(() => ({
            position: new Vector3(
                (Math.random() - 0.5) * 1.0,
                1.0 + Math.random() * 0.5,
                (Math.random() - 0.5) * 1.0
            ),
            velocity: new Vector3(
                (Math.random() - 0.5) * 0.8,
                1.0 + Math.random() * 1.0,
                (Math.random() - 0.5) * 0.8
            ),
            scale: 0.5 + Math.random() * 1.0,
            life: Math.random(),
            opacityMod: Math.random()
        }));
    }, [smokeCount]);

    const heatParticles = useMemo(() => {
        return new Array(heatCount).fill().map(() => ({
            position: new Vector3(
                (Math.random() - 0.5) * 1.0,
                -1.0 + Math.random() * 0.5,
                (Math.random() - 0.5) * 1.0
            ),
            velocity: 0.3 + Math.random() * 0.5,
            scale: 0.1 + Math.random() * 0.15,
            life: Math.random(),
            wobbleOffset: Math.random() * Math.PI * 2
        }));
    }, [heatCount]);

    const dummy = useMemo(() => new Object3D(), []);

    useFrame((state, delta) => {
        if (!active) return;

        const time = state.clock.elapsedTime;

        const shouldShowBubbles = isGas || isExothermic || !config;
        const shouldShowSmoke = isGas;
        const shouldShowHeat = isExothermic;

        if (shouldShowBubbles && bubbleMeshRef.current) {
            bubbles.forEach((bubble, i) => {
                bubble.position.y += bubble.velocity * delta;
                
                const wobbleX = Math.sin(time * bubble.wobbleSpeed + bubble.wobbleOffset) * 0.05;
                const wobbleZ = Math.cos(time * bubble.wobbleSpeed * 0.8 + bubble.wobbleOffset) * 0.05;
                
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

        if (shouldShowSmoke && smokeMeshRef.current) {
            smoke.forEach((particle, i) => {
                particle.position.addScaledVector(particle.velocity, delta);
                particle.scale += delta * 0.5;
                particle.life += delta * 0.5;

                if (particle.life > 1.0) {
                    particle.life = 0;
                    particle.position.set(
                        (Math.random() - 0.5) * 1.0,
                        1.0,
                        (Math.random() - 0.5) * 1.0
                    );
                    particle.scale = 0.5 + Math.random();
                }

                dummy.position.copy(particle.position);
                dummy.scale.setScalar(particle.scale);
                dummy.updateMatrix();
                smokeMeshRef.current.setMatrixAt(i, dummy.matrix);
            });
            smokeMeshRef.current.instanceMatrix.needsUpdate = true;
        }

        if (shouldShowHeat && heatMeshRef.current) {
            heatParticles.forEach((particle, i) => {
                particle.position.y += particle.velocity * delta;
                
                const wobbleX = Math.sin(time * 3 + particle.wobbleOffset) * 0.03;
                const wobbleZ = Math.cos(time * 2.5 + particle.wobbleOffset) * 0.03;
                
                particle.life += delta * 0.4;

                if (particle.position.y > 1.2 || particle.life > 1.0) {
                    particle.life = 0;
                    particle.position.set(
                        (Math.random() - 0.5) * 1.0,
                        -1.0 + Math.random() * 0.5,
                        (Math.random() - 0.5) * 1.0
                    );
                }

                const fadeOut = 1.0 - particle.life;
                dummy.position.copy(particle.position);
                dummy.position.x += wobbleX;
                dummy.position.z += wobbleZ;
                dummy.scale.setScalar(particle.scale * fadeOut);
                dummy.updateMatrix();
                heatMeshRef.current.setMatrixAt(i, dummy.matrix);
            });
            heatMeshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    if (!active) return null;

    return (
        <group>
            {(isGas || isExothermic || !config) && (
                <instancedMesh ref={bubbleMeshRef} args={[null, null, bubbleCount]}>
                    <sphereGeometry args={[0.1, 12, 12]} />
                    <meshStandardMaterial 
                        color={bubbleColor} 
                        transparent 
                        opacity={0.6} 
                        roughness={0.1} 
                        metalness={0.8} 
                    />
                </instancedMesh>
            )}

            {isGas && (
                <instancedMesh ref={smokeMeshRef} args={[null, null, smokeCount]}>
                    <sphereGeometry args={[0.2, 8, 8]} />
                    <meshStandardMaterial 
                        color={smokeColor} 
                        transparent 
                        opacity={0.2} 
                        depthWrite={false}
                    />
                </instancedMesh>
            )}

            {isExothermic && (
                <instancedMesh ref={heatMeshRef} args={[null, null, heatCount]}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial 
                        color={heatColor} 
                        transparent 
                        opacity={0.5} 
                        depthWrite={false}
                    />
                </instancedMesh>
            )}
        </group>
    );
};

ParticleSystem.propTypes = {
    active: PropTypes.bool.isRequired,
    config: PropTypes.shape({
        stateChange: PropTypes.string,
        thermal: PropTypes.string,
    }),
};

export default ParticleSystem;
