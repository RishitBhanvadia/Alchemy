import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';
import logger from '../utils/logger';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (error) {
            logger.error('Error logging out:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img src={logo} alt="Alchemy Logo" />
                <span className="logo-text neon-text">ALCHEMY</span>
            </div>

            <div className="navbar-links">
                <Link to="/dashboard" className="nav-link">DASHBOARD</Link>
                <Link to="/history" className="nav-link">HISTORY</Link>
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                    disabled={loading}
                >
                    {loading ? '...' : 'LOGOUT'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
