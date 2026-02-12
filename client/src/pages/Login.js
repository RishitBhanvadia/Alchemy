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
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;
            console.log("Logged in:", data);
            navigate('/dashboard');
        } catch (error) {
            alert(error.error_description || error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <HolographicLogin>
                <img src={logo} alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
                <h2 className="login-title">STUDENT LOGIN</h2>
                <form onSubmit={handleLogin} aria-busy={isLoading}>
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "ACCESSING..." : "ACCESS LAB"}
                    </button>
                </form>
            </HolographicLogin>
        </div>
    );
};

export default Login;
