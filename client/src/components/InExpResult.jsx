/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import ResultCustomTestTube from "./result_testtube";
import labgif from '../assets/labgigbl.gif'

const InExpResult = ({ num, on }) => {
    const str = "M 218.985 165.204 V 384.283 C 218.985 397.931 232.87 409 250.003 409 C 267.136 409 281.02 397.935 281.02 384.283 V 300H 218.985 Z";
    const all_details = [
        {
            "color": "#d1d69b",
            "characterstics": ["Rusty Smell", "Brown fumes formed", "No change in color after heat", "No precipitate formed"]
        },
        {
            "color": "#fdffff",
            "characterstics": ["Bubbles formed", "CO2 gas formed", "Lime water does not turn milky", "No specific smell"]
        },
        {
            "color": "#e26c50",
            "characterstics": ["No precipitates formed", "No specific smell", "No smoke", "Lead Acetate didn't turned black"]
        },
        {
            "color": "#010202",
            "characterstics": ["No specific smell", "Pottasium Dichromate didn't turned green", "No precipitates formed", "No smoke"]
        },
        {
            //Apna wala
            "color": "#0233AD",
            "characterstics": ["Brown fumes", "Turned starch solution blue", "Pungent smell", "Yellow particles formed"]
        },
        {
            "color": "#c6bd85",
            "characterstics": ["Rusty Smell", "Solution turned thick", "No precipitates formed", "Bubbles formed initially"]
        },
        {
            "color": "#d0cca8",
            "characterstics": ["Pungent Smell", "Yellow smoke", "color didn't changed after heating", "Solution turned thick"]
        },
        {
            "color": "#a6a295",
            "characterstics": ["No specific smell", "No white fumes", "No precipitates formed", "Didn't dissolve Magnesium Dioxide"]
        },
        {
            "color": "#f8fce9",
            "characterstics": ["No specific smell", "No smoke", "No ring formed when reacted with Ferrous", "No precipitates formed"]
        },
        {
            "color": "#f8fce9",
            "characterstics": ["Solution didn't mix", "No smoke formed", "No specific smell", "No precipitates formed"]
        },
        {
            "color": "#FFDD33",
            "characterstics": ["Pungent smell", "Yellow Brown high fumes", "Bubbles formed", "No solids formed"]
        },
        {
            "color": "#EFEBD6",
            "characterstics": ["No specific smell", "Yellow solids formed", "No smoke", "Soluble in HCl"]
        }
    ]


    return (
        <div>
            {
                (on) ? (
                    <div className="load_div">
                        <img src={labgif} alt="" />
                    </div>
                ) :
                    (
                        <div className="result_div">
                            <ResultCustomTestTube color={all_details[num].color} str={str} />
                            <div className="info_1">{all_details[num].characterstics[0]}</div>
                            <div className="info_2">{all_details[num].characterstics[1]}</div>
                            <div className="info_3">{all_details[num].characterstics[2]}</div>
                            <div className="info_4">{all_details[num].characterstics[3]}</div>
                            <svg width="510" height="148" viewBox="0 0 510 148" className="arrow_1" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="2.23401" y1="145.575" x2="198.039" y2="2.98853" stroke="black" strokeWidth="6" />
                                <line x1="198" y1="4" x2="510" y2="4" stroke="black" strokeWidth="6" />
                            </svg>
                            <svg width="530" height="6" className="arrow_2" viewBox="0 0 530 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line y1="3" x2="530" y2="3" stroke="black" strokeWidth="6" />
                            </svg>
                            <svg width="166" height="6" className="arrow_3" viewBox="0 0 166 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line y1="3" x2="166" y2="3" stroke="black" strokeWidth="6" />
                            </svg>
                            <svg width="443" height="74" className="arrow_4" viewBox="0 0 443 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="443" y1="71" x2="86" y2="71" stroke="black" strokeWidth="6" />
                                <line x1="86.1124" y1="70.3317" x2="2.1124" y2="2.33173" stroke="black" strokeWidth="6" />
                            </svg>
                        </div>
                    )
            }
        </div>
    )

}

InExpResult.propTypes = {
    num: PropTypes.number,
    on: PropTypes.bool
};

export default InExpResult;