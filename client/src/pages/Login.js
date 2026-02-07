import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HolographicLogin from '../components/3d-animations/HolographicLogin';
import './login.css';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login for now
        console.log("Logging in with", email, password);
        navigate('/dashboard');
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

export default Login;
