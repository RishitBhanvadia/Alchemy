import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { RigidBody } from '@react-three/rapier';
import { Cylinder, MeshTransmissionMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const DraggableFlask = React.forwardRef(({ position, label, color, onPour, maxAmount = 100 }, ref) => {
    const api = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const [amount, setAmount] = useState(maxAmount);
    
    // Pouring logic
    const isPouring = useRef(false);
    
    const bind = useDrag(({ active, movement: [x, y], event }) => {
        if (active) {
            event.stopPropagation();
            setIsDragging(true);
            // Convert pixel movement to 3D space movement roughly
            if (api.current) {
                // Determine target position based on drag
                // Here we just move it linearly, locking z for 2.5D physics
                api.current.setTranslation({ x: position[0] + x / 50, y: position[1] - y / 50, z: position[2] }, true);
                api.current.setLinvel({ x: 0, y: 0, z: 0 }); // STOP falling while dragging
                
                // If dragged near the center tube, tilt it
                if (position[0] + x / 50 > -1.5 && position[0] + x / 50 < 1.5 && position[1] - y / 50 > 1.5) {
                    api.current.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 3)), true);
                    if (!isPouring.current && amount > 0) {
                        isPouring.current = true;
                    }
                } else {
                    api.current.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)), true);
                    isPouring.current = false;
                }
            }
        } else {
            setIsDragging(false);
            isPouring.current = false;
            if (api.current) {
                // Snap back to original position shelf or drop
                api.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
                api.current.setRotation(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)), true);
            }
        }
    }, { pointerEvents: true });

    useFrame((state, delta) => {
        if (isPouring.current && amount > 0) {
            setAmount((prev) => Math.max(0, prev - delta * 20)); // Pouring speed
            onPour(delta * 20); // Signal top level
        }
    });

    return (
        <RigidBody
            ref={api}
            type={isDragging ? "kinematicPosition" : "dynamic"}
            position={position}
            colliders="hull"
            lockRotations={!isDragging}
            lockTranslationsZ={true} // Keep it in 2D plane
        >
            <group {...bind()} style={{ touchAction: 'none' }} cursor={isDragging ? 'grabbing' : 'grab'}>
                {/* Visual Flask */}
                <Cylinder args={[0.5, 0.5, 1.5, 32]} position={[0, 0, 0]}>
                    <MeshTransmissionMaterial
                        thickness={0.1}
                        roughness={0}
                        transmission={1}
                        ior={1.5}
                        chromaticAberration={0.1}
                        backside
                    />
                </Cylinder>
                {/* Liquid Inside */}
                {amount > 0 && (
                    <Cylinder args={[0.45, 0.45, 1.4 * (amount / 100), 32]} position={[0, -0.7 + (0.7 * (amount / 100)), 0]}>
                        <meshStandardMaterial color={color} transparent opacity={0.8} />
                    </Cylinder>
                )}
                {/* Label */}
                <Text position={[0, 0, 0.51]} fontSize={0.3} color="black">
                    {label}
                </Text>
            </group>
        </RigidBody>
    );
});

DraggableFlask.displayName = 'DraggableFlask';

DraggableFlask.propTypes = {
    position: PropTypes.array,
    label: PropTypes.string,
    color: PropTypes.string,
    onPour: PropTypes.func,
    maxAmount: PropTypes.number
};

export default DraggableFlask;
