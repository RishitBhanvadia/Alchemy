import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <nav className="glass-navbar" role="navigation" aria-label="Main navigation">
            <div className="nav-logo">
                <img src={logo} alt="Alchemistry Logo" />
                <span className="logo-text neon-glow">ALCHEMISTRY</span>
            </div>

            <div className="nav-links" role="menubar">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    aria-label="Navigate to Dashboard"
                    role="menuitem"
                >
                    DASHBOARD
                </NavLink>
                <NavLink
                    to="/lab"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    aria-label="Navigate to Laboratory"
                    role="menuitem"
                >
                    LABORATORY
                </NavLink>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    aria-label="Navigate to Profile"
                    role="menuitem"
                >
                    PROFILE
                </NavLink>
                <NavLink
                    to="/history"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    aria-label="Navigate to History"
                    role="menuitem"
                >
                    HISTORY
                </NavLink>
            </div>

            <div className="nav-profile">
                <div className="profile-icon">ADM</div>
                <button
                    className="logout-button"
                    onClick={async () => {
                        const { supabase } = await import('../supabaseClient');
                        await supabase.auth.signOut();
                        window.location.href = '/';
                    }}
                    style={{ marginLeft: '1rem', background: 'transparent', border: '1px solid #ff0055', color: '#ff0055', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    LOGOUT
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
