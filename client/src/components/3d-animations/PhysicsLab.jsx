/* eslint-disable */
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshTransmissionMaterial, OrbitControls } from '@react-three/drei';
import DraggableFlask from './DraggableFlask';
import ParticleSystem from './ParticleSystem';
import PropTypes from 'prop-types';
import { Color } from 'three';
import { getReactionColour } from '../../utils/reactionColors';
import { createLiquidMaterial } from '../../shaders/LiquidShader';

const BEAKER_HEIGHT = 3;
const BEAKER_RADIUS = 1.2;

const PhysicsLab = ({ 
    setChemA, 
    setChemB, 
    setChemI, 
    setChemC, 
    isReacting, 
    lockedChems = [],
    reactionResult,
    chemA,
    chemB,
    chemI,
    chemC
}) => {
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && (window.visualViewport?.width || window.innerWidth || 1024) < 768);
    
    useEffect(() => {
        const handleResize = () => setIsMobile((window.visualViewport?.width || window.innerWidth || 1024) < 768);
        const viewport = window.visualViewport || window;
        viewport.addEventListener('resize', handleResize);
        return () => viewport.removeEventListener('resize', handleResize);
    }, []);
    
    const totalConcentration = (chemA + chemB + chemI + chemC) / 400;
    const fillLevel = Math.min(totalConcentration, 1);
    const liquidHeight = BEAKER_HEIGHT * fillLevel * 0.85;
    const liquidY = -(BEAKER_HEIGHT / 2) + (liquidHeight / 2) + 0.1;

    const targetColor = useRef(new Color('#E8F4FD'));
    const currentColor = useRef(new Color('#E8F4FD'));
    const liquidMatRef = useRef();
    const dynamicLightRef = useRef();

    const reactionColor = reactionResult?.color 
        ? getReactionColour(reactionResult.color) 
        : '#E8F4FD';

    useEffect(() => {
        if (reactionResult?.color) {
            targetColor.current.set(getReactionColour(reactionResult.color));
        } else {
            targetColor.current.set('#E8F4FD');
        }
    }, [reactionResult]);

    useFrame((state) => {
        currentColor.current.lerp(targetColor.current, 0.03);
        
        if (liquidMatRef.current) {
            liquidMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            liquidMatRef.current.uniforms.uColorA.value.copy(currentColor.current);
            liquidMatRef.current.uniforms.uFillLevel.value = fillLevel * 0.85;
        }

        if (dynamicLightRef.current) {
            dynamicLightRef.current.color.lerp(targetColor.current, 0.03);
        }
    });

    const particleConfig = useMemo(() => {
        if (!reactionResult) return null;
        return {
            stateChange: reactionResult.state_change || '',
            thermal: reactionResult.thermal_effect || '',
        };
    }, [reactionResult]);

    return (
        <>
            <OrbitControls 
                makeDefault 
                enablePan={false} 
                minDistance={5} 
                maxDistance={20}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 6}
                enableDamping
                dampingFactor={0.05}
            />

            <ambientLight intensity={0.35} />
            <hemisphereLight args={['#b1e1ff', '#444444', 0.6]} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow={!isMobile} />
            <pointLight position={[-5, 5, 3]} intensity={0.5} color="#00f3ff" />
            <pointLight 
                ref={dynamicLightRef}
                position={[0, 1, 2]} 
                intensity={0.6} 
                color={reactionColor}
            />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]} receiveShadow>
                <planeGeometry args={[15, 15]} />
                <meshStandardMaterial color="#0d0d1a" roughness={0.4} metalness={0.3} />
            </mesh>

            <mesh position={[0, -1.2, 0]}>
                <boxGeometry args={[10, 0.15, 3]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
            </mesh>

            <group position={[0, 0.5, 0]}>
                <ParticleSystem 
                    active={isReacting} 
                    config={particleConfig}
                />
                
                {fillLevel > 0.02 && (
                    <mesh position={[0, liquidY, 0]}>
                        <cylinderGeometry args={[
                            BEAKER_RADIUS * 0.88, 
                            BEAKER_RADIUS * 0.88, 
                            liquidHeight, 
                            isMobile ? 16 : 32, 
                            8
                        ]} />
                        <primitive
                            ref={liquidMatRef}
                            object={createLiquidMaterial(
                                reactionColor,
                                reactionColor,
                                fillLevel * 0.85
                            )}
                            attach="material"
                        />
                    </mesh>
                )}

                <Cylinder args={[BEAKER_RADIUS, BEAKER_RADIUS, BEAKER_HEIGHT, isMobile ? 16 : 32, 1, true]} position={[0, 0, 0]}>
                    <MeshTransmissionMaterial
                        thickness={0.15}
                        roughness={0}
                        transmission={0.92}
                        ior={1.5}
                        chromaticAberration={0.06}
                        backside
                        color="#aaeeff"
                    />
                </Cylinder>
                <Cylinder args={[BEAKER_RADIUS, BEAKER_RADIUS, 0.1, isMobile ? 16 : 32]} position={[0, -BEAKER_HEIGHT / 2, 0]}>
                    <meshStandardMaterial color="#ddeeff" transparent opacity={0.4} />
                </Cylinder>
            </group>

            <DraggableFlask
                position={[-4, 0, 0]}
                label="HCl"
                color="#EF4444"
                onPour={(amt) => setChemA(prev => Math.min(100, prev + amt))}
                locked={lockedChems.includes('HCl')}
            />
            <DraggableFlask
                position={[-2, 0, 0]}
                label="NaOH"
                color="#6366F1"
                onPour={(amt) => setChemB(prev => Math.min(100, prev + amt))}
                locked={lockedChems.includes('NaOH')}
            />
            <DraggableFlask
                position={[2, 0, 0]}
                label="BTB"
                color="#10B981"
                onPour={(amt) => setChemI(prev => Math.min(100, prev + amt))}
                locked={lockedChems.includes('BTB')}
            />
            <DraggableFlask
                position={[4, 0, 0]}
                label="MnO₂"
                color="#3D2B1F"
                onPour={(amt) => setChemC(prev => Math.min(100, prev + amt))}
                locked={lockedChems.includes('MnO2') || lockedChems.includes('MnO₂')}
            />
        </>
    );
};

PhysicsLab.propTypes = {
    setChemA: PropTypes.func,
    setChemB: PropTypes.func,
    setChemI: PropTypes.func,
    setChemC: PropTypes.func,
    isReacting: PropTypes.bool,
    lockedChems: PropTypes.arrayOf(PropTypes.string),
    reactionResult: PropTypes.object,
    chemA: PropTypes.number,
    chemB: PropTypes.number,
    chemI: PropTypes.number,
    chemC: PropTypes.number,
};

export default PhysicsLab;
