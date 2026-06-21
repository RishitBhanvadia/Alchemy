/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState, useEffect, } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ResultCustomTestTube from '../components/result_testtube'
import cloud from '../assets/cloud.png'
import boom from '../assets/boom.gif'
import logo from '../assets/logo.png'
import Bubble from '../components/banner'
import logger from '../utils/logger';
import { supabase } from '../supabaseClient';
import { getResult } from '../utils/api';
import './result.css'

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State hooks must be unconditional (at the top)
  const [data, setData] = useState();
  const localCart = JSON.parse(localStorage.getItem('cart'));
  const [cart, setCart] = useState(localCart);

  // Redirect if no state (e.g., user refreshed the page)
  useEffect(() => {
    if (!location.state) {
      navigate('/lab');
    }
  }, [location.state, navigate]);

  // Data fetching hook
  useEffect(() => {
    if (!location.state) return;

    let isMounted = true;

    const fetchResult = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;
        
        const response = await getResult(
          location.state.chemA, 
          location.state.chemB, 
          location.state.chemC, 
          location.state.chemD,
          userId
        );
        
        const resultData = response.data;
        // Normalize API response to match expected format
        const normalizedData = Array.isArray(resultData) ? resultData : [resultData];
        const normalized = normalizedData.map(item => ({
          ...item,
          // Map new API field names to old expected names
          result: item.outcome_label || item.result,
          product_name: item.product_formula || item.product_name || '',
          product_info: item.ai_tutor_context || item.product_info || '',
          solid_color: item.state_change?.includes('Solid Color') ? '#888' : '',
          gas: item.state_change?.includes('Gas') ? 'Yes' : 'None',
          solid: item.state_change?.includes('Precipitate') ? 'Yes' : 'None',
          product_properties: [],
          product_uses: []
        }));
        
        // Only update state if component is still mounted
        if (isMounted) {
          setData(normalized);
        }

        if (!normalized || normalized.length === 0) {
          logger.warn("No data received from backend");
          return;
        }

        // Save to experiment_results table for scores/analytics
        if (user && normalized[0]) {
          try {
            await supabase.from('experiment_results').insert({
              user_id: user.id,
              experiment_type: 'inorganic',
              chem_a: location.state.chemA,
              chem_b: location.state.chemB,
              chem_c: location.state.chemC,
              chem_d: location.state.chemD,
              result_name: normalized[0].product_formula || normalized[0].outcome_label,
              result_formula: normalized[0].product_formula,
              score: 100
            });
            logger.info("Experiment saved to experiment_results");
          } catch (err) {
            logger.error("Failed to save to experiment_results:", err);
          }
        }

        // Update localStorage cart (for local history display)
        const d = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const rdx = {
          "id": crypto.randomUUID(), // Add unique ID to each entry
          "date": d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear(),
          "time": d.getHours() + ":" + d.getMinutes(),
          "conc_a": location.state.chemA,
          "conc_b": location.state.chemB,
          "conc_c": location.state.chemC,
          "conc_d": location.state.chemD,
          "color": normalized[0]?.color || "#ffffff",
          "main": normalized[0]?.product_formula || normalized[0]?.outcome_label || "Unknown"
        };

        // Fix race condition: always read latest value before writing
        const updateCartAtomically = () => {
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            // Check if this specific result (rdx.id) is already in cart to avoid double-adding if state re-rendered
            if (currentCart.some(item => item.id === rdx.id)) return currentCart;
            
            const newCart = [...currentCart, rdx];
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        };

        const finalCart = updateCartAtomically();
        
        if (isMounted) {
          setCart(finalCart);
          setData(normalized);
        }
      } catch (error) {
        logger.error("Fetch error:", error);
        if (isMounted) {
          setData([{
            color: "#ff0000",
            result: `Error: ${error.message}`,
            solid_color: "#000",
            gas_color: "#000",
            gas: "None",
            solid: "None",
            product_name: "Error",
            product_info: `Debug Info: ${error.message}`,
            product_properties: [],
            product_uses: []
          }]);
        }
      }
    };

    fetchResult();
    
    // Cleanup: prevent setState on unmounted component
    return () => { isMounted = false; };
  }, [location.state]);

  // Cart persistence hook
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Early return MUST happen after all hooks
  if (!location.state) {
    return null;
  }

  const chemh = "M 218.985 165.204 V 384.283 C 218.985 397.931 232.87 409 250.003 409 C 267.136 409 281.02 397.935 281.02 384.283 V" + (387.28 - (location.state.chemA + location.state.chemB + location.state.chemC + location.state.chemD) * 3.3) + "H 218.985 Z";

  return (
    <div className="result-page">
      {
        (typeof data === "undefined" || !data) ?
          (
            <div className="loading-container glass-panel">
              <div className="logo-spinner">
                <img src={logo} alt="Loading..." className="loading-logo-img" />
              </div>
              <p className="neon-text blink">ANALYZING REACTION...</p>
            </div>
          ) :
          <div className='result-container'>
            {/* Background Elements */}
            <div className="bubbles"><Bubble /></div>

            {
              data.map((item, index) => (
                <div className="result-content-wrapper" key={index}>

                  <div className="result-header glass-panel">
                    <div className="boom-container">
                      <img src={boom} alt="Reaction" />
                    </div>
                    <h2 className="neon-glow">REACTION COMPLETE</h2>
                    <div className="note-badge">NOTE: Standard Temperature & Pressure</div>
                  </div>

                  <div className="result-grid">
                    {/* Left: Input Analysis */}
                    <div className="glass-panel input-analysis">
                      <h3 className="section-title">INPUT ANALYSIS</h3>
                      <div className="chemical-list">
                        <div className="chem-row">
                          <div className="color-dot box_hcl"></div>
                          <span className="chem-label">Conc. HCl</span>
                          <div className="progress-bar-wrapper">
                            <div className="progress-fill" style={{ width: `${location.state.chemA}%`, background: '#05B9C4' }}></div>
                          </div>
                          <span className="chem-percent">{location.state.chemA}%</span>
                        </div>
                        <div className="chem-row">
                          <div className="color-dot box_nacl"></div>
                          <span className="chem-label">NaCl</span>
                          <div className="progress-bar-wrapper">
                            <div className="progress-fill" style={{ width: `${location.state.chemB}%`, background: '#04CE7E' }}></div>
                          </div>
                          <span className="chem-percent">{location.state.chemB}%</span>
                        </div>
                        <div className="chem-row">
                          <div className="color-dot box_cuso4"></div>
                          <span className="chem-label">CuSO4</span>
                          <div className="progress-bar-wrapper">
                            <div className="progress-fill" style={{ width: `${location.state.chemC}%`, background: '#FBC2E3' }}></div>
                          </div>
                          <span className="chem-percent">{location.state.chemC}%</span>
                        </div>
                        <div className="chem-row">
                          <div className="color-dot box_feso4"></div>
                          <span className="chem-label">FeSO4</span>
                          <div className="progress-bar-wrapper">
                            <div className="progress-fill" style={{ width: `${location.state.chemD}%`, background: '#DAA520' }}></div>
                          </div>
                          <span className="chem-percent">{location.state.chemD}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Test Tube Result */}
                    <div className="glass-panel visual-result">
                      <h3 className="section-title">OBSERVATION</h3>
                      <div className="result-equation neon-text">{item.result}</div>

                      <div className="result-testtube-container">
                        <ResultCustomTestTube color={item.color} solid_color={item.solid_color} gas_color={item.gas_color} gas={item.gas} solid={item.solid} str={chemh} />
                      </div>

                      <div className="smell-indicator">
                        <img src={cloud} alt="" />
                        <span className={(location.state.chemA > 0) ? "smell-warn" : "smell-safe"}>
                          {(location.state.chemA > 0) ? "PUNGENT ODOR DETECTED (HCl)" : "NO DISTINCT ODOR"}
                        </span>
                      </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="glass-panel product-details">
                      <h3 className="section-title">PRODUCT DATA</h3>
                      {
                        (item.product_name === "") ? <div className="no-product">No Reaction / No Products</div> :
                          <>
                            <h1 className="product-name neon-glow">{item.product_name || "Unknown Product"}</h1>
                            <p className="product-desc">{item.product_info || "No details available."}</p>

                            <div className="info-group">
                              <h4><i className="fa-solid fa-dna"></i> PROPERTIES</h4>
                              <ul>
                                {(item.product_properties || []).map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>

                            <div className="info-group">
                              <h4><i className="fa-solid fa-mortar-pestle"></i> APPLICATIONS</h4>
                              <ul>
                                {(item.product_uses || []).map((u, i) => <li key={i}>{u}</li>)}
                              </ul>
                            </div>
                          </>
                      }
                      <button className='next-button action-button' onClick={() => { navigate("/lab") }}>
                        NEW EXPERIMENT
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
      }
    </div>
  )
}

export default Result;