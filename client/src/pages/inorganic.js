import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import logo from '../assets/logo.png'
import back from '../assets/back.jpg'
import InCompoundImg from "../components/InCompundImg";
import InExpResult from "../components/InExpResult";
import "./lab.css"
import './organic.css'
import './inorganic.css'

const Inorganic = () => {
  const navigate = useNavigate();
  const [on, setOn] = useState(false);
  const [first, setFirst] = useState(true);
  const [datanum, setDatanum] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [uans, setUAns] = useState('');
  function send_info(i) {
    setOn(true);
    setTimeout(() => {
      setOn(false);
    }, 1000);
    setFirst(false);
    setDatanum(i);
  }

  function checkAns() {
    if (uans === 'Nitrite' || uans === 'nitrite') {
      navigate("/success", {
        replace: true,
      });
    }
    else {
      setWrong(true);
      setTimeout(() => {
        setWrong(false);
      }, 1000);
    }
  }

  const handleChange = (event) => {
    // 👇 Get input value from "event"
    setUAns(event.target.value);
  };
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="working_space lab">
        <img className="school" src={back} alt="" />
        <div className="note"><span className="note_text">NOTE: </span>Refer Your Chemistry Lab Mannual Page - 51</div>
        <div className="logo"><img src={logo} alt="" /></div>
        <div className="experiment_area">
          <div className="visible_exp">
            {
              (first) ? <InCompoundImg /> : <InExpResult num={datanum} on={on} />
            }
          </div>
          <div className="exp_buttons in_exp_button">
            <button onClick={() => send_info(0)} className="hha">PT - H2SO4</button>
            <button onClick={() => send_info(1)} className="hha">CT - Carbonate</button>
            <button onClick={() => send_info(2)} className="hha">CT - Sulphide</button>
            <button onClick={() => send_info(3)} className="hha">CT - Sulphite</button>
            <button onClick={() => send_info(4)} className="hha">CT - Nitrite</button>
            <button onClick={() => send_info(5)} className="hha">CT - Acetate</button>
            <button onClick={() => send_info(6)} className="hha">PT - conc. H2SO4</button>
            <button onClick={() => send_info(6)} className="hha">CT - Chloride</button>
            <button onClick={() => send_info(6)} className="hha">CT - Bromide</button>
            <button onClick={() => send_info(6)} className="hha">CT - Iodide</button>
            <button onClick={() => send_info(6)} className="hha">CT - Nitrate</button>
            <button onClick={() => send_info(6)} className="hha">CT - Oxalate</button>
          </div>
          <div className="input_ans">
            <input type="text" className={(wrong) ? 'wrong' : ''} onChange={handleChange} placeholder="ENTER ANION NAME Nitrite, Carbonate, Sulphide etc" />
            <button onClick={() => { checkAns() }}>SUBMIT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inorganic;
