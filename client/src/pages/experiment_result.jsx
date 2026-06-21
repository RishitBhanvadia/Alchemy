/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import ResultCustomTestTube from "../components/result_testtube";
import labgif from '../assets/labgigbl.gif'

const ExpResult = ({ num, on }) => {
    const str = "M 218.985 165.204 V 384.283 C 218.985 397.931 232.87 409 250.003 409 C 267.136 409 281.02 397.935 281.02 384.283 V 300H 218.985 Z";
    const all_details = [
        {
            //G0
            "color": "#05b6b8",
            "characterstics": ["Burnt Smell", "No smoke or precipitates formed", "The solution turned thick", "No precipitate formed on reaction with Nessler's Reagent"]
        },
        {
            //G1
            "color": "#0091ee",
            "characterstics": ["No smoke", "Burnt Smell", "No precipitates formed", "No precipitates formed with conc. HCl"]
        },
        {
            //G2
            "color": "#0070bc",
            "characterstics": ["Precipitates formed", "No smoke", "Dissolved in Nitric Acid", "No specific smell"]
        },
        {
            //G3
            "color": "#0070bc",
            "characterstics": ["Pungent Smell due to Ammonia", "Solution became warm", "White smoke", "No precipitates formed"]
        },
        {
            //G4
            "color": "#bcbdbd",
            "characterstics": ["No Smoke", "No precipitates formed", "Pungent Smell due to Ammonia", "No color appears"]
        },
        {
            //G5
            "color": "#0d00ea",
            "characterstics": ["Pungent Smell due to Ammonia", "No smoke", "No precipitates formed", "No rwction with acetic acid"]
        },
        {
            //G6
            "color": "#0d00ea",
            "characterstics": ["No Smoke", "No specific smell", "Does not dissolve in acetic acid", "No precipitates formed"]
        },
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

ExpResult.propTypes = {
    num: PropTypes.number,
    on: PropTypes.bool
};

export default ExpResult;