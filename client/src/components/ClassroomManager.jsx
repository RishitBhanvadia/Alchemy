import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import useClassroomStore from '../store/classroomStore';
import EmptyState from './EmptyState';

const ClassroomManager = () => {
    const classrooms = useClassroomStore(state => state.classrooms);
    const loading = useClassroomStore(state => state.loading);
    const fetchTeacherClassrooms = useClassroomStore(state => state.fetchTeacherClassrooms);
    const createClassroom = useClassroomStore(state => state.createClassroom);
    
    const [newClassName, setNewClassName] = useState('');

    useEffect(() => {
        fetchTeacherClassrooms();
    }, [fetchTeacherClassrooms]);

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        if (!newClassName.trim() || loading) return;

        const result = await createClassroom(newClassName);
        
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`Classroom "${newClassName}" created!`);
            setNewClassName('');
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Join code copied!');
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
            fetchTeacherClassrooms();
        }
    };

    return (
        <div className="classroom-manager glass-panel" style={styles.container}>
            <h2 style={styles.title}>Classroom Management</h2>
            
            <form onSubmit={handleCreateClassroom} style={styles.form}>
                <input 
                    type="text" 
                    placeholder="Class Name (e.g. Physics 101)" 
                    data-testid="classroom-name-input"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                />
                <button type="submit" style={styles.button} data-testid="create-classroom-btn" disabled={loading}>
                    {loading ? 'Creating...' : '+ Create Class'}
                </button>
            </form>

            <div style={styles.classList}>
                {classrooms.length === 0 ? (
                    <EmptyState
                        icon="🏫"
                        title="No classrooms created yet"
                        description="Create your first classroom to start managing students."
                    />
                ) : (
                    classrooms.map(cls => (
                        <div key={cls.id} style={styles.classCard}>
                            <div style={styles.classHeader}>
                                <h3 style={styles.className}>{cls.class_name}</h3>
                                <div style={styles.codeContainer}>
                                    <span style={styles.codeLabel}>CODE:</span>
                                    <span style={styles.code} className="code" data-testid="join-code">{cls.join_code}</span>
                                    <button 
                                        onClick={() => copyToClipboard(cls.join_code)}
                                        style={styles.copyButton}
                                        title="Copy code"
                                    >
                                        📋
                                    </button>
                                </div>
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
        flexWrap: 'wrap',
        gap: '8px',
    },
    className: {
        margin: 0,
        color: '#F9FAFB',
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '150px',
    },
    codeContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    codeLabel: {
        fontSize: '0.7rem',
        color: '#9CA3AF',
    },
    code: {
        fontSize: '0.85rem',
        background: '#6366F1',
        padding: '4px 8px',
        borderRadius: '4px',
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    copyButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        padding: '4px',
        opacity: 0.7,
        transition: 'opacity 0.2s',
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
};

export default ClassroomManager;
