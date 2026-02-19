/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const ReactiveBeaker = ({ status }) => {
    const meshRef = useRef();
    const liquidRef = useRef();

    // Memoize geometry and material configuration
    const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 2, 32), []);
    const liquidGeometry = useMemo(() => new THREE.CylinderGeometry(0.9, 0.9, 1.8, 32), []);

    useFrame((state) => {
        if (!meshRef.current || !liquidRef.current) return;

        const time = state.clock.getElapsedTime();

        // Animate beaker
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.1;

        // Animate liquid based on status
        if (status === 'reacting') {
            liquidRef.current.scale.y = 1 + Math.sin(time * 5) * 0.1;
            liquidRef.current.material.color.setHSL((time * 0.2) % 1, 0.8, 0.5);
        } else if (status === 'complete') {
            liquidRef.current.scale.y = 1;
            liquidRef.current.material.color.set('#00ff88');
        } else {
            liquidRef.current.scale.y = 1 + Math.sin(time) * 0.05;
            liquidRef.current.material.color.set('#0088ff');
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group>
                {/* Glass Beaker */}
                <mesh ref={meshRef} geometry={geometry}>
                    <MeshTransmissionMaterial
                        backside
                        samples={4}
                        thickness={0.2}
                        roughness={0}
                        ior={1.5}
                        chromaticAberration={0.1}
                        anisotropy={0.1}
                        distortion={0.1}
                        distortionScale={0.1}
                        temporalDistortion={0.1}
                        clearcoat={1}
                        attenuationDistance={0.5}
                        attenuationColor="#ffffff"
                        color="#ffffff"
                    />
                </mesh>

                {/* Liquid */}
                <mesh ref={liquidRef} geometry={liquidGeometry} position={[0, -0.1, 0]}>
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.8}
                        metalness={0.2}
                        roughness={0.1}
                        transmission={0.5}
                        thickness={1}
                    />
                </mesh>
            </group>
        </Float>
    );
};

ReactiveBeaker.propTypes = {
    status: PropTypes.string
};

export default ReactiveBeaker;