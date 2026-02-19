import React from "react";
import "./sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sideBar">
      <div className="sideBarList">
        {/* Lab Link */}
        <NavLink
          to="/lab"
          className={({ isActive }) => `sideBarItem ${isActive ? "active" : ""}`}
        >
          <div className="sideBarIcon">
            <i className="fa-solid fa-flask"></i>
          </div>
          <div className="sideBarText">Laboratory</div>
        </NavLink>

        {/* History Link */}
        <NavLink
          to="/history"
          className={({ isActive }) => `sideBarItem ${isActive ? "active" : ""}`}
        >
          <div className="sideBarIcon">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <div className="sideBarText">History</div>
        </NavLink>

        {/* Organic Link */}
        <NavLink
          to="/organic"
          className={({ isActive }) => `sideBarItem ${isActive ? "active" : ""}`}
        >
          <div className="sideBarIcon">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <div className="sideBarText">Organic</div>
        </NavLink>

        {/* Inorganic Link */}
        <NavLink
          to="/inorganic"
          className={({ isActive }) => `sideBarItem ${isActive ? "active" : ""}`}
        >
          <div className="sideBarIcon">
            <i className="fa-solid fa-gem"></i>
          </div>
          <div className="sideBarText">Inorganic</div>
        </NavLink>

        {/* Titration Link */}
        <NavLink
          to="/titration"
          className={({ isActive }) => `sideBarItem ${isActive ? "active" : ""}`}
        >
          <div className="sideBarIcon">
            <i className="fa-solid fa-vial"></i>
          </div>
          <div className="sideBarText">Titration</div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;