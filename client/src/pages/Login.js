import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import HolographicLogin from '../components/3d-animations/HolographicLogin';
import './login.css';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;
            console.log("Logged in:", data);
            navigate('/dashboard');
        } catch (error) {
            setErrorMsg(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <HolographicLogin>
                <img src={logo} alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
                <h2 className="login-title">STUDENT LOGIN</h2>
                {errorMsg && (
                    <div
                        role="alert"
                        aria-live="polite"
                        style={{ color: '#ff6b6b', marginBottom: '15px', fontWeight: 'bold' }}
                    >
                        {errorMsg}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="login-input"
                            placeholder="student@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                        style={loading ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    >
                        {loading ? 'Accessing...' : 'ACCESS LAB'}
                    </button>
                </form>
            </HolographicLogin>
        </div>
    );
};

export default Login;
