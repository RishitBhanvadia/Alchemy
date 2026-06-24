/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import useClassroomStore from '../store/classroomStore';
import EmptyState from './EmptyState';
import CreateClassModal from './CreateClassModal';

const ClassroomManager = () => {
    const navigate = useNavigate();
    const classrooms = useClassroomStore(state => state.classrooms);
    const loading = useClassroomStore(state => state.loading);
    const fetchTeacherClassrooms = useClassroomStore(state => state.fetchTeacherClassrooms);
    const createClassroom = useClassroomStore(state => state.createClassroom);
    
    const [newClassName, setNewClassName] = useState('');
    const [meetingType, setMeetingType] = useState('none');
    const [showMeetingModal, setShowMeetingModal] = useState(false);

    useEffect(() => {
        fetchTeacherClassrooms();
    }, [fetchTeacherClassrooms]);

    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        if (!newClassName.trim() || loading) return;

        // Determine redirect URL if meeting is selected
        let redirectUrl = '';
        if (meetingType === 'zoom') {
            redirectUrl = 'https://zoom.us/start/videofrom';
        } else if (meetingType === 'google') {
            redirectUrl = 'https://meet.google.com/new';
        }

        const result = await createClassroom(newClassName, meetingType);
        
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(`Classroom "${newClassName}" created!`);
            setNewClassName('');
            
            if (redirectUrl) {
                toast.success(`Redirecting to ${meetingType === 'zoom' ? 'Zoom' : 'Google Meet'} to create meeting...`);
                // Open meeting in new tab
                window.open(redirectUrl, '_blank');
            }
        }
    };

    const updateMeetingLink = async (classId, link) => {
        if (!link) return;
        const { error } = await supabase
            .from('classrooms')
            .update({ meeting_link: link })
            .eq('id', classId);

        if (error) {
            toast.error("Failed to update meeting link");
        } else {
            toast.success("Meeting link updated!");
            fetchTeacherClassrooms(true);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={styles.title}>Classroom Management</h2>
                <button
                    onClick={() => setShowMeetingModal(true)}
                    style={styles.meetingButton}
                    data-testid="create-meeting-btn"
                >
                    🎥 Create Meeting
                </button>
            </div>

            {/* Meeting creation modal */}
            <CreateClassModal
                isOpen={showMeetingModal}
                onClose={() => setShowMeetingModal(false)}
            />
            
            <form onSubmit={handleCreateClassroom} style={styles.form}>
                <input 
                    type="text" 
                    placeholder="e.g. AP Chemistry Period 4" 
                    data-testid="classroom-name-input"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="glass-input"
                    style={styles.input}
                    disabled={loading}
                />
                <div style={styles.meetingSelect}>
                    <button 
                        type="button" 
                        onClick={() => setMeetingType(meetingType === 'zoom' ? 'none' : 'zoom')}
                        style={{...styles.meetingBtn, border: meetingType === 'zoom' ? '2px solid #00f3ff' : '1px solid rgba(255,255,255,0.2)'}}
                    >
                        Zoom
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setMeetingType(meetingType === 'google' ? 'none' : 'google')}
                        style={{...styles.meetingBtn, border: meetingType === 'google' ? '2px solid #00f3ff' : '1px solid rgba(255,255,255,0.2)'}}
                    >
                        Google
                    </button>
                </div>
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
                                    <span style={styles.codeLabel}>JOIN CODE:</span>
                                    <div className="join-code" data-testid="join-code-value">
                                        {cls.class_code}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(cls.class_code)}
                                        style={styles.copyButton}
                                        title="Copy code"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                            
                            <div style={styles.meetingInfo}>
                                <p style={styles.label}>Meeting: {cls.meeting_type && cls.meeting_type !== 'none' ? cls.meeting_type.toUpperCase() : 'Not Linked'}</p>
                                <div style={{display: 'flex', gap: '4px'}}>
                                    <input 
                                        type="text" 
                                        placeholder="Paste meeting link here..."
                                        defaultValue={cls.meeting_link || ''}
                                        onBlur={(e) => updateMeetingLink(cls.id, e.target.value)}
                                        style={styles.linkInput}
                                    />
                                    {cls.meeting_link && (
                                        <a href={cls.meeting_link} target="_blank" rel="noreferrer" style={styles.launchBtn}>
                                            🚀
                                        </a>
                                    )}
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
                                    <button 
                                        className="action-button active"
                                        onClick={() => navigate(`/teacher/classroom/${cls.id}`)}
                                        style={{ marginTop: '15px', padding: '10px', fontSize: '1rem' }}
                                    >
                                        MANAGE CLASS
                                    </button>
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
    meetingSelect: {
        display: 'flex',
        gap: '0.5rem',
    },
    meetingBtn: {
        background: 'rgba(255,255,255,0.05)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '0.8rem',
        transition: 'all 0.2s',
    },
    meetingInfo: {
        marginBottom: '1rem',
    },
    linkInput: {
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '6px',
        padding: '0.4rem 0.6rem',
        color: '#fff',
        fontSize: '0.8rem',
        flex: 1,
        outline: 'none',
    },
    launchBtn: {
        background: 'rgba(0, 243, 255, 0.2)',
        border: '1px solid #00f3ff',
        borderRadius: '6px',
        padding: '0.4rem 0.6rem',
        textDecoration: 'none',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
    meetingButton: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: 'none',
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.85rem',
        transition: 'all 0.2s',
    },
};

export default ClassroomManager;
