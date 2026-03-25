import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const MyTeacherCard = ({ classroom }) => {
    if (!classroom) {
        return (
            <motion.div
                className="glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="empty-teacher-state">
                    <span className="empty-icon">👨‍🏫</span>
                    <p className="empty-title">Not joined a class yet</p>
                    <p className="empty-subtitle">Ask your teacher for a join code</p>
                </div>
            </motion.div>
        );
    }

    const { class_name, teacher } = classroom;

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <motion.div
            className="glass-card teacher-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ borderLeft: '4px solid #6366F1' }}
        >
            <div className="teacher-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="avatar-initial" style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.9rem'
                }}>
                    {teacher?.avatar_url ? (
                        <img src={teacher.avatar_url} alt={teacher.display_name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                        <span>{getInitials(teacher?.display_name)}</span>
                    )}
                </div>
                <div>
                    <p style={{ color: '#9CA3AF', fontSize: '0.75rem', margin: 0 }}>YOUR TEACHER</p>
                    <p style={{ color: '#F9FAFB', fontWeight: 700, margin: 0 }}>
                        {teacher?.display_name || 'Teacher'}
                    </p>
                </div>
            </div>
            <div className="class-section">
                <p style={{ color: '#9CA3AF', fontSize: '0.75rem', margin: '0 0 4px 0' }}>CLASSROOM</p>
                <p style={{ color: '#F9FAFB', fontWeight: 600, margin: 0 }}>{class_name}</p>
            </div>
        </motion.div>
    );
};

MyTeacherCard.propTypes = {
  classroom: PropTypes.shape({
    class_name: PropTypes.string,
    teacher: PropTypes.shape({
      display_name: PropTypes.string,
      avatar_url: PropTypes.string,
    })
  })
};

export default MyTeacherCard;
