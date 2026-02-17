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
                            <NavLink to="/history" className="dropdown-item">HISTORY</NavLink>
                            <NavLink to="/organic" className="dropdown-item">ORGANIC</NavLink>
                            <NavLink to="/inorganic" className="dropdown-item">INORGANIC</NavLink>
                            <NavLink to="/titration" className="dropdown-item">TITRATION</NavLink>
                        </div>
                    )}
                </div>
            </div>

            <div className="nav-profile">
                <div className="profile-icon">ADM</div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    // No props currently, but ready for future additions
};

export default Navbar;
