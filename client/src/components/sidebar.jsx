import React from "react";
import "./sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sideBar">
      <div className="elements">
        <NavLink to="/lab">
          {({ isActive }) => (
            <div className={`element ${isActive ? "selected" : ""}`}>
              <button className={`element_button lab_button ${isActive ? "selected" : ""}`}>
                <i className="fa-solid fa-flask"></i>
              </button>
            </div>
          )}
        </NavLink>
        <NavLink to="/titration">
          {({ isActive }) => (
            <div className={`element titration ${isActive ? "selected" : ""}`}>
              <button className={`element_button titration_button ${isActive ? "selected" : ""}`}>
                <i className="fa-solid fa-flask-vial"></i>
              </button>
            </div>
          )}
        </NavLink>
        <NavLink to="/organic">
          {({ isActive }) => (
            <div className={`element organic ${isActive ? "selected" : ""}`}>
              <button className={`element_button organic_button ${isActive ? "selected" : ""}`}>
                <i className="fa-solid fa-user-plus"></i>
              </button>
            </div>
          )}
        </NavLink>
        <NavLink to="/inorganic">
          {({ isActive }) => (
            <div className={`element inorganic ${isActive ? "selected" : ""}`}>
              <button className={`element_button inorganic_button ${isActive ? "selected" : ""}`}>
                <i className="fa-solid fa-user-minus"></i>
              </button>
            </div>
          )}
        </NavLink>
        <NavLink to="/history">
          {({ isActive }) => (
            <div className={`element ${isActive ? "selected" : ""}`}>
              <button className={`element_button ${isActive ? "selected" : ""}`}>
                <i className="fa-solid fa-clock-rotate-left"></i>
              </button>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
