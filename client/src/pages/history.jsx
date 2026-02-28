import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';
import logger from '../utils/logger';
import "./history.css";

const History = () => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch data from Supabase "experiment_results"
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('experiment_results')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    setExperiments(data || []);
                }
            } catch (error) {
                logger.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Function to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="history-page">
            <Navbar />

            <div className="history-container">
                <h1 className="neon-glow page-title">EXPERIMENT LOGS</h1>

                <div className="glass-panel history-panel">
                    {loading ? (
                        <div className="loading-container">
                            <div className="logo-spinner">
                                <img src={logo} alt="Loading..." className="loading-logo-img" />
                            </div>
                            <p className="neon-text blink">LOADING ARCHIVES...</p>
                        </div>
                    ) : experiments.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <i className="fa-solid fa-flask-vial"></i>
                            </div>
                            <h3 className="empty-state-title">No Experiments Found</h3>
                            <p className="empty-state-text">Your laboratory log is currently empty. Start conducting experiments to see them recorded here.</p>
                            <button className="empty-state-btn action-button active" onClick={() => navigate("/dashboard")}>
                                START EXPERIMENT
                            </button>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>Type</th>
                                        <th>Score</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experiments.map((exp) => (
                                        <tr key={exp.id}>
                                            <td>{formatDate(exp.created_at)}</td>
                                            <td className="type-cell">{exp.experiment_type}</td>
                                            <td>
                                                <span className={`score-badge ${exp.score >= 90 ? 'high' : exp.score >= 70 ? 'med' : 'low'}`}>
                                                    {exp.score}/100
                                                </span>
                                            </td>
                                            <td className="details-cell">
                                                {exp.details ? (
                                                    Object.entries(exp.details).map(([key, value]) => (
                                                        <span key={key} style={{ marginRight: '10px', display: 'inline-block' }}>
                                                            <strong style={{ color: '#aaa', textTransform: 'capitalize' }}>{key.replace('_', ' ')}:</strong> {value}
                                                        </span>
                                                    ))
                                                ) : "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;