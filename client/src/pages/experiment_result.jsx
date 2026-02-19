/* eslint-disable react/no-unknown-property */
import React from "react";
import './experiment_result.css';
import PropTypes from "prop-types";

// eslint-disable-next-line react/prop-types
const ExpResult = ({ num, on }) => {
    return (
        <div style={{ display: on ? 'block' : 'none' }}>
            <svg width="450" height="400" viewBox="0 0 638 438" fill="none" xmlns="http://www.w3.org/2000/svg" className="res">
                <g filter="url(#filter0_b_13_40)">
                    <path d="M0 56.4103C0 25.2536 25.2536 0 56.4103 0H581.59C612.746 0 638 25.2536 638 56.4103V381.59C638 412.746 612.746 438 581.59 438H56.4103C25.2536 438 0 412.746 0 381.59V56.4103Z" fill="white" fillOpacity="0.08" />
                    <path d="M1 56.4103C1 25.8059 25.8059 1 56.4103 1H581.59C612.194 1 637 25.8059 637 56.4103V381.59C637 412.194 612.194 437 581.59 437H56.4103C25.8059 437 1 412.194 1 381.59V56.4103Z" stroke="url(#paint0_linear_13_40)" strokeWidth="2" />
                </g>
                <path d="M288.749 67.2435H349.252" stroke="url(#paint1_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <path d="M319 75.6948L319 61.6092" stroke="url(#paint2_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <path d="M288.749 375.452H349.252" stroke="url(#paint3_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <path d="M319 383.903L319 369.818" stroke="url(#paint4_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <path d="M66.4255 204.629L66.4255 238.441" stroke="url(#paint5_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <path d="M59.3827 221.535L71.7057 221.535" stroke="url(#paint6_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <path d="M571.574 204.629L571.574 238.441" stroke="url(#paint7_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <path d="M564.532 221.535L576.855 221.535" stroke="url(#paint8_linear_13_40)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                    <filter id="filter0_b_13_40" x="-14.0897" y="-14.0897" width="666.179" height="466.179" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feGaussianBlur in="BackgroundImageFix" stdDeviation="7.04487" />
                        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_13_40" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_13_40" result="shape" />
                    </filter>
                    <linearGradient id="paint0_linear_13_40" x1="5.63589" y1="5.6359" x2="636.59" y2="444.759" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0.36" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_13_40" x1="347.112" y1="68.2435" x2="288.749" y2="68.2435" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_13_40" x1="319.5" y1="61.6851" x2="319.5" y2="76.9942" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_13_40" x1="347.112" y1="376.452" x2="288.749" y2="376.452" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint4_linear_13_40" x1="319.5" y1="369.894" x2="319.5" y2="385.203" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint5_linear_13_40" x1="66.9255" y1="204.811" x2="66.9255" y2="241.565" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint6_linear_13_40" x1="71.3268" y1="222.035" x2="59.3827" y2="222.035" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint7_linear_13_40" x1="572.074" y1="204.811" x2="572.074" y2="241.565" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="paint8_linear_13_40" x1="576.475" y1="222.035" x2="564.532" y2="222.035" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6C6C6C" stopOpacity="0" />
                        <stop offset="0.489583" stopColor="#696969" />
                        <stop offset="1" stopColor="#626262" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="text_res">
                <h3>Calculated Result : </h3>
                <h1>{num}</h1>
            </div>

        </div>
    )
}

ExpResult.propTypes = {
    num: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    on: PropTypes.bool
};

export default ExpResult;