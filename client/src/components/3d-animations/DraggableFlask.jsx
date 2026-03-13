/* eslint-disable react/prop-types, react/no-unknown-property, react-hooks/exhaustive-deps, no-unused-vars */
import React, { useRef, useState, useCallback } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { Cylinder, MeshTransmissionMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';
import PropTypes from 'prop-types';
/* eslint-disable react/no-unknown-property */
import { toast } from 'react-hot-toast';
import { LiquidMaterial } from './LiquidShaderMaterial';

extend({ LiquidMaterial });

/**
 * DraggableFlask — A 3D flask that can be clicked and dragged using R3F-native
 * pointer events. Attach events to the Mesh level for better raycasting reliability.
 */
const DraggableFlask = ({ position = [0, 0, 0], label, color, onPour, maxAmount = 100, locked = false }) => {
    const groupRef = useRef();
    const [amount, setAmount] = useState(maxAmount);
    
    // Detect mobile for segments optimisation
    const isMobile = window.innerWidth < 768;
    const segments = isMobile ? 16 : 32;
    const currentPos = useRef(new THREE.Vector3(...position));
    const isPouring = useRef(false);
    const isTilted = useRef(false);
    const dragActive = useRef(false);
    
    // Shader refs
    const liquidMatRef = useRef();
    const velocityTracker = useRef(new THREE.Vector2());
    const lastPos = useRef(new THREE.Vector3(...position));

    const { camera, gl } = useThree();
    const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
    const intersection = useRef(new THREE.Vector3());
    const offset = useRef(new THREE.Vector3());

    const handlePointerDown = useCallback((e) => {
        if (locked) {
            toast.error(`${label} is locked by teacher`, { id: `locked-${label}` });
            return;
        }
        // Prevent event propagation and OrbitControls (if any)
        e.stopPropagation();
        
        document.body.style.cursor = 'grabbing';
        dragActive.current = true;

        // Calculate intersection on the XY plane
        const raycaster = e.raycaster || new THREE.Raycaster();
        const rect = gl.domElement.getBoundingClientRect();
        
        // Use R3F's normalized mouse coordinates if available, else derive from event
        const mouse = e.pointer || new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane.current, intersection.current);
        offset.current.copy(intersection.current).sub(currentPos.current);

        // Standard pointer capture for off-mesh dragging
        e.target.setPointerCapture(e.pointerId);
    }, [camera, gl, locked, label]);

    const handlePointerMove = useCallback((e) => {
        if (!dragActive.current) return;
        e.stopPropagation();

        const rect = gl.domElement.getBoundingClientRect();
        const mouse = e.pointer || new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = e.raycaster || new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane.current, intersection.current);

        const newPos = intersection.current.clone().sub(offset.current);
        newPos.z = position[2]; // Keep aligned to original Z
        currentPos.current.copy(newPos);

        // Pouring logic: if near center (x=0) and high (y>1.5)
        if (Math.abs(newPos.x) < 2.5 && newPos.y > 1.2) {
            isPouring.current = true;
            isTilted.current = true;
        } else {
            isPouring.current = false;
            isTilted.current = false;
        }
    }, [camera, gl, position]);

    const handlePointerUp = useCallback((e) => {
        if (!dragActive.current) return;
        e.stopPropagation();

        document.body.style.cursor = 'grab';
        dragActive.current = false;
        isPouring.current = false;
        isTilted.current = false;

        // Reset position
        currentPos.current.set(...position);

        if (e.target && e.target.releasePointerCapture) {
            try { e.target.releasePointerCapture(e.pointerId); } catch (_) { /* ignored */ }
        }
    }, [position, gl]);

    const lastUpdate = useRef(0);
    useFrame((state, delta) => {
        // Performance optimization: throttle physics/logic to ~30fps on mobile
        if (isMobile) {
            lastUpdate.current += delta;
            if (lastUpdate.current < 1/30) return;
            lastUpdate.current = 0;
        }

        if (isPouring.current && amount > 0) {
            const pourAmount = delta * 20;
            setAmount((prev) => Math.max(0, prev - pourAmount));
            onPour(pourAmount);
        }

        // Calculate velocity for Slosh
        const d = delta || 0.016;
        const velX = (currentPos.current.x - lastPos.current.x) / d;
        const velZ = (currentPos.current.z - lastPos.current.z) / d;
        
        // Dampen velocity to track tilt
        velocityTracker.current.x = THREE.MathUtils.lerp(velocityTracker.current.x, velX * 0.05, 0.1);
        velocityTracker.current.y = THREE.MathUtils.lerp(velocityTracker.current.y, velZ * 0.05, 0.1);
        lastPos.current.copy(currentPos.current);

        if (groupRef.current) {
            groupRef.current.position.lerp(currentPos.current, 0.2);
            const targetRot = isTilted.current ? Math.PI / 3.5 : 0;
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot, 0.15);
        }

        // Update Shader Material
        if (liquidMatRef.current) {
            liquidMatRef.current.uTime = state.clock.elapsedTime;
            liquidMatRef.current.uTilt = velocityTracker.current;
        }
    });

    const liquidHeight = 1.3 * (amount / maxAmount);
    const liquidY = -0.65 + (0.65 * (amount / maxAmount));

    const eventHandlers = {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onPointerLeave: handlePointerUp,
    };

    return (
        <group ref={groupRef} position={position}>
            {/* Main Flask Mesh — Handlers attached directly to Mesh */}
            <Cylinder args={[0.5, 0.5, 1.5, segments, 1, true]} {...eventHandlers}>
                <MeshTransmissionMaterial
                    thickness={0.12}
                    roughness={0}
                    transmission={0.95}
                    ior={1.5}
                    chromaticAberration={0.05}
                    backside
                    color="#aaddff"
                />
            </Cylinder>

            {/* Bottom */}
            <Cylinder args={[0.5, 0.5, 0.05, segments]} position={[0, -0.75, 0]} {...eventHandlers}>
                <meshStandardMaterial color="#aaddff" transparent opacity={0.3} />
            </Cylinder>

            {/* Liquid */}
            {amount > 0 && (
                <mesh position={[0, liquidY, 0]} scale={[1, liquidHeight, 1]} {...eventHandlers}>
                    <cylinderGeometry args={[0.45, 0.45, 1, segments, 8]} />
                    <liquidMaterial 
                        ref={liquidMatRef}
                        uColor={new THREE.Color(color)} 
                        transparent 
                    />
                </mesh>
            )}

            {/* Label */}
            <Text
                position={[0, 0, 0.55]}
                fontSize={0.3}
                color={locked ? "#ff6666" : "white"}
                fontWeight="bold"
                outlineWidth={0.03}
                outlineColor="black"
                {...eventHandlers}
            >
                {label} {locked && '🔒'}
            </Text>

            {/* Invisible expanded hit area */}
            <mesh visible={false} {...eventHandlers}>
                <cylinderGeometry args={[0.8, 0.8, 2, 16]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
};

DraggableFlask.propTypes = {
  locked: PropTypes.bool,
    position: PropTypes.array,
    label: PropTypes.string,
    color: PropTypes.string,
    onPour: PropTypes.func,
    maxAmount: PropTypes.number
};

export default DraggableFlask;
