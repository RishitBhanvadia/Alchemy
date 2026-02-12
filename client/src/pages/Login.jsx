import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { supabase } from '../supabaseClient';
import HolographicLogin from '../components/3d-animations/HolographicLogin';
import logger from '../utils/logger';
import { showError, showSuccess } from '../utils/notifications';
import './login.css';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;
            logger.info('User logged in successfully', { userId: data.user?.id });
            showSuccess('Login successful! Welcome back.');
            navigate('/dashboard');
        } catch (error) {
            logger.error('Login failed', { error: error.message });
            showError(error.error_description || error.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <HolographicLogin>
                <img src={logo} alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
                <h2 className="login-title">STUDENT LOGIN</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            className="login-input"
                            placeholder="student@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">ACCESS LAB</button>
                </form>
            </HolographicLogin>
        </div>
    );
};

Login.propTypes = {
    // No props currently, but ready for future additions
};

export default Login;
