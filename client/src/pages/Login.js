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
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="login-input"
                            placeholder="student@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errorMsg && (
                        <div style={{
                            color: '#ff6b6b',
                            marginBottom: '15px',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            background: 'rgba(255, 0, 0, 0.1)',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 107, 107, 0.3)'
                        }}>
                            {errorMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                        style={{
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'ACCESSING...' : 'ACCESS LAB'}
                    </button>
                </form>
            </HolographicLogin>
        </div>
    );
};

export default Login;
