/* eslint-disable react/prop-types */
import React from 'react';

const RoleSelector = ({ selectedRole, setSelectedRole, error, ariaDescribedBy }) => {
  const handleKeyDown = (e, role) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedRole(role);
    }
  };

  return (
    <div 
      className={`role-selector ${error ? 'has-error' : ''}`}
      role="radiogroup"
      aria-label="Select your role"
      aria-describedby={ariaDescribedBy}
    >
      <div 
        className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
        data-testid="role-student"
        onClick={() => setSelectedRole('student')}
        onKeyDown={(e) => handleKeyDown(e, 'student')}
        role="radio"
        aria-checked={selectedRole === 'student'}
        tabIndex={0}
        aria-label="Student role: Join a classroom, run experiments"
      >
        <span className="role-emoji" aria-hidden="true">🎓</span>
        <span className="role-name">Student</span>
        <p className="role-desc">Join a classroom, run experiments</p>
      </div>
      <div 
        className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
        data-testid="role-teacher"
        onClick={() => setSelectedRole('teacher')}
        onKeyDown={(e) => handleKeyDown(e, 'teacher')}
        role="radio"
        aria-checked={selectedRole === 'teacher'}
        tabIndex={0}
        aria-label="Teacher role: Create classrooms, track students"
      >
        <span className="role-emoji" aria-hidden="true">👨‍🏫</span>
        <span className="role-name">Teacher</span>
        <p className="role-desc">Create classrooms, track students</p>
      </div>
    </div>
  );
};

export default RoleSelector;
