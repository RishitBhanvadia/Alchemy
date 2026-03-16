import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';
import logo from '../assets/logo.png';

import useAuthStore from '../store/authStore';

const Navbar = () => {
    const profile = useAuthStore(state => state.profile);
    const logout = useAuthStore(state => state.logout);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

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
                    {profile?.role === 'student' ? (
                        <>
                            <NavLink
                                to="/student"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Navigate to Dashboard"
                                role="menuitem"
                            >
                                DASHBOARD
                            </NavLink>
                            <NavLink
                                to="/student/lab"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Navigate to Laboratory"
                                role="menuitem"
                            >
                                3D LAB
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/teacher"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Navigate to Teacher Dashboard"
                                role="menuitem"
                            >
                                DASHBOARD
                            </NavLink>
                            <NavLink
                                to="/teacher/analytics"
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Navigate to Analytics"
                                role="menuitem"
                            >
                                ANALYTICS
                            </NavLink>
                        </>
                    )}
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
                    <div className="profile-icon">{getInitials(profile?.display_name || profile?.full_name)}</div>
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
