import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import useAssignmentStore from '../store/assignmentStore';
import LoadingOverlay from '../components/LoadingOverlay';
import EmptyState from '../components/EmptyState';
import logger from '../utils/logger';
import './ClassroomDetail.css';

const ClassroomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
    
    // Assignment form state
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        experiment_type: 'lab',
        required_score: 80,
        description: '',
        due_date: ''
    });

    const { fetchAssignments, assignments, createAssignment, deleteAssignment } = useAssignmentStore();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch Classroom
                const { data: cls, error: clsErr } = await supabase
                    .from('classrooms')
                    .select('*')
                    .eq('id', id)
                    .single();
                if (clsErr) throw clsErr;
                setClassroom(cls);

                // Fetch Students
                const { data: stus, error: stuErr } = await supabase
                    .from('profiles')
                    .select(`
                        *,
                        class_memberships!inner (classroom_id)
                    `)
                    .eq('class_memberships.classroom_id', id);
                if (stuErr) throw stuErr;
                setStudents(stus);

                // Fetch Assignments
                await fetchAssignments(id);
                
            } catch (error) {
                logger.error('Error fetching classroom detail:', error);
                toast.error('Failed to load classroom details');
                navigate('/teacher');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id, fetchAssignments, navigate]);

    const handleToggleChem = async (chem) => {
        const currentLocked = classroom.locked_chemicals || [];
        const isLocked = currentLocked.includes(chem);
        const newLocked = isLocked 
            ? currentLocked.filter(c => c !== chem)
            : [...currentLocked, chem];

        try {
            const { error } = await supabase
                .from('classrooms')
                .update({ locked_chemicals: newLocked })
                .eq('id', id);

            if (error) throw error;
            setClassroom({ ...classroom, locked_chemicals: newLocked });
            toast.success(`${chem} ${isLocked ? 'Unlocked' : 'Locked'}`);
        } catch (error) {
            logger.error('Error updating locked chemicals:', error);
            toast.error('Update failed');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        const success = await createAssignment({
            ...newAssignment,
            classroom_id: id
        });
        if (success) {
            setIsCreatingAssignment(false);
            setNewAssignment({
                title: '',
                experiment_type: 'lab',
                required_score: 80,
                description: '',
                due_date: ''
            });
        }
    };

    if (loading) return <LoadingOverlay message="Loading classroom dashboard..." />;

    return (
        <motion.div 
            className="classroom-detail-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="detail-header glass-panel">
                <div className="header-info">
                    <button className="back-btn" onClick={() => navigate('/teacher')}>← BACK</button>
                    <h1 className="neon-glow">{classroom?.class_name.toUpperCase()}</h1>
                    <span className="join-badge">CODE: {classroom?.class_code}</span>
                </div>
            </div>

            <div className="detail-grid">
                {/* 1. Student Roster */}
                <section className="detail-section glass-panel">
                    <div className="section-header">
                        <h2>👨‍🎓 STUDENT ROSTER ({students.length})</h2>
                    </div>
                    <div className="student-list">
                        {students.length === 0 ? (
                            <EmptyState
                                icon="👨‍🎓"
                                title="No students enrolled yet"
                                description="Share the class code with your students to have them join."
                            />
                        ) : (
                            students.map(stu => (
                                <div key={stu.id} className="student-card glass-card">
                                    <div className="stu-avatar">
                                        {stu.avatar_url ? <img src={stu.avatar_url} alt="" /> : stu.full_name?.[0] || 'S'}
                                    </div>
                                    <div className="stu-info">
                                        <span className="stu-name">{stu.full_name || 'Incognito Student'}</span>
                                        <span className="stu-stats">XP: {stu.xp} | Lvl: {stu.level}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 2. Laboratory Controls */}
                <section className="detail-section glass-panel">
                    <div className="section-header">
                        <h2>🎛️ LABORATORY CONTROLS</h2>
                        <p className="help-text">Select chemicals to LOCK/UNLOCK for this classroom.</p>
                    </div>
                    <div className="chem-locks-grid">
                        {['HCl', 'NaOH', 'BTB', 'MnO₂'].map(chem => (
                            <button 
                                key={chem}
                                className={`lock-btn ${classroom.locked_chemicals?.includes(chem) ? 'locked' : 'unlocked'}`}
                                onClick={() => handleToggleChem(chem)}
                            >
                                <span className="lock-icon">{classroom.locked_chemicals?.includes(chem) ? '🔒' : '🔓'}</span>
                                <span className="lock-label">{chem}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Assignments Engine */}
                <section className="detail-section glass-panel full-width">
                    <div className="section-header">
                        <h2>📋 ASSIGNMENTS</h2>
                        <button className="create-btn" onClick={() => setIsCreatingAssignment(true)}>+ NEW ASSIGNMENT</button>
                    </div>
                    
                    <div className="assignments-table-container">
                        <table className="assignments-table">
                            <thead>
                                <tr>
                                    <th>TITLE</th>
                                    <th>TYPE</th>
                                    <th>MIN SCORE</th>
                                    <th>DUE DATE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.map(asgn => (
                                    <tr key={asgn.id}>
                                        <td>{asgn.title}</td>
                                        <td className="capitalize">{asgn.experiment_type}</td>
                                        <td>{asgn.required_score}%</td>
                                        <td>{asgn.due_date ? new Date(asgn.due_date).toLocaleDateString() : 'No Limit'}</td>
                                        <td>
                                            <button className="del-btn" onClick={() => deleteAssignment(asgn.id)}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                                {assignments.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="empty-row" style={{ padding: 0 }}>
                                            <EmptyState
                                                icon="📋"
                                                title="No assignments created yet"
                                                description="Create an assignment to assign tasks to your students."
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Create Assignment Modal */}
            <AnimatePresence>
                {isCreatingAssignment && (
                    <div className="modal-overlay">
                        <motion.div 
                            className="assignment-modal glass-panel"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h2 className="neon-glow">CREATE ASSIGNMENT</h2>
                            <form onSubmit={handleCreateAssignment}>
                                <div className="form-group">
                                    <label htmlFor="assignment-title">Assignment Title</label>
                                    <input 
                                        id="assignment-title"
                                        required
                                        type="text" 
                                        value={newAssignment.title}
                                        onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                                        placeholder="e.g., Simple Neutralization"
                                    />
                                </div>
                                <div className="form-group-row">
                                    <div className="form-group">
                                        <label htmlFor="assignment-module">Module</label>
                                        <select 
                                            id="assignment-module"
                                            value={newAssignment.experiment_type}
                                            onChange={e => setNewAssignment({...newAssignment, experiment_type: e.target.value})}
                                        >
                                            <option value="lab">3D Lab</option>
                                            <option value="titration">Titration</option>
                                            <option value="organic">Organic</option>
                                            <option value="inorganic">Inorganic</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="assignment-score">Min Score (%)</label>
                                        <input 
                                            id="assignment-score"
                                            type="number" 
                                            min="0" max="100"
                                            value={newAssignment.required_score}
                                            onChange={e => setNewAssignment({...newAssignment, required_score: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="assignment-due">Due Date (Optional)</label>
                                    <input 
                                        id="assignment-due"
                                        type="date" 
                                        value={newAssignment.due_date}
                                        onChange={e => setNewAssignment({...newAssignment, due_date: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="assignment-desc">Description</label>
                                    <textarea 
                                        id="assignment-desc"
                                        value={newAssignment.description}
                                        onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                                        placeholder="Provide instructions to students..."
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setIsCreatingAssignment(false)}>CANCEL</button>
                                    <button type="submit" className="submit-btn active">PUBLISH</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ClassroomDetail;
