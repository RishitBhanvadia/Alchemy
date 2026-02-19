/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const FloatingMolecule = ({ count = 20, speed = 2 }) => {
    const group = useRef();

    // Create random positions for atoms
    // Fixed: Use useState initializer to ensure purity
    const [atoms] = useState(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            const size = Math.random() * 0.2 + 0.1;
            temp.push({ position: [x, y, z], size, color: i % 2 === 0 ? '#00ffff' : '#ff00ff' });
        }
        return temp;
    });

    // Create connections between close atoms
    const bonds = useMemo(() => {
        const temp = [];
        atoms.forEach((atom1, i) => {
            atoms.forEach((atom2, j) => {
                if (i < j) {
                    const dist = new THREE.Vector3(...atom1.position).distanceTo(new THREE.Vector3(...atom2.position));
                    if (dist < 3) {
                        temp.push({ start: atom1.position, end: atom2.position });
                    }
                }
            });
        });
        return temp;
    }, [atoms]);

    useFrame((state) => {
        if (!group.current) return;
        const time = state.clock.getElapsedTime();
        group.current.rotation.y = time * 0.1 * speed;
        group.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={group}>
                {atoms.map((atom, i) => (
                    <Sphere key={i} args={[atom.size, 16, 16]} position={atom.position}>
                        <meshStandardMaterial
                            color={atom.color}
                            emissive={atom.color}
                            emissiveIntensity={0.5}
                            roughness={0.2}
                            metalness={0.8}
                        />
                    </Sphere>
                ))}

                {bonds.map((bond, i) => {
                    const start = new THREE.Vector3(...bond.start);
                    const end = new THREE.Vector3(...bond.end);
                    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
                    const dist = start.distanceTo(end);

                    return (
                        <mesh key={`bond-${i}`} position={mid} rotation={[0, 0, Math.atan2(end.y - start.y, end.x - start.x)]} >
                            <boxGeometry args={[dist, 0.05, 0.05]} />
                            <meshStandardMaterial
                                color="#ffffff"
                                transparent
                                opacity={0.3}
                                emissive="#ffffff"
                                emissiveIntensity={0.2}
                            />
                        </mesh>
                    );
                })}
            </group>
        </Float>
    );
};

FloatingMolecule.propTypes = {
    count: PropTypes.number,
    speed: PropTypes.number
};

export default FloatingMolecule;