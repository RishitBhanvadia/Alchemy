/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useClassroomStore from '../store/classroomStore';
import useHistoryStore from '../store/historyStore';

import MyTeacherCard from '../components/student/MyTeacherCard';
import JoinClassroom from '../components/student/JoinClassroom';
import EmptyState from '../components/EmptyState';
import useAssignmentStore from '../store/assignmentStore';
import JoinMeetingPanel from '../components/student/JoinMeetingPanel';

import './StudentDashboard.css';

const MODULE_CARDS = [
  {
    id: 'laboratory',
    icon: '🧪',
    name: 'Laboratory',
    description: 'Run chemical reactions and observe results',
    route: '/lab'
  },
  {
    id: 'titration',
    icon: '💧',
    name: 'Titration',
    description: 'Precise acid-base analysis',
    route: '/titration'
  },
  {
    id: 'organic',
    icon: '🌿',
    name: 'Organic Chemistry',
    description: 'Carbon compounds and reactions',
    route: '/organic'
  },
  {
    id: 'inorganic',
    icon: '⚗️',
    name: 'Inorganic Chemistry',
    description: 'Elements and compounds',
    route: '/inorganic'
  }
];

const StudentDashboard = () => {
    const profile = useAuthStore(state => state.profile);
    const membership = useClassroomStore(state => state.membership);
    const fetchStudentMembership = useClassroomStore(state => state.fetchStudentMembership);
    const loading = useClassroomStore(state => state.loading);
    
    const logs = useHistoryStore(state => state.logs);
    const fetchHistory = useHistoryStore(state => state.fetch);
    
    const navigate = useNavigate();

    const fetchAssignments = useAssignmentStore(state => state.fetchStudentAssignments);
    const assignments = useAssignmentStore(state => state.assignments);

    useEffect(() => {
        if (profile) {
            fetchStudentMembership();
            fetchHistory();
        }
    }, [profile, fetchStudentMembership, fetchHistory]);

    useEffect(() => {
        if (membership?.classroom_id && profile?.id) {
            fetchAssignments(membership.classroom_id, profile.id);
        }
    }, [membership, profile, fetchAssignments]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    const getFirstName = () => {
        const name = profile?.display_name || profile?.full_name || 'Scientist';
        return name.split(' ')[0] || 'Scientist';
    };

    const handleJoinSuccess = () => {
        fetchStudentMembership();
    };

    if (loading && !membership) {
        return (
            <div className="student-dashboard loading-state">
                <div className="loader-container">
                    <h2 className="neon-glow">Initialising Laboratory Access...</h2>
                    <div className="shimmer-bar"></div>
                </div>
            </div>
        );
    }

    const recentExperiments = logs.slice(0, 3);

    return (
        <motion.div 
            className="student-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <h1 className="welcome-text" data-testid="welcome-text">
                            Welcome back, <span className="highlight">{getFirstName()}</span> 👋
                        </h1>
                        <p className="subtitle">Ready to experiment today?</p>
                    </motion.div>
                </header>

                <div className="dashboard-grid">
                    <div className="dashboard-col left">
                        <section className="dashboard-section">
                            <h2 className="section-label">MY CLASS</h2>
                            <MyTeacherCard classroom={membership?.classroom} />
                        </section>

                        {/* Join Meeting panel — always visible */}
                        <section className="dashboard-section">
                            <h2 className="section-label">JOIN MEETING</h2>
                            <JoinMeetingPanel />
                        </section>
                        
                        {membership && (
                            <section className="dashboard-section">
                                <h2 className="section-label">MY ASSIGNMENTS</h2>
                                <div className="assignments-container">
                                    {assignments.length > 0 ? (
                                        assignments.map(asgn => (
                                            <div key={asgn.id} className="assignment-card glass-card">
                                                <div className="asgn-info">
                                                    <span className="asgn-title">{asgn.title}</span>
                                                    <span className="asgn-meta">{asgn.experiment_type.toUpperCase()} | TARGET: {asgn.required_score}%</span>
                                                </div>
                                                <div className="asgn-status">
                                                    {asgn.progress?.score >= asgn.required_score ? (
                                                        <span className="badge-pass">PASS</span>
                                                    ) : (
                                                        <span className="badge-pending">PENDING</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-assignments">
                                            <span>No assignments yet! Enjoy the sandbox. 🧪</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                        
                        {!membership && (
                            <section className="dashboard-section">
                                <h2 className="section-label">JOIN CLASS</h2>
                                <JoinClassroom profileId={profile?.id} onJoined={handleJoinSuccess} />
                            </section>
                        )}
                    </div>

                    <div className="dashboard-col right">
                        <section className="dashboard-section">
                            <h2 className="section-label">EXPERIMENT MODULES</h2>
                            <div className="module-cards-grid">
                                {MODULE_CARDS.map((module, idx) => (
                                    <motion.div
                                        key={module.id}
                                        className="module-card glass-card"
                                        data-testid={`module-card-${module.id}`}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 * idx }}
                                        onClick={() => navigate(module.route)}
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="module-icon">{module.icon}</div>
                                        <h3 className="module-name">{module.name}</h3>
                                        <p className="module-desc">{module.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2 className="section-label">RECENT EXPERIMENTS</h2>
                                <Link to="/history" className="text-link">Full History →</Link>
                            </div>
                            
                            <div className="glass-card history-preview">
                                {recentExperiments.length > 0 ? (
                                    <div className="mini-log-list">
                                        {recentExperiments.map((exp, idx) => (
                                            <motion.div 
                                                key={exp.id}
                                                className="mini-log-item"
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 * idx }}
                                            >
                                                <div className="log-icon">
                                                    {exp.outcome_label ? '✨' : '⚗️'}
                                                </div>
                                                <div className="log-details">
                                                    <h4>{exp.outcome_label || 'Mixing Chemicals...'}</h4>
                                                    <span className="timestamp">{formatDate(exp.created_at)}</span>
                                                </div>
                                                <div className={`status-dot ${exp.outcome_label ? 'success' : 'neutral'}`}></div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon="⚗️"
                                        title="Your experiment log is empty"
                                        description="Complete an experiment in the Lab to see your results here."
                                        actionLabel="Go to Lab →"
                                        onAction={() => navigate('/student/lab')}
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
