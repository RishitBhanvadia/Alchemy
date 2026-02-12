import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingMolecule = () => {
    const meshRef = useRef();

    // Memoize geometries
    const centralSphereGeom = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);
    const smallSphereGeom = useMemo(() => new THREE.SphereGeometry(0.4, 32, 32), []);
    const bondGeom = useMemo(() => new THREE.CylinderGeometry(0.1, 0.1, 2, 32), []);

    // Memoize materials
    const centralMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ff0055", roughness: 0.3, metalness: 0.8
    }), []);
    const blueMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#00aaff", roughness: 0.3, metalness: 0.8
    }), []);
    const greenMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#00ffaa", roughness: 0.3, metalness: 0.8
    }), []);
    const bondMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ffffff", opacity: 0.5, transparent: true
    }), []);

    // Cleanup materials and geometries on unmount
    useEffect(() => {
        return () => {
            centralSphereGeom.dispose();
            smallSphereGeom.dispose();
            bondGeom.dispose();
            centralMat.dispose();
            blueMat.dispose();
            greenMat.dispose();
            bondMat.dispose();
        };
    }, [centralSphereGeom, smallSphereGeom, bondGeom, centralMat, blueMat, greenMat, bondMat]);

    // Pre-calculate positions and rotations for surrounding atoms
    const surroundingSet1 = useMemo(() => {
        return [...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 2;
            const y = Math.sin(angle) * 2;
            return {
                id: i,
                position: [x, y, 0],
                bondPosition: [-x / 2, -y / 2, 0],
                bondRotation: [0, 0, angle + Math.PI / 2]
            };
        });
    }, []);

    const surroundingSet2 = useMemo(() => {
        return [...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 2;
            const z = Math.sin(angle) * 2;
            return {
                id: i + 6,
                position: [x, 0, z],
                bondPosition: [-x / 2, 0, -z / 2],
                bondRotation: [0, -angle - Math.PI / 2, Math.PI / 2]
            };
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (meshRef.current) {
            // Auto-rotation
            meshRef.current.rotation.y = time * 0.1;
            meshRef.current.rotation.x = time * 0.05;

            // Look at mouse (subtle effect)
            const { x, y } = state.mouse;
            meshRef.current.rotation.x += y * 0.05;
            meshRef.current.rotation.y += x * 0.05;
        }
    });

    return (
        <group ref={meshRef}>
            {/* Central Atom */}
            <mesh geometry={centralSphereGeom} material={centralMat} position={[0, 0, 0]} />

            {/* Surrounding Atoms Set 1 (Blue) */}
            {surroundingSet1.map((atom) => (
                <group key={atom.id} position={atom.position}>
                    <mesh geometry={smallSphereGeom} material={blueMat} />
                    {/* Bonds */}
                    <mesh position={atom.bondPosition} rotation={atom.bondRotation} geometry={bondGeom} material={bondMat} />
                </group>
            ))}

            {/* Surrounding Atoms Set 2 (Green) */}
            {surroundingSet2.map((atom) => (
                <group key={atom.id} position={atom.position}>
                    <mesh geometry={smallSphereGeom} material={greenMat} />
                    {/* Bonds */}
                    <mesh position={atom.bondPosition} rotation={atom.bondRotation} geometry={bondGeom} material={bondMat} />
                </group>
            ))}

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={2} color="#ff0055" />
        </group>
    );
};

export default FloatingMolecule;
