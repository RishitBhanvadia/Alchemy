import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
    // eslint-disable-next-line no-unused-vars
    const [selectedTab, setSelectedTab] = useState("/lab");

    useEffect(() => {
        const getTabFromRoute = (route) => {
            switch (route) {
                case "/lab":
                    return "/lab";
                case "/titration":
                    return "/titration";
                case "/organic":
                    return "/organic";
                case "/inorganic":
                    return "/inorganic";
                default:
                    return "/lab";
            }
        };
        const currentRoute = window.location.pathname;
        const activeTab = getTabFromRoute(currentRoute);
        // Using setTimeout to break the synchronous setState call in effect warning, although technically fine for route sync on mount.
        setTimeout(() => setSelectedTab(activeTab), 0);
    }, []);

    return (
        <div className="sideBar">
            <Link to="/lab" className={selectedTab === "/lab" ? "active" : ""}>Lab</Link>
            <Link to="/titration" className={selectedTab === "/titration" ? "active" : ""}>Titration</Link>
            <Link to="/organic" className={selectedTab === "/organic" ? "active" : ""}>Organic</Link>
            <Link to="/inorganic" className={selectedTab === "/inorganic" ? "active" : ""}>Inorganic</Link>
        </div>
    );
};

export default Sidebar;
