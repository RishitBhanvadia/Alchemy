/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFrame } from '@react-three/fiber';
import { Object3D } from 'three';

const ParticleBackground = ({ count = 100 }) => {
    const meshRef = useRef();

    // Generate random particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 10;
            const speed = Math.random() * 0.02;
            temp.push({ x, y, z, speed, originalX: x, originalY: y });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new Object3D(), []);

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
