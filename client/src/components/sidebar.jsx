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
          aria-label="General Chemistry Lab"
          title="General Chemistry Lab"
        >
          <div
            className={`element ${selectedTab === "lab" ? "selected" : ""}`}
          >
            <span
              className={`element_button lab_button ${selectedTab === "lab" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-flask" aria-hidden="true"></i>
            </span>
          </div>
        </NavLink>
        <NavLink
          to="/titration"
          className={({ isActive }) => isActive ? "selected" : ""}
          aria-label="Titration Lab"
          title="Titration Lab"
        >
          <div
            className={`element titration ${selectedTab === "titration" ? "selected" : ""
              }`}
          >
            <span
              className={`element_button titration_button ${selectedTab === "titration" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-flask-vial" aria-hidden="true"></i>
            </span>
          </div>
        </NavLink>
        <NavLink
          to="/organic"
          className={({ isActive }) => isActive ? "selected" : ""}
          aria-label="Organic Chemistry Lab"
          title="Organic Chemistry Lab"
        >
          <div
            className={`element organic ${selectedTab === "organic" ? "selected" : ""
              }`}
          >
            <span
              className={`element_button organic_button ${selectedTab === "organic" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
            </span>
          </div>
        </NavLink>
        <NavLink
          to="/inorganic"
          className={({ isActive }) => isActive ? "selected" : ""}
          aria-label="Inorganic Chemistry Lab"
          title="Inorganic Chemistry Lab"
        >
          <div
            className={`element inorganic ${selectedTab === "inorganic" ? "selected" : ""
              }`}
          >
            <span
              className={`element_button inorganic_button ${selectedTab === "inorganic" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-user-minus" aria-hidden="true"></i>
            </span>
          </div>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => isActive ? "selected" : ""}
          aria-label="Experiment History"
          title="Experiment History"
        >
          <div
            className={`element ${selectedTab === "history" ? "selected" : ""
              }`}
          >
            <span
              className={`element_button ${selectedTab === "history" ? "selected" : ""
                }`}
            >
              <i className="fa-solid fa-clock-rotate-left" aria-hidden="true"></i>
            </span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
