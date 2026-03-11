import React from 'react';
import { Physics, RigidBody } from '@react-three/rapier';
import { Cylinder, MeshTransmissionMaterial } from '@react-three/drei';
import DraggableFlask from './DraggableFlask';
import PropTypes from 'prop-types';

const PhysicsLab = ({ chemStates, setChemA, setChemB, setChemC, setChemD }) => {
    return (
        <Physics gravity={[0, -9.81, 0]}>
            {/* Shelf (Kinematic or Fixed) */}
            <RigidBody type="fixed" position={[-4, -1, 0]}>
                <mesh>
                    <boxGeometry args={[4, 0.2, 2]} />
                    <meshStandardMaterial color="#333" />
                </mesh>
            </RigidBody>

            {/* Target Test Tube (Central Receiver) */}
            <RigidBody type="fixed" position={[0, -2, 0]} colliders="trimesh">
                <group>
                    <Cylinder args={[1, 1, 3, 32, 1, true]} position={[0, 1.5, 0]}>
                        <MeshTransmissionMaterial
                            thickness={0.2}
                            roughness={0}
                            transmission={1}
                            ior={1.5}
                            chromaticAberration={0.1}
                            backside
                        />
                    </Cylinder>
                    <Cylinder args={[1, 1, 0.2, 32]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#ccc" />
                    </Cylinder>
                </group>
            </RigidBody>

            {/* Interactive Flasks */}
            <DraggableFlask 
                position={[-5, 0, 0]} 
                label="HCl" 
                color="#05B9C4" 
                onPour={(amt) => setChemA(prev => Math.min(100, prev + amt))} 
            />
            <DraggableFlask 
                position={[-4, 0, 0]} 
                label="NaCl" 
                color="#04CE7E" 
                onPour={(amt) => setChemB(prev => Math.min(100, prev + amt))} 
            />
            <DraggableFlask 
                position={[-3, 0, 0]} 
                label="CuSO4" 
                color="#FBC2E3" 
                onPour={(amt) => setChemC(prev => Math.min(100, prev + amt))} 
            />
            <DraggableFlask 
                position={[-2, 0, 0]} 
                label="FeSO4" 
                color="#DAA520" 
                onPour={(amt) => setChemD(prev => Math.min(100, prev + amt))} 
            />
        </Physics>
    );
};

PhysicsLab.propTypes = {
    chemStates: PropTypes.object,
    setChemA: PropTypes.func,
    setChemB: PropTypes.func,
    setChemC: PropTypes.func,
    setChemD: PropTypes.func
};

export default PhysicsLab;
