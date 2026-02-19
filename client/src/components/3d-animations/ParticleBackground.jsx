/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const ParticleBackground = ({ count = 500 }) => {
    const mesh = useRef();
    const light = useRef();

    // Use useState initializer to generate random particles once
    // This avoids "impure render" warnings
    const [particles] = useState(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100;
            const factor = Math.random() * 100;
            const speed = Math.random() * 0.01;
            const x = Math.random() * 100 - 50;
            const y = Math.random() * 100 - 50;
            const z = Math.random() * 100 - 50;

            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    });

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!mesh.current || !light.current) return;

        particles.forEach((particle, i) => {
            let { time, factor, speed, x, y, z } = particle;

            // Update particle position
            time = particle.time += speed / 2;
            const s = Math.cos(time);

            dummy.position.set(
                x + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
                y + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 10,
                z + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10
            );

            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshPhongMaterial color="#050505" />
            </instancedMesh>
        </>
    );
};

ParticleBackground.propTypes = {
    count: PropTypes.number
};

export default ParticleBackground;