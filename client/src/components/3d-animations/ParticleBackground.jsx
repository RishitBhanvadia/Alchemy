import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import PropTypes from 'prop-types';

const ParticleBackground = ({ count }) => {
    // Generate particles with stable random values using useMemo
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Use pseudo-randomness or fixed seed if required, but Math.random inside useMemo is only called once per mount/update, which is safe for initialization.
            // However, eslint-plugin-react-hooks might flag it if configured strictly for purity.
            // We can disable the rule here as this is initialization logic.
            const x = (Math.random() - 0.5) * 30; // eslint-disable-line
            const y = (Math.random() - 0.5) * 20; // eslint-disable-line
            const z = (Math.random() - 0.5) * 10; // eslint-disable-line
            const speed = Math.random() * 0.02; // eslint-disable-line
            temp.push({ x, y, z, speed, originalX: x, originalY: y });
        }
        return temp;
    }, [count]);

    const groupRef = useRef();

    useFrame((state) => {
        // Simple ambient motion
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
            groupRef.current.children.forEach((mesh, i) => {
                const particle = particles[i];
                mesh.position.y += Math.sin(state.clock.elapsedTime + particle.x) * 0.01;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((particle, i) => (
                <Sphere key={i} args={[0.05, 8, 8]} position={[particle.x, particle.y, particle.z]}>
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                </Sphere>
            ))}
            {/* eslint-disable-next-line react/no-unknown-property */}
            <ambientLight intensity={0.2} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <pointLight position={[10, 10, 10]} intensity={0.5} />
        </group>
    );
};

ParticleBackground.propTypes = {
    count: PropTypes.number
};

export default ParticleBackground;
