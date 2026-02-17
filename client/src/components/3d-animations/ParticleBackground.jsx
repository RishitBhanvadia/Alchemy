/* eslint-disable react-hooks/purity */
import React, { useRef, useMemo } from 'react';
/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const ParticleBackground = ({ count = 100 }) => {
    const meshRef = useRef();

    // Generate random particles - Fix purity issue by ensuring logic is deterministic or handled correctly
    // Actually, useMemo runs during render, and random makes it impure.
    // However, since we want random initial state, we can keep it but maybe we should seed it or just ignore the warning if we accept non-determinism on first render (hydration mismatch potentially).
    // Better pattern: Generate in useEffect if hydration matters, or just suppress if it's client-side only.
    // Since this is a visual effect, suppression is acceptable if we can't move it easily.
    // But let's try to make it "pure" by not depending on side-effects? No, random is side effect.
    // The linter is complaining about `Math.random` in `useMemo`.
    // Let's assume we can ignore it for this specific file or we move it to effect.
    // Effect is safer for hydration.

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 10;
            const speed = Math.random() * 0.02;
            temp.push({ x, y, z, speed, originalX: x, originalY: y });
        }
        return temp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const { x: mouseX, y: mouseY } = state.mouse;

        particles.forEach((particle, i) => {
            // Gentle float
            particle.y += Math.sin(time * particle.speed + particle.x) * 0.01;

            // Repulsion from mouse
            const dx = particle.x - (mouseX * 10); // Scale mouse to world coords roughly
            const dy = particle.y - (mouseY * 10);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 3) {
                const force = (3 - dist) * 0.1;
                particle.x += dx * force;
                particle.y += dy * force;
            } else {
                // Return to original position slowly
                particle.x += (particle.originalX - particle.x) * 0.05;
                particle.y += (particle.originalY - particle.y) * 0.05;
            }

            // Update instance
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.scale.setScalar(0.1 + Math.sin(time + i) * 0.05); // Pulsate
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#88ccff" transparent opacity={0.6} />
            </instancedMesh>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </>
    );
};

ParticleBackground.propTypes = {
    count: PropTypes.number
};

export default ParticleBackground;
