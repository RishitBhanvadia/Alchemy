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
                    to="/lab-3d"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    aria-label="Navigate to 3D Laboratory"
                    role="menuitem"
                >
                    3D LAB
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
                >
                    LOGOUT
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
