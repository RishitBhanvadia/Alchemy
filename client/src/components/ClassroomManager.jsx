import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import logger from '../utils/logger';

const ClassroomManager = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('classrooms')
            .select('*')
            .eq('teacher_id', user.id);

        if (error) {
            logger.error('Error fetching classrooms:', error);
        } else {
            setClassrooms(data);
        }
    };

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            // Generate a random 6-character code
            const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const { error } = await supabase
                .from('classrooms')
                .insert([
                    { 
                        class_name: newClassName, 
                        teacher_id: user.id,
                        class_code: classCode,
                        locked_chemicals: []
                    }
                ])
                .select();

            if (error) throw error;

            toast.success(`Classroom "${newClassName}" created!`);
            setNewClassName('');
            fetchClassrooms();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleChemicalLock = async (classId, chemKey, currentLocked) => {
        let newLocked = [...currentLocked];
        if (newLocked.includes(chemKey)) {
            newLocked = newLocked.filter(k => k !== chemKey);
        } else {
            newLocked.push(chemKey);
        }

        const { error } = await supabase
            .from('classrooms')
            .update({ locked_chemicals: newLocked })
            .eq('id', classId);

        if (error) {
            toast.error("Failed to update chemical locks");
        } else {
            toast.success(newLocked.includes(chemKey) ? `${chemKey} Locked` : `${chemKey} Unlocked`);
            fetchClassrooms();
        }
    };

    return (
        <div className="classroom-manager glass-panel" style={styles.container}>
            <h2 style={styles.title}>Classroom Management</h2>
            
            <form onSubmit={handleCreateClassroom} style={styles.form}>
                <input 
                    type="text" 
                    placeholder="Class Name (e.g. Physics 101)" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Class'}
                </button>
            </form>

            <div style={styles.classList}>
                {classrooms.length === 0 ? (
                    <p style={styles.empty}>No classrooms created yet.</p>
                ) : (
                    classrooms.map(cls => (
                        <div key={cls.id} style={styles.classCard}>
                            <div style={styles.classHeader}>
                                <h3>{cls.class_name}</h3>
                                <span style={styles.code}>CODE: {cls.class_code}</span>
                            </div>
                            
                            <div style={styles.chemControls}>
                                <p style={styles.label}>Lock Chemicals for Students:</p>
                                <div style={styles.chemButtons}>
                                    {['HCl', 'NaOH', 'Ph', 'FeCl3'].map(chem => (
                                        <button 
                                            key={chem}
                                            onClick={() => toggleChemicalLock(cls.id, chem, cls.locked_chemicals || [])}
                                            style={{
                                                ...styles.chemBtn,
                                                background: (cls.locked_chemicals || []).includes(chem) 
                                                    ? 'rgba(239, 68, 68, 0.3)' 
                                                    : 'rgba(16, 185, 129, 0.2)',
                                                borderColor: (cls.locked_chemicals || []).includes(chem) 
                                                    ? '#EF4444' 
                                                    : '#10B981'
                                            }}
                                        >
                                            {(cls.locked_chemicals || []).includes(chem) ? '🔒' : '🔓'} {chem}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(26, 26, 46, 0.4)',
    },
    title: {
        fontSize: '1.4rem',
        marginBottom: '1rem',
        color: '#00f3ff',
    },
    form: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
    },
    input: {
        flex: 1,
        padding: '0.6rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0,0,0,0.2)',
        color: '#fff',
        outline: 'none',
    },
    button: {
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    classList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
    },
    classCard: {
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    classHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.5rem',
    },
    code: {
        fontSize: '0.8rem',
        background: '#1e1e3f',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        color: '#9CA3AF',
        fontWeight: 'bold',
    },
    label: {
        fontSize: '0.85rem',
        color: '#888',
        marginBottom: '0.5rem',
    },
    chemButtons: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
    },
    chemBtn: {
        fontSize: '0.75rem',
        padding: '0.3rem 0.6rem',
        borderRadius: '4px',
        border: '1px solid',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    empty: {
        color: '#666',
        textAlign: 'center',
        gridColumn: '1 / -1',
        padding: '2rem',
    }
};

export default ClassroomManager;
