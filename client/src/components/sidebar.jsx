import React from "react";
import "./sidebar.css";
import { NavLink, useLocation } from "react-router-dom";


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

const Sidebar = () => {
  const location = useLocation();
  const selectedTab = getTabFromRoute(location.pathname);



  return (
    <div className="sideBar">
      <div className="elements">
        <NavLink
          to="/lab"
          className={({ isActive }) => isActive ? "selected" : ""}

        >
          <div
            className={`element ${selectedTab === "lab" ? "selected" : ""}`}
          >
            <button
              aria-label="Lab"
              title="Lab"
              className={`element_button lab_button ${selectedTab === "lab" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-flask"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/titration"
          className={({ isActive }) => isActive ? "selected" : ""}

        >
          <div
            className={`element titration ${selectedTab === "titration" ? "selected" : ""
              }`}
          >
            <button
              aria-label="Titration"
              title="Titration"
              className={`element_button titration_button ${selectedTab === "titration" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-flask-vial"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/organic"
          className={({ isActive }) => isActive ? "selected" : ""}

        >
          <div
            className={`element organic ${selectedTab === "organic" ? "selected" : ""
              }`}
          >
            <button
              aria-label="Organic Chemistry"
              title="Organic Chemistry"
              className={`element_button organic_button ${selectedTab === "organic" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-user-plus"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/inorganic"
          className={({ isActive }) => isActive ? "selected" : ""}

        >
          <div
            className={`element inorganic ${selectedTab === "inorganic" ? "selected" : ""
              }`}
          >
            <button
              aria-label="Inorganic Chemistry"
              title="Inorganic Chemistry"
              className={`element_button inorganic_button ${selectedTab === "inorganic" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-user-minus"></i>
            </button>
          </div>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => isActive ? "selected" : ""}

        >
          <div
            className={`element ${selectedTab === "history" ? "selected" : ""
              }`}
          >
            <button
              aria-label="History"
              title="History"
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
