import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessCelebration = ({ active, onComplete }) => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (active) {
            const newParticles = Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                x: Math.random() * 100 - 50, // center offset
                y: Math.random() * 100 - 50,
                color: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 5)],
                delay: Math.random() * 0.5
            }));
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setParticles(newParticles);
            
            const timer = setTimeout(() => {
                onComplete?.();
                setParticles([]);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [active, onComplete]);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence>
                {active && (
                    <>
                        <motion.h2
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{ scale: 1.5, opacity: 1, y: -100 }}
                            exit={{ scale: 2, opacity: 0 }}
                            style={{ position: 'absolute', color: 'white', textShadow: '0 0 20px rgba(99, 102, 241, 0.8)', fontWeight: 900, zIndex: 10 }}
                        >
                            REACTION SUCCESSFUL!
                        </motion.h2>
                        
                        {particles.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, scale: 0 }}
                                animate={{ 
                                    x: p.x * 10, 
                                    y: p.y * 10 - 200, 
                                    scale: [0, 1, 0.5, 0],
                                    rotate: 360 
                                }}
                                transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
                                style={{
                                    position: 'absolute',
                                    width: 12,
                                    height: 12,
                                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                    backgroundColor: p.color,
                                    boxShadow: `0 0 10px ${p.color}`
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SuccessCelebration;
