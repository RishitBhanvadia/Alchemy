import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className={`glass-navbar ${isMenuOpen ? 'menu-open' : ''}`} role="navigation" aria-label="Main navigation">
            <div className="nav-logo">
                <img src={logo} alt="Alchemistry Logo" />
                <span className="logo-text neon-glow">ALCHEMISTRY</span>
            </div>

            <button 
                className={`mobile-menu-toggle ${isMenuOpen ? 'open' : ''}`} 
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav-content ${isMenuOpen ? 'show' : ''}`}>
                <div className="nav-links" role="menubar">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Navigate to Dashboard"
                        role="menuitem"
                    >
                        DASHBOARD
                    </NavLink>
                    <NavLink
                        to="/lab-3d"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Navigate to 3D Laboratory"
                        role="menuitem"
                    >
                        3D LAB
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Navigate to Profile"
                        role="menuitem"
                    >
                        PROFILE
                    </NavLink>
                    <NavLink
                        to="/history"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
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
            </div>
        </nav>
    );
};

export default Navbar;
