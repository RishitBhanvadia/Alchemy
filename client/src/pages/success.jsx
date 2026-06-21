/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React from "react";
import Sidebar from "../components/sidebar";
import logo from '../assets/logo.png'
import back from '../assets/back.jpg'
import "./lab.css"
import "./success.css"
import { useNavigate } from "react-router-dom";
import Correct from '../assets/correct.png'

const Success = () => {
    const navigate = useNavigate();
    function goToOrganic() {
        navigate("/organic", {
            replace: true,
        });
    }
    return (
        <div className="succes_page">
            <Sidebar />
            <div className="success_space lab">
                <img className="school" src={back} alt="" />
                <div className="logo"><img src={logo} alt="" /></div>
                <div className="correct_gif">
                    <img src={Correct} alt="" />
                </div>
                <div className="success_text">
                    Congrats! You Guessed It Right...
                </div>
                <button onClick={() => { goToOrganic() }}>TEST MORE COMPOUNDS</button>
            </div>
        </div>
    )
}

export default Success;