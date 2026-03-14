import React from 'react';
import { Cylinder, MeshTransmissionMaterial, OrbitControls } from '@react-three/drei';
import DraggableFlask from './DraggableFlask';
import ParticleSystem from './ParticleSystem';
import PropTypes from 'prop-types';

/**
 * PhysicsLab — The complete 3D scene for the interactive lab.
 * Contains: shelf, central receiving beaker, and 4 draggable flasks.
 */
const PhysicsLab = ({ setChemA, setChemB, setChemC, setChemD, isReacting, lockedChems = [] }) => {
    // Detect mobile for physics/perf optimisations
    const isMobile = window.innerWidth < 768;

    return (
        <>
            {/* Camera Controls */}
            <OrbitControls 
                makeDefault 
                enablePan={false} 
                minDistance={5} 
                maxDistance={20}
                maxPolarAngle={Math.PI / 2}
            />

            {/* Enhanced Lighting */}
            <ambientLight intensity={1.2} />
            <hemisphereLight args={['#b1e1ff', '#444444', 0.8]} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow={!isMobile} />
            <pointLight position={[-5, 5, 3]} intensity={0.8} color="#00f3ff" />

            {/* Shelf Platform */}
            <mesh position={[0, -1.2, 0]}>
                <boxGeometry args={[10, 0.15, 3]} />
                <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Central Receiving Beaker */}
            <group position={[0, 0.5, 0]}>
                {/* The dynamic particle system inside the beaker */}
                <ParticleSystem active={isReacting} />
                
                {/* Glass walls */}
                <Cylinder args={[1.2, 1.2, 3, isMobile ? 16 : 32, 1, true]} position={[0, 0, 0]}>
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
                {/* Bottom */}
                <Cylinder args={[1.2, 1.2, 0.1, isMobile ? 16 : 32]} position={[0, -1.5, 0]}>
                    <meshStandardMaterial color="#ddeeff" transparent opacity={0.4} />
                </Cylinder>
            </group>

            {/* Interactive Flasks — spaced apart, on shelf */}
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
                label="Ph"
                color="#10B981"
                onPour={(amt) => setChemC(prev => Math.min(100, prev + amt))}
                locked={lockedChems.includes('Ph')}
            />
            <DraggableFlask
                position={[4, 0, 0]}
                label="FeCl₃"
                color="#F59E0B"
                onPour={(amt) => setChemD(prev => Math.min(100, prev + amt))}
                locked={lockedChems.includes('FeCl3') || lockedChems.includes('FeCl₃')}
            />
        </>
    );
};

PhysicsLab.propTypes = {
    setChemA: PropTypes.func,
    setChemB: PropTypes.func,
    setChemC: PropTypes.func,
    setChemD: PropTypes.func,
    isReacting: PropTypes.bool,
    lockedChems: PropTypes.arrayOf(PropTypes.string),
};

export default PhysicsLab;
