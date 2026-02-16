/* eslint-disable react/no-unknown-property */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const ReactiveBeaker = ({ status }) => {
    const liquidRef = useRef();
    const [liquidColor, setLiquidColor] = useState(new THREE.Color('#00aaff')); // Blue default

    useEffect(() => {
        if (status === 'success') {
            setLiquidColor(new THREE.Color('#00ff88')); // Green
        } else if (status === 'loading') {
            setLiquidColor(new THREE.Color('#ffff00')); // Yellow
        } else if (status === 'failed') {
            setLiquidColor(new THREE.Color('#ff0000')); // Red
        } else {
            setLiquidColor(new THREE.Color('#00aaff')); // Default
        }
    }, [status]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (liquidRef.current) {
            liquidRef.current.position.y = Math.sin(time * 2) * 0.05 - 0.2;
            liquidRef.current.scale.set(1 + Math.sin(time * 3) * 0.02, 1, 1 + Math.sin(time * 3) * 0.02);
        }
    });

    // Memoize random positions for bubbles to avoid re-calculation on every render
    const bubblePositions = useMemo(() => {
        const positions = [];
        for (let i = 0; i < 10; i++) {
            positions.push([
                (Math.random() - 0.5) * 1.5, // eslint-disable-line
                (Math.random() - 0.5) * 2, // eslint-disable-line
                (Math.random() - 0.5) * 1.5 // eslint-disable-line
            ]);
        }
        return positions;
    }, []);

    return (
        <group>
            {/* Glass Beaker Body */}
            <Cylinder args={[1, 1.2, 2.5, 32]} position={[0, 0, 0]}>
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.9}
                    thickness={0.1}
                />
            </Cylinder>

            {/* Liquid inside */}
            <Cylinder ref={liquidRef} args={[0.9, 1.1, 1.5, 32]} position={[0, -0.4, 0]}>
                <meshStandardMaterial
                    color={liquidColor}
                    transparent
                    opacity={0.8}
                    roughness={0.2}
                    metalness={0.5}
                    emissive={liquidColor}
                    emissiveIntensity={0.5}
                />
            </Cylinder>

            {/* Bubbles */}
            {status === 'loading' && bubblePositions.map((pos, i) => (
                <Sphere key={i} args={[0.05, 16, 16]} position={pos}>
                    <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
                </Sphere>
            ))}

            <pointLight position={[2, 3, 2]} intensity={2} color="#ffffff" />
        </group>
    );
};

ReactiveBeaker.propTypes = {
    status: PropTypes.string
};

export default ReactiveBeaker;
