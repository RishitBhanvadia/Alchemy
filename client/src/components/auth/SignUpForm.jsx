import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import RoleSelector from './RoleSelector';

const SignUpForm = ({ onTabSwitch }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: null
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (touched[e.target.name]) {
      validateField(e.target.name, e.target.value);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const data = { ...formData, [name]: value };
    
    if (name === 'fullName' || name === 'all') {
      if (!data.fullName.trim()) {
        newErrors.fullName = 'Please enter your full name.';
      } else {
        delete newErrors.fullName;
      }
    }
    
    if (name === 'email' || name === 'all') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email.trim()) {
        newErrors.email = 'Please enter your email address.';
      } else if (!emailRegex.test(data.email)) {
        newErrors.email = 'That doesn\'t look like a valid email.';
      } else {
        delete newErrors.email;
      }
    }
    
    if (name === 'password' || name === 'all') {
      if (!data.password) {
        newErrors.password = 'Please enter a password.';
      } else if (data.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters.';
      } else {
        delete newErrors.password;
      }
    }
    
    if (name === 'confirmPassword' || name === 'all') {
      if (!data.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
      } else if (data.password !== data.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    
    if (name === 'role' || name === 'all') {
      if (!data.role) {
        newErrors.role = 'Please choose whether you are a Student or a Teacher.';
      } else {
        delete newErrors.role;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    if (touched.role) {
      validateField('role', role);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, role: true });
    
    const isValid = validateField('all');
    if (!isValid) return;

    const { fullName, email, password, role } = formData;

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role }
        }
      });

      if (authError) {
        if (authError.message.includes('rate limit')) {
          throw new Error('Email rate limit exceeded. Please try again after 1 hour.');
        }
        throw authError;
      }

      toast.success('Account created! Please check your email to verify.');
      onTabSwitch('login');
    } catch (err) {
      toast.error(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">Full Name</label>
        <input 
          type="text" 
          id="fullName"
          name="fullName"
          className={`auth-input ${touched.fullName && errors.fullName ? 'input-error' : ''}`}
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          aria-invalid={touched.fullName && !!errors.fullName}
        />
        {touched.fullName && errors.fullName && (
          <span className="error-message" id="fullName-error" role="alert">{errors.fullName}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="signup-email" className="form-label">Email Address</label>
        <input 
          type="email" 
          id="signup-email"
          name="email"
          className={`auth-input ${touched.email && errors.email ? 'input-error' : ''}`}
          placeholder="johndoe@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={touched.email && !!errors.email}
        />
        {touched.email && errors.email && (
          <span className="error-message" id="email-error" role="alert">{errors.email}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="signup-password" className="form-label">Password</label>
        <input 
          type="password" 
          id="signup-password"
          name="password"
          className={`auth-input ${touched.password && errors.password ? 'input-error' : ''}`}
          placeholder="Min 8 characters"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={touched.password && !!errors.password}
        />
        {touched.password && errors.password && (
          <span className="error-message" id="password-error" role="alert">{errors.password}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword"
          name="confirmPassword"
          className={`auth-input ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error-message" id="confirmPassword-error" role="alert">{errors.confirmPassword}</span>
        )}
      </div>
      
      <div className="form-group">
        <span className="form-label" id="role-label">Select Your Role</span>
        <RoleSelector 
          selectedRole={formData.role} 
          setSelectedRole={handleRoleSelect}
          error={touched.role && errors.role}
          aria-describedby={errors.role ? "role-error" : undefined}
        />
        {touched.role && errors.role && (
          <span className="error-message" id="role-error" role="alert">{errors.role}</span>
        )}
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? (
          <>
            <span className="btn-spinner"></span>
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

SignUpForm.propTypes = {
  onTabSwitch: PropTypes.func.isRequired,
};

export default SignUpForm;
