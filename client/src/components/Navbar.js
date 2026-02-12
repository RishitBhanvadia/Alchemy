import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileOpen(false);
        setDropdownOpen(false);
    };

    return (
        <nav className="glass-navbar">
            <div className="nav-logo">
                <img src={logo} alt="Alchemistry" />
                <span className="logo-text neon-glow">ALCHEMISTRY</span>
            </div>

            <div className="hamburger" onClick={toggleMobileMenu}>
                <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </div>

            <div className={`nav-links ${isMobileOpen ? 'mobile-open' : ''}`}>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                >
                    DASHBOARD
                </NavLink>
                <NavLink
                    to="/lab"
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                >
                    LABORATORY
                </NavLink>

                <div
                    className="nav-item dropdown-trigger"
                    onMouseEnter={() => window.innerWidth > 768 && setDropdownOpen(true)}
                    onMouseLeave={() => window.innerWidth > 768 && setDropdownOpen(false)}
                    onClick={() => window.innerWidth <= 768 && setDropdownOpen(!dropdownOpen)}
                >
                    MORE <i className={`fa-solid fa-chevron-down ${dropdownOpen ? 'rotate' : ''}`}></i>

                    <div className={`dropdown-menu glass-panel ${dropdownOpen ? 'show' : ''}`}>
                        <NavLink to="/history" className="dropdown-item" onClick={closeMobileMenu}>HISTORY</NavLink>
                        <NavLink to="/organic" className="dropdown-item" onClick={closeMobileMenu}>ORGANIC</NavLink>
                        <NavLink to="/inorganic" className="dropdown-item" onClick={closeMobileMenu}>INORGANIC</NavLink>
                        <NavLink to="/titration" className="dropdown-item" onClick={closeMobileMenu}>TITRATION</NavLink>
                    </div>
                </div>
            </div>

            <div className="nav-profile">
                <div className="profile-icon">ADM</div>
            </div>
        </nav>
    );
};

export default Navbar;
