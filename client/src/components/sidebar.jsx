import React, { useState } from "react";
import "./sidebar.css";
import { NavLink } from "react-router-dom";
// import Star from '../assets/star.png'

const Sidebar = () => {
  const getTabFromRoute = (route) => {
    switch (route) {
      case "/lab":
        return "lab";
      case "/titration":
        return "titration";
      case "/organic":
        return "organic";
      case "/inorganic":
        return "inorganic";
      case "/history":
        return "history";
      default:
        return "";
    }
  };

  const [selectedTab, setSelectedTab] = useState(() => getTabFromRoute(window.location.pathname));

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="sideBar">
      <div className="elements">
        <NavLink
          to="/lab"
          className="selected"
          onClick={() => handleTabClick("lab")}
        >
          <div
            className={`element ${selectedTab === "lab" ? "selected" : ""}`}
          >
            <button
              className={`element_button lab_button ${selectedTab === "lab" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-flask"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/titration"
          className="selected"
          onClick={() => handleTabClick("titration")}
        >
          <div
            className={`element titration ${selectedTab === "titration" ? "selected" : ""
              }`}
          >
            <button
              className={`element_button titration_button ${selectedTab === "titration" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-flask-vial"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/organic"
          className="selected"
          onClick={() => handleTabClick("organic")}
        >
          <div
            className={`element organic ${selectedTab === "organic" ? "selected" : ""
              }`}
          >
            <button
              className={`element_button organic_button ${selectedTab === "organic" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-user-plus"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/inorganic"
          className="selected"
          onClick={() => handleTabClick("inorganic")}
        >
          <div
            className={`element inorganic ${selectedTab === "inorganic" ? "selected" : ""
              }`}
          >
            <button
              className={`element_button inorganic_button ${selectedTab === "inorganic" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-user-minus"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/history"
          className="selected"
          onClick={() => handleTabClick("history")}
        >
          <div
            className={`element ${selectedTab === "history" ? "selected" : ""
              }`}
          >
            <button
              className={`element_button ${selectedTab === "history" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-clock-rotate-left"></i>
            </button>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
