import React from "react";

const Polygon = ({c}) => {
    return(
        <svg width="10" height="10" className="triangle" style={{transform: `translate(${3.13*c + 36}px, -48px)`}} viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.9998 37.9998L0.349124 0.499758L43.6504 0.499758L21.9998 37.9998Z" fill="#060606"/>
        </svg>
    )
}

export default Polygon;