import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
import back from '../assets/back.jpg'
import Nothing from '../assets/money.png'
import './lab.css'
import './history.css'

const History = () => {
    const navigate = useNavigate();
    const localCart = JSON.parse(localStorage.getItem('cart'));
    console.log(localCart);
    const [empty, setEmpty] = useState(false);
    function performAgain(chemA, chemB, chemC, chemD) {
        navigate("/result", {
            replace: true,
            state: { chemA, chemB, chemC, chemD },
        });
    }
    return (
        <div className="main_history">
            <Sidebar />
            <div className="history_space lab">
                <img className="school" src={back} alt="" />
                <div className="logo"><img src={logo} alt="" /></div>
                <div className="exp_history">YOUR EXPERIMENT HISTORY
                    <button onClick={() => { localStorage.removeItem('cart'); setEmpty(true) }} className="del_history"><i class="fa-solid fa-trash"></i></button></div>
                {
                    (empty || localCart === null) ? <div className="empty">
                        <img src={Nothing} alt="" />
                        <div className="empty_text">NO HISTORY FOUND</div>
                    </div> :
                        <div className="history_table">
                            <div class="table">
                                <div class="row green">
                                    <div class="cell">
                                        Date
                                    </div>
                                    <div class="cell">
                                        Time
                                    </div>
                                    <div class="cell">
                                        HCl
                                    </div>
                                    <div class="cell">
                                        NaCl
                                    </div>
                                    <div class="cell">
                                        CuSO4
                                    </div>
                                    <div class="cell">
                                        FeSO4
                                    </div>
                                    <div class="cell">
                                        Color
                                    </div>
                                    <div class="cell">
                                        Main Product
                                    </div>
                                    <div class="cell">
                                        Actions
                                    </div>
                                </div>
                                {
                                    localCart.reverse().map((item, index) => (
                                        <div class="row" key={index}>
                                            <div class="cell" data-title="Date">
                                                {item.date}
                                            </div>
                                            <div class="cell" data-title="Time">
                                                {item.time}
                                            </div>
                                            <div class="cell" data-title="HCl">
                                                {item.conc_a}
                                            </div>
                                            <div class="cell" data-title="NaCl">
                                                {item.conc_b}
                                            </div>
                                            <div class="cell" data-title="CuSO4">
                                                {item.conc_c}
                                            </div>
                                            <div class="cell" data-title="FeSO4">
                                                {item.conc_d}
                                            </div>
                                            <div class="cell" data-title="Color" style={{ backgroundColor: `${item.color}` }}>
                                            </div>
                                            <div class="cell" data-title="Main Product">
                                                {item.main}
                                            </div>
                                            <div class="cell" data-title="Action">
                                                <button class="open_button" onClick={() => { performAgain(item.conc_a, item.conc_b, item.conc_c, item.conc_d) }}>PERFORM</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default History;