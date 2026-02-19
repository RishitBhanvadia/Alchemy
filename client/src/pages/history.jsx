import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom";
import "./history.css"
import Navbar from "../components/Navbar";

const History = () => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExperiments = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('experiments')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setExperiments(data);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiments();
    }, [navigate]);

    return (
        <div className="history-page">
            <Navbar />
            <div className="history-content glass-panel">
                <h1 className="neon-text">EXPERIMENT ARCHIVE</h1>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>RETRIEVING DATA...</p>
                    </div>
                ) : (
                    <div className="timeline">
                        {experiments.map((exp) => (
                            <div key={exp.id} className="timeline-item">
                                <div className="timeline-date">
                                    {new Date(exp.created_at).toLocaleDateString()}
                                    <span className="timeline-time">
                                        {new Date(exp.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="timeline-content glass-panel">
                                    <div className="exp-result" style={{ borderColor: exp.color_code }}>
                                        <h3>{exp.result_description}</h3>
                                        <span className="exp-value">Value: {exp.result_value}</span>
                                    </div>
                                    <div className="exp-details">
                                        <div className="chem-badge hcl">HCl: {exp.chemical_a}%</div>
                                        <div className="chem-badge nacl">NaCl: {exp.chemical_b}%</div>
                                        <div className="chem-badge cuso4">CuSO4: {exp.chemical_c}%</div>
                                        <div className="chem-badge feso4">FeSO4: {exp.chemical_d}%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {experiments.length === 0 && (
                            <div className="no-history">
                                <p>NO ARCHIVED DATA FOUND</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;