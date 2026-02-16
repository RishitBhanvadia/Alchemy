import React from "react";
import { NavLink } from "react-router-dom";
// import logo from "../assets/logo.png"; // unused based on previous file content, but keeping if logic needs it. Actually previous file was stubbed.
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                {/* <img src={logo} alt="Alchemy Logo" /> */}
                <span className="navbar-title neon-text">ALCHEMY</span>
            </div>
            <ul className="navbar-links">
                <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>DASHBOARD</NavLink></li>
                <li><NavLink to="/lab" className={({ isActive }) => isActive ? "active-link" : ""}>LAB</NavLink></li>
                <li><NavLink to="/titration" className={({ isActive }) => isActive ? "active-link" : ""}>TITRATION</NavLink></li>
                <li><NavLink to="/history" className={({ isActive }) => isActive ? "active-link" : ""}>HISTORY</NavLink></li>
            </ul>
        </nav>
    );
};

export default Navbar;
