import React from "react";
import PropTypes from "prop-types";

const ResultTestTube = ({ solid_color, color }) => {
    return (
        <svg width="405" height="500" viewBox="0 0 405 713" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M291.86 690.921C354.959 690.921 354.2 690.921 354.2 682.363C354.2 652.354 354.2 788.926 354.2 536.51C354.2 530.808 357.621 527.353 359.149 524.761C359.912 523.467 358.78 522.157 354.2 522.157H225.734C225.734 522.157 222.556 522.157 219.922 524.304C216.866 526.796 215.2 528.939 216.74 530.712C225.734 528.939 225.734 529.521 225.734 533.991C225.734 583.095 225.734 649.74 225.734 682.363C225.734 690.921 225.923 690.921 291.86 690.921Z" fill={solid_color} stroke="black" strokeWidth="1.06299" strokeLinejoin="round" />
            <path d="M291.86 690.921C354.959 690.921 354.2 690.921 354.2 682.363C354.2 652.354 354.2 788.926 354.2 536.51C354.2 530.808 357.621 527.353 359.149 524.761C359.912 523.467 358.78 522.157 354.2 522.157H225.734C225.734 522.157 222.556 522.157 219.922 524.304C216.866 526.796 215.2 528.939 216.74 530.712C225.734 528.939 225.734 529.521 225.734 533.991C225.734 583.095 225.734 649.74 225.734 682.363C225.734 690.921 225.923 690.921 291.86 690.921Z" fill={color} className="tube_chem" stroke="black" strokeWidth="1.06299" strokeLinejoin="round" />
            <path d="M42.8123 0.783752H50.6248C55.4305 0.783752 59.3262 3.73759 59.3262 7.38131V690.306C59.3262 693.949 55.4305 696.903 50.6248 696.903H42.8123C38.0067 696.903 34.111 693.949 34.111 690.306V7.38131C34.111 3.73759 38.0067 0.783752 42.8123 0.783752Z" fill="url(#paint0_linear_91_125)" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.7932 691.385H397.289C401.102 691.385 404.193 692.508 404.193 693.894V700.263C404.193 701.648 401.102 702.772 397.289 702.772H19.7932C15.9804 702.772 12.8896 701.648 12.8896 700.263V693.894C12.8896 692.508 15.9804 691.385 19.7932 691.385Z" fill="url(#paint1_linear_91_125)" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <filter id="filter0_f_91_125" x="281.528" y="375.315" width="25.331" height="58.6307" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="0.302325" result="effect1_foregroundBlur_91_125" />
                </filter>
                <linearGradient id="paint0_linear_91_125" x1="60.459" y1="348.866" x2="32.9742" y2="348.866" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4A4A4A" />
                    <stop offset="0.26613" stopColor="#4A4A4A" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
                <linearGradient id="paint1_linear_91_125" x1="426.953" y1="697.767" x2="426.953" y2="708.622" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4A4A4A" />
                    <stop offset="0.175" stopColor="#4A4A4A" stopOpacity="0.24706" />
                    <stop offset="0.39656" stopColor="#4A4A4A" stopOpacity="0.49804" />
                    <stop offset="1" stopColor="#4A4A4A" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint2_linear_91_125" x1="70.1378" y1="268.485" x2="28.9936" y2="268.485" gradientUnits="userSpaceOnUse">
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

ResultTestTube.propTypes = {
    solid_color: PropTypes.string,
    color: PropTypes.string
};

export default ResultTestTube;