import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ReactiveBeaker = ({ status }) => {
    const liquidRef = useRef();
    const [liquidColor, setLiquidColor] = useState(new THREE.Color('#00aaff'));
    const [waveHeight, setWaveHeight] = useState(0.1);

    useEffect(() => {
        if (status === 'success') {
            setLiquidColor(new THREE.Color('#00ff00')); // Green
            setWaveHeight(0.05);
        } else if (status === 'failed') {
            setLiquidColor(new THREE.Color('#ff0000')); // Red
            setWaveHeight(0.3); // Boiling
        } else if (status === 'loading') {
            setLiquidColor(new THREE.Color('#00aaff')); // Blue
            setWaveHeight(0.2); // Sloshing
        } else {
            setLiquidColor(new THREE.Color('#cccccc')); // Neutral
            setWaveHeight(0);
        }
    }, [status]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (liquidRef.current) {
            // Simple liquid animation
            liquidRef.current.scale.y = 1 + Math.sin(time * 5) * waveHeight * 0.1;
            liquidRef.current.position.y = -0.5 + Math.sin(time * 3) * waveHeight * 0.1;
        }
    });

    return (
        <group position={[3, 0, 0]}> {/* Positioned to the right side of the screen */}
            {/* Glass Beaker */}
            <Cylinder args={[1, 1, 3, 32, 1, true]}>
                <MeshTransmissionMaterial
                    thickness={0.2}
                    roughness={0}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.1}
                    backside
                />
            </Cylinder>

            {/* Liquid */}
            <Cylinder ref={liquidRef} args={[0.9, 0.9, 1.5, 32]} position={[0, -0.7, 0]}>
                <meshStandardMaterial color={liquidColor} transparent opacity={0.8} />
            </Cylinder>

            {/* Beaker Bottom */}
            <Cylinder args={[1, 1, 0.1, 32]} position={[0, -1.5, 0]}>
                <MeshTransmissionMaterial
                    thickness={0.2}
                    roughness={0}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.1}
                />
            </Cylinder>

            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1} />
        </group>
    );
};

export default ReactiveBeaker;
