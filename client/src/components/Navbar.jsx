import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="glass-navbar">
            <div className="nav-logo">
                <img src={logo} alt="Alchemistry" />
                <span className="logo-text neon-glow">ALCHEMISTRY</span>
            </div>

            <div className="nav-links">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    DASHBOARD
                </NavLink>
                <NavLink to="/lab" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    LABORATORY
                </NavLink>

                <div
                    className="nav-item dropdown-trigger"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
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

export default Navbar;
