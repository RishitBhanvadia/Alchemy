import React from "react";
import PropTypes from 'prop-types';

const Polygon = ({ c }) => {
    return (
        <svg width="601" height="663" viewBox="0 0 601 663" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_14_86)">
                <path d="M57.6596 166.302L277.892 39.145C291.564 31.2524 308.436 31.2524 322.108 39.145L542.34 166.302C556.012 174.195 564.448 188.805 564.448 204.59V458.905C564.448 474.69 556.012 489.301 542.34 497.193L322.108 624.35C308.436 632.243 291.564 632.243 277.892 624.35L57.6596 497.193C43.9877 489.301 35.5518 474.69 35.5518 458.905V204.59C35.5518 188.805 43.9877 174.195 57.6596 166.302Z" fill="black" fillOpacity="0.44" shapeRendering="crispEdges" />
                <path d="M58.1596 167.168L278.392 40.0111C291.801 32.2704 308.199 32.2704 321.608 40.0111L541.84 167.168C555.249 174.909 563.448 189.109 563.448 204.59V458.905C563.448 474.387 555.249 488.587 541.84 496.327L321.608 623.484C308.199 631.225 291.801 631.225 278.392 623.484L58.1596 496.327C44.7508 488.587 36.5518 474.387 36.5518 458.905V204.59C36.5518 189.109 44.7508 174.909 58.1596 167.168Z" stroke={c} strokeWidth="2" shapeRendering="crispEdges" />
            </g>
            <defs>
                <filter id="filter0_d_14_86" x="0.551758" y="0.640137" width="598.896" height="662.215" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset />
                    <feGaussianBlur stdDeviation="17.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.952941 0 0 0 0 1 0 0 0 0.52 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_14_86" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_14_86" result="shape" />
                </filter>
            </defs>
        </svg>

    )
}

Polygon.propTypes = {
    c: PropTypes.string
};

export default Polygon;