/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const FloatingMolecule = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Auto-rotation
        meshRef.current.rotation.y = time * 0.1;
        meshRef.current.rotation.x = time * 0.05;

        // Look at mouse (subtle effect)
        const { x, y } = state.mouse;
        meshRef.current.rotation.x += y * 0.05;
        meshRef.current.rotation.y += x * 0.05;
    });

    return (
        <group ref={meshRef}>
            {/* Central Atom */}
            <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#ff0055" roughness={0.3} metalness={0.8} />
            </Sphere>

            {/* Surrounding Atoms (Buckyball-ish structure) */}
            {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const x = Math.cos(angle) * 2;
                const y = Math.sin(angle) * 2;
                return (
                    <group key={i} position={[x, y, 0]}>
                        <Sphere args={[0.4, 32, 32]}>
                            <meshStandardMaterial color="#00aaff" roughness={0.3} metalness={0.8} />
                        </Sphere>
                        {/* Bonds */}
                        <mesh position={[-x / 2, -y / 2, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
                            <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
                        </mesh>
                    </group>
                );
            })}
            {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const x = Math.cos(angle) * 2;
                const z = Math.sin(angle) * 2;
                return (
                    <group key={i + 6} position={[x, 0, z]}>
                        <Sphere args={[0.4, 32, 32]}>
                            <meshStandardMaterial color="#00ffaa" roughness={0.3} metalness={0.8} />
                        </Sphere>
                        {/* Bonds */}
                        <mesh position={[-x / 2, 0, -z / 2]} rotation={[0, -angle - Math.PI / 2, Math.PI / 2]}>
                            <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
                            <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
                        </mesh>
                    </group>
                );
            })}

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={2} color="#ff0055" />
        </group>
    );
};

export default FloatingMolecule;
