import React, { useState, useLayoutEffect, useRef } from "react";
import { gsap } from 'gsap';
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import CustomTestTube from "../components/testtube";
import hcl from '../assets/hcl.png'
import feso4 from '../assets/feso4.png'
import cuso4 from '../assets/cuso4.png'
import nacl from '../assets/nacl.png'
import logo from '../assets/logo.png'
import back from '../assets/back.jpg'
import "./lab.css"

const Lab = () => {
  const app = useRef();

  const [animate, setAnimate] = useState(false);
  const [arr, setArr] = useState([]);
  const [sum, setSum] = useState(0);
  const [tcolor, SetTColor] = useState('');
  const navigate = useNavigate();
  const [chemA, setChemA] = useState(0);
  const [chemB, setChemB] = useState(0);
  const [chemC, setChemC] = useState(0);
  const [chemD, setChemD] = useState(0);

  function change_tip() {
    if (chemA > 0) {
      console.log("Hey");
      SetTColor('#05B9C4');
    }
    else {
      console.log("Yes A Zero");
      if (chemB > 0) {
        SetTColor('#04CE7E');
      }
      else {
        if (chemC > 0) {
          SetTColor('#FBC2E3');
        }
        else {
          if (chemD > 0) {
            SetTColor('#DAA520');
          }
          else {
            SetTColor("");
          }
        }
      }
    }
  }


  useLayoutEffect(() => {
    if (animate) {
      let ctx = gsap.context(() => {
        // use scoped selectors
        gsap.fromTo(".test_tube", { rotation: -9 }, { duration: 0.12, rotation: 6, repeat: -1 });
        gsap.fromTo(".h", { opacity: 1 }, { duration: 0.12, opacity: 0 });
        gsap.fromTo(".n", { opacity: 1 }, { duration: 0.12, opacity: 0 });
        gsap.fromTo(".c", { opacity: 1 }, { duration: 0.12, opacity: 0 });
        gsap.fromTo(".f", { opacity: 1 }, { duration: 0.12, opacity: 0 });

      }, app);
      return () => ctx.revert();
    }
  }, [animate]);



  const handleChemAChange = (e) => {
    const value = parseInt(e.target.value);
    if (value !== 0) {
      if (arr.indexOf('A') == -1) {
        setArr(prev => [...prev, '#848584c8']);
      }
    }
    else {
      if (arr.indexOf('A') !== -1) {
        console.log("Hey");
        setArr(arr.filter(item => item !== '#848584c8'));
      }
    }
    console.log(arr);

    setChemA(value);

    console.log(chemA);
    change_tip();

  };

  const handleChemBChange = (e) => {
    const value = parseInt(e.target.value);
    if (value !== 0) {
      if (arr.indexOf('B') == -1) {
        setArr(prev => [...prev, '#F2F0F0']);
      }
    }
    else {
      if (arr.indexOf('B') !== -1) {
        console.log("Hey");
        setArr(arr.filter(item => item !== '#F2F0F0'));
      }
    }
    console.log(arr);

    setChemB(value);
    change_tip();
  };

  const handleChemCChange = (e) => {
    const value = parseInt(e.target.value);
    if (value !== 0) {
      if (arr.indexOf('C') == -1) {
        setArr(prev => [...prev, '#2987f3bb']);
      }
    }
    else {
      if (arr.indexOf('C') !== -1) {
        console.log("Hey");
        setArr(arr.filter(item => item !== '#2987f3bb'));
      }
    }
    console.log(arr);

    setChemC(value);

    change_tip();
  };

  const handleChemDChange = (e) => {
    const value = parseInt(e.target.value);
    if (value !== 0) {
      if (arr.indexOf('D') == -1) {
        console.log("Hey");
        setArr(prev => [...prev, '#6f4e37c1']);
      }
    }
    else {
      if (arr.indexOf('D') !== -1) {
        setArr(arr.filter(item => item !== '#6f4e37c1'));
      }
    }
    console.log(arr);

    setChemD(value);

    change_tip();
  };

  const useHandlePlayClick = () => {
    SetTColor("");
    document.getElementsByClassName('video-game-button')[0].classList.add('cclick');
    setAnimate(true);
    setTimeout(() => {
      navigate("/result", {
        replace: true,
        state: { chemA, chemB, chemC, chemD },
      });
    }, 500);
  };
  function onOrNot() {
    var sum = 0;
    if (chemA > 0) {
      sum += 1;
    }
    if (chemB > 0) {
      sum += 1;
    }
    if (chemC > 0) {
      sum += 1;
    }
    if (chemD > 0) {
      sum += 1;
    }

    if (sum >= 2) {
      return true;
    }
    else {
      return false;
    }
  }

  const isPlayDisabled = !(onOrNot());
  const whatClass = (!(onOrNot())) ? 'disabled_button' : 'video-game-button';
  return (
    <div ref={app} style={{ display: "flex" }}>
      <Sidebar />
      <div className="lab">
        <img className="school" src={back} alt="" />
        <div className="w h" style={{ height: `${3.23 * chemA}px`, bottom: `${642}px` }}></div>
        <div className="x n" style={{ height: `${3.23 * chemB}px`, bottom: `${642 + 3.23 * chemA}px` }}></div>
        <div className="y c" style={{ height: `${3.23 * chemC}px`, bottom: `${642 + 3.23 * chemB + 3.23 * chemA}px` }}></div>
        <div className="z f" style={{ height: `${3.23 * chemD}px`, bottom: `${642 + 3.23 * chemA + 3.23 * chemB + 3.23 * chemC}px` }}></div>
        <div className="note"><span className="note_text">NOTE: </span>All aqeuous solutions are of 1 M</div>
        <div className="logo"><img src={logo} alt="" /></div>
        <div className="space">
          <div className="rack">
            <p className="rack_text">CHEMICAL RACK :</p>
            {/*HCl Starts*/}
            <div className="chem_item">
              <div className="chemical">
                <div className="chem_logo a_border">
                  <img src={hcl} alt="" />
                </div>
                <div className="chem_name">
                  <p>Conc. HCl</p>
                </div>
              </div>
              <div className="inputs">
                <div className='golmaal'></div>
                <div className="golmaal_again" style={{ width: `${2 * chemA}px`, position: "absolute", height: "5px", backgroundColor: "black" }}></div>
                <div className="input_ban" style={{ width: "220px" }}>
                  <input
                    type="range"
                    name="a"
                    className="range2"
                    id=""
                    min="0"
                    max={100 - chemB - chemC - chemD}
                    style={{ width: `${200 - 2 * (chemB + chemC + chemD)}px` }}
                    value={chemA}
                    onChange={handleChemAChange}
                  />
                </div>
                <p>{chemA} %</p>
              </div>
            </div>
            {/*HCl Ends*/}
            {/*NaCl Starts*/}
            <div className="chem_item">
              <div className="chemical">
                <div className="chem_logo b_border">
                  <img src={nacl} alt="" />
                </div>
                <div className="chem_name">
                  <p>NaCl</p>
                </div>
              </div>
              <div className="inputs">
                <div className='golmaal'></div>
                <div className="golmaal_again" style={{ width: `${2 * chemB}px`, position: "absolute", height: "5px", backgroundColor: "black" }}></div>
                <div className="input_ban" style={{ width: "220px" }}>
                  <input
                    type="range"
                    className="range2"
                    name="b"
                    id=""
                    min="0"
                    max={100 - chemA - chemC - chemD}
                    style={{ width: `${200 - 2 * (chemA + chemC + chemD)}px` }}
                    value={chemB}
                    onChange={handleChemBChange}
                  />
                </div>
                <p>{chemB} %</p>
              </div>
            </div>
            {/*NaCl Ends*/}
            {/*CuSO4 Starts*/}
            <div className="chem_item">
              <div className="chemical">
                <div className="chem_logo c_border">
                  <img src={cuso4} alt="" />
                </div>
                <div className="chem_name">
                  <p>CuSO4</p>
                </div>
              </div>
              <div className="inputs">
                <div className='golmaal'></div>
                <div className="golmaal_again" style={{ width: `${2 * chemC}px`, position: "absolute", height: "5px", backgroundColor: "black" }}></div>
                <div className="input_ban" style={{ width: "220px" }}>
                  <input
                    type="range"
                    className="range2"
                    name="c"
                    id=""
                    min="0"
                    max={100 - chemA - chemB - chemD}
                    style={{ width: `${200 - 2 * (chemA + chemB + chemD)}px` }}
                    value={chemC}
                    onChange={handleChemCChange}
                  />
                </div>
                <p>{chemC} %</p>
              </div>
            </div>
            {/*CuSO4 Ends*/}
            {/*FeSO4 Starts*/}
            <div className="chem_item">
              <div className="chemical">
                <div className="chem_logo d_border">
                  <img src={feso4} alt="" />
                </div>
                <div className="chem_name">
                  <p>FeSO4</p>
                </div>
              </div>
              <div className="inputs">
                <div className='golmaal'></div>
                <div className="golmaal_again" style={{ width: `${2 * chemD}px`, position: "absolute", height: "5px", backgroundColor: "black" }}></div>
                <div className="input_ban" style={{ width: "220px" }}>
                  <input
                    type="range"
                    className="range2"
                    name="d"
                    id=""
                    min="0"
                    max={100 - chemA - chemB - chemC}
                    style={{ width: `${200 - 2 * (chemA + chemC + chemB)}px` }}
                    value={chemD}
                    onChange={handleChemDChange}
                  />
                </div>
                <p>{chemD} %</p>
              </div>
            </div>
            {/*FeSO4 Ends*/}
          </div>

          <div className="test_tube">
            <CustomTestTube color={tcolor} />
          </div>

          <div className="play_button">
            <span class={whatClass}><i class="fa-solid fa-vial"></i></span>
            <button disabled={isPlayDisabled} className="play" onClick={useHandlePlayClick}>PLAY</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lab;
