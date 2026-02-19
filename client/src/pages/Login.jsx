import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import HolographicLogin from '../components/3d-animations/HolographicLogin';
import ParticleBackground from '../components/3d-animations/ParticleBackground';
import CanvasContainer from '../components/3d-animations/CanvasContainer';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            toast.success('Access Granted');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="background-canvas">
                <CanvasContainer>
                    <ParticleBackground count={1000} />
                </CanvasContainer>
            </div>

            <div className="login-container">
                <HolographicLogin>
                    <h1 className="neon-text">SYSTEM ACCESS</h1>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label htmlFor="email">IDENTIFIER</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="USER@ALCHEMY.LAB"
                                disabled={loading}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">PASSPHRASE</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="cyber-button" disabled={loading}>
                            {loading ? 'AUTHENTICATING...' : 'INITIALIZE SESSION'}
                        </button>
                    </form>
                    <div className="login-links">
                        <Link to="/register">NEW USER REGISTRATION</Link>
                        <Link to="/forgot-password">RESET CREDENTIALS</Link>
                    </div>
                </HolographicLogin>
            </div>
        </div>
    );
};

export default Login;