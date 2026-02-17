import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
// import { Icosahedron } from '@react-three/drei';

const FloatingMolecule = ({ position = [0, 0, 0], scale = 1, speed = 1 }) => {
    const group = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed;
        group.current.rotation.x = t * 0.3;
        group.current.rotation.y = t * 0.2;
        group.current.position.y = position[1] + Math.sin(t) * 0.5;
    });

    return (
        <group ref={group} position={position} scale={[scale, scale, scale]}>
            {/* Central Atom */}
            <mesh>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#00ff88"
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>

            {/* Orbiting Atoms */}
            <group rotation={[0, 0, Math.PI / 3]}>
                <mesh position={[2, 0, 0]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial
                        color="#00aaff"
                        roughness={0.2}
                        metalness={0.5}
                    />
                </mesh>
            </group>

            <group rotation={[0, 0, -Math.PI / 3]}>
                <mesh position={[2, 0, 0]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial
                        color="#ff0055"
                        roughness={0.2}
                        metalness={0.5}
                    />
                </mesh>
            </group>

            {/* Electron Rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2, 0.02, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>
            <mesh rotation={[0, Math.PI / 3, 0]}>
                <torusGeometry args={[2, 0.02, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>
            <mesh rotation={[0, -Math.PI / 3, 0]}>
                <torusGeometry args={[2, 0.02, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>

            {/* Glow Effect */}
            <pointLight position={[0, 0, 0]} intensity={2} distance={5} color="#00ff88" />
        </group>
    );
};

import PropTypes from 'prop-types';

FloatingMolecule.propTypes = {
    position: PropTypes.array,
    scale: PropTypes.number,
    speed: PropTypes.number
};

export default FloatingMolecule;
