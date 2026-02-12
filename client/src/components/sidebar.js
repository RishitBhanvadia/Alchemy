import React from "react";
import "./sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sideBar">
      <div className="elements">
        <NavLink to="/lab">
          {({ isActive }) => (
            <div
              className={`element ${isActive ? "selected" : ""}`}
            >
              <div
                className={`element_button lab_button ${isActive ? "selected" : ""}`}
              >
                <i className="fa-solid fa-flask"></i>
              </div>
            </div>
          )}
        </NavLink>
        <NavLink to="/titration">
          {({ isActive }) => (
            <div
              className={`element titration ${isActive ? "selected" : ""}`}
            >
              <div
                className={`element_button titration_button ${isActive ? "selected" : ""}`}
              >
                <i className="fa-solid fa-flask-vial"></i>
              </div>
            </div>
          )}
        </NavLink>
        <NavLink to="/organic">
          {({ isActive }) => (
            <div
              className={`element organic ${isActive ? "selected" : ""}`}
            >
              <div
                className={`element_button organic_button ${isActive ? "selected" : ""}`}
              >
                <i className="fa-solid fa-user-plus"></i>
              </div>
            </div>
          )}
        </NavLink>
        <NavLink to="/inorganic">
          {({ isActive }) => (
            <div
              className={`element inorganic ${isActive ? "selected" : ""}`}
            >
              <div
                className={`element_button inorganic_button ${isActive ? "selected" : ""}`}
              >
                <i className="fa-solid fa-user-minus"></i>
              </div>
            </div>
          )}
        </NavLink>
        <NavLink to="/history">
          {({ isActive }) => (
            <div
              className={`element ${isActive ? "selected" : ""}`}
            >
              <div
                className={`element_button ${isActive ? "selected" : ""}`}
              >
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
