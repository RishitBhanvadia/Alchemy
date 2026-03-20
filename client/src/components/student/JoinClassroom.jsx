import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const JoinClassroom = ({ onJoined, profileId }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');

        if (!code.trim()) {
            setError('Please enter a join code.');
            return;
        }
        
        setLoading(true);
        try {
            // 1. Look up classroom by code - use maybeSingle instead of single to avoid throwing
            const { data: classroom, error: classError } = await supabase
                .from('classrooms')
                .select('id, class_name')
                .eq('join_code', code.trim().toUpperCase())
                .maybeSingle();

            if (classError) {
                console.error('Classroom lookup error:', classError);
                return toast.error('Failed to look up classroom. Please try again.');
            }

            if (!classroom) {
                setError('Invalid join code. Please check with your teacher.');
                return;
            }

            // 2. Create membership
            const { error: joinError } = await supabase
                .from('classroom_students')
                .insert({
                    classroom_id: classroom.id,
                    student_id: profileId
                });

            if (joinError) {
                if (joinError.code === '23505') {
                    setError('You are already a member of this classroom.');
                    return;
                }
                throw joinError;
            }

            toast.success(`Successfully joined ${classroom.class_name}!`);
            setCode('');
            setError('');
            if (onJoined) onJoined();
        } catch (err) {
            console.error('Error joining classroom:', err);
            setError('Failed to join classroom. Please try again.');
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
                    placeholder="ENTER CLASS CODE (e.g. XK9P2)"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        if (error) setError('');
                    }}
                    className="glass-input"
                    maxLength={10}
                    aria-describedby={error ? "join-error" : undefined}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        fontWeight: 'bold'
                    }}
                />
                {error && (
                    <p id="join-error" style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0 0 4px 0' }}>
                        {error}
                    </p>
                )}
                <button 
                    type="submit" 
                    className="join-btn"
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
