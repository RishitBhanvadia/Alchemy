import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

                <div
                    className="nav-item dropdown-trigger"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    tabIndex={0}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setDropdownOpen(!dropdownOpen);
                        }
                    }}
                >
                    MORE <i className="fa-solid fa-chevron-down"></i>
                    {dropdownOpen && (
                        <div className="dropdown-menu glass-panel">
                            <NavLink to="/history" className="dropdown-item">
                                HISTORY
                            </NavLink>
                            <NavLink to="/organic" className="dropdown-item">
                                ORGANIC
                            </NavLink>
                            <NavLink to="/inorganic" className="dropdown-item">
                                INORGANIC
                            </NavLink>
                            <NavLink to="/titration" className="dropdown-item">
                                TITRATION
                            </NavLink>
                        </div>
                    )}
                </div>
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
                    style={{
                        marginLeft: '1rem',
                        background: 'transparent',
                        border: '1px solid #ff0055',
                        color: '#ff0055',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    LOGOUT
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
