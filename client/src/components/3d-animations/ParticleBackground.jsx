/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleBackground = ({ count = 100 }) => {
    const meshRef = useRef();

    // Use useMemo correctly with a pseudo-random generator or just accept random here is fine if we ignore impurity for initialization?
    // The linter complains about Math.random() in useMemo.
    // Better: Generate particles in a ref/effect or outside component?
    // If we want it stable, we can seed it or just run it once.
    // But useMemo IS for expensive calculations. The linter "react-hooks/purity" is strict about Math.random.
    // We can move it to a useEffect and use state, OR just suppress the warning if we don't care about purity here (random is expected).

    // Let's use lazy initialization with useState which is cleaner for "run once".
    // useState(() => initialValue)

    // BUT useState initializer must also be pure technically? No, it runs once.
    // Let's try useState lazy init.

    const [particles] = React.useState(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 10;
            const speed = Math.random() * 0.02;
            temp.push({ x, y, z, speed, originalX: x, originalY: y });
        }
        return temp;
    });

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

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
