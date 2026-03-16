import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    if (name === 'email') {
      if (!value.trim()) return 'Please enter your email address.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'That doesn\'t look like a valid email.';
    }
    if (name === 'password') {
      if (!value) return 'Please enter a password.';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    
    if (newErrors.email || newErrors.password) {
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error('Too many login attempts. Please wait a few minutes.');
        }
        if (error.message.includes('Invalid login')) {
          throw new Error('Invalid email or password.');
        }
        throw error;
      }
      
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">Email Address</label>
        <input 
          type="email" 
          id="email"
          name="email"
          className={`auth-input ${touched.email && errors.email ? 'input-error' : ''}`}
          data-testid="email-input"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={touched.email && !!errors.email}
        />
        {touched.email && errors.email && (
          <span className="error-message" id="email-error" role="alert">{errors.email}</span>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input 
          type="password" 
          id="password"
          name="password"
          className={`auth-input ${touched.password && errors.password ? 'input-error' : ''}`}
          data-testid="password-input"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={touched.password && !!errors.password}
        />
        {touched.password && errors.password && (
          <span className="error-message" id="password-error" role="alert">{errors.password}</span>
        )}
        <a href="#" className="forgot-password">Forgot password?</a>
      </div>
      <button type="submit" className="submit-btn" data-testid="login-submit-btn" disabled={loading}>
        {loading ? (
          <>
            <span className="btn-spinner"></span>
            Logging in...
          </>
        ) : (
          'Access Lab'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
