/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const JoinClassroom = ({ onJoined, profileId }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!code.trim()) return toast.error('Please enter a join code.');
        
        setLoading(true);
        try {
            // 1. Look up classroom by code - use maybeSingle instead of single to avoid throwing
            const { data: classroom, error: classError } = await supabase
                .from('classrooms')
                .select('id, class_name')
                .eq('class_code', code.trim().toUpperCase())
                .maybeSingle();

            if (classError) {
                // eslint-disable-next-line no-console
                console.error('Classroom lookup error:', classError);
                return toast.error('Failed to look up classroom. Please try again.');
            }

            if (!classroom) {
                return toast.error('Invalid join code. Please check with your teacher.');
            }

            // 2. Create membership
            const { error: joinError } = await supabase
                .from('class_memberships')
                .insert({
                    classroom_id: classroom.id,
                    student_id: profileId
                });

            if (joinError) {
                if (joinError.code === '23505') {
                    return toast.error('You are already a member of this classroom.');
                }
                throw joinError;
            }

            toast.success(`Successfully joined ${classroom.class_name}!`);
            setCode('');
            if (onJoined) onJoined();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error joining classroom:', err);
            toast.error('Failed to join classroom. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className="glass-card join-classroom-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h3 style={{ marginBottom: '16px', color: '#F9FAFB' }}>Join a Classroom</h3>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                    type="text"
                    placeholder="ENTER 6-CHAR CODE (e.g. XK9P2W)"
                    data-testid="join-code-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="glass-input"
                    maxLength={6}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: 'bold'
                    }}
                />
                <button 
                    type="submit" 
                    className="join-btn"
                    data-testid="join-classroom-btn"
                    disabled={loading}
                    style={{
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? 'JOINING...' : 'JOIN CLASSROOM'}
                </button>
            </form>
        </motion.div>
    );
};

export default JoinClassroom;
