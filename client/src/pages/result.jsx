import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ResultTestTube from "../components/result_testtube";
import ExpResult from "./experiment_result";
import "./result.css"
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

const Result = () => {
    const location = useLocation();
    const { chemA, chemB, chemC, chemD } = location.state || { chemA: 0, chemB: 0, chemC: 0, chemD: 0 };
    const [result, setResult] = useState('');
    const [color, setColor] = useState('');
    const [s_color, setSColor] = useState('');
    const [num, setNum] = useState(0);
    const [on, setOn] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const calculateResult = useCallback(async () => {
        try {
            const response = await axios.post('/api/calculate-result', {
                chemA, chemB, chemC, chemD
            });

            const { result, color, solid_color, num } = response.data;
            setResult(result);
            setColor(color);
            setSColor(solid_color);
            setNum(num);

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error calculating result:', error);
            setResult('Error');
        }
    }, [chemA, chemB, chemC, chemD]);

    useEffect(() => {
        calculateResult();
    }, [calculateResult]);

    const handleSaveResult = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Please login to save results');
                return;
            }

            const { error } = await supabase
                .from('experiments')
                .insert([
                    {
                        user_id: user.id,
                        chemical_a: chemA,
                        chemical_b: chemB,
                        chemical_c: chemC,
                        chemical_d: chemD,
                        result_value: num,
                        result_description: result,
                        color_code: color
                    }
                ]);

            if (error) throw error;
            toast.success('Result saved successfully!');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error saving result:', error);
            toast.error('Failed to save result');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="result-page">
            <h1 className="neon-text">REACTION ANALYSIS</h1>

            <div className="result-content glass-panel">
                <div className="visualization-area">
                    <div className="result-tube-container">
                        <ResultTestTube solid_color={s_color} color={color} />
                    </div>
                </div>

                <div className="data-area">
                    <div className="data-card">
                        <h3>INPUT PARAMETERS</h3>
                        <div className="parameter-grid">
                            <div className="param-item">
                                <span className="label">HCl</span>
                                <span className="value">{chemA}%</span>
                            </div>
                            <div className="param-item">
                                <span className="label">NaCl</span>
                                <span className="value">{chemB}%</span>
                            </div>
                            <div className="param-item">
                                <span className="label">CuSO4</span>
                                <span className="value">{chemC}%</span>
                            </div>
                            <div className="param-item">
                                <span className="label">FeSO4</span>
                                <span className="value">{chemD}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="action-area">
                        <button className="cyber-button" onClick={() => setOn(!on)}>
                            {on ? 'HIDE DATA' : 'VIEW DATA'}
                        </button>
                        <button
                            className="cyber-button save-btn"
                            onClick={handleSaveResult}
                            disabled={isSaving}
                        >
                            {isSaving ? 'SAVING...' : 'SAVE TO DATABASE'}
                        </button>
                    </div>

                    <ExpResult on={on} num={num} />
                </div>
            </div>
        </div>
    );
};

export default Result;