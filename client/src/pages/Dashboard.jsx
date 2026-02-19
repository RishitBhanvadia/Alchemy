import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom";
import "./dashboard.css"
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setUser(user);
        };

        const fetchExperiments = async () => {
            try {
                const { data, error } = await supabase
                    .from('experiments')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setExperiments(data);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error fetching experiments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchExperiments();
    }, [navigate]);

    return (
        <div className="dashboard-page">
            <Navbar />

            <div className="dashboard-content">
                <header className="dashboard-header glass-panel">
                    <h1 className="neon-text">LABORATORY DASHBOARD</h1>
                    <div className="user-info">
                        <span>OPERATOR: {user?.email}</span>
                        <span className="status-indicator online">ONLINE</span>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card glass-panel">
                        <h3>TOTAL EXPERIMENTS</h3>
                        <p className="stat-value">{experiments.length}</p>
                    </div>
                    <div className="stat-card glass-panel">
                        <h3>RECENT ACTIVITY</h3>
                        <p className="stat-value">
                            {experiments.length > 0
                                ? new Date(experiments[0].created_at).toLocaleDateString()
                                : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="experiments-list glass-panel">
                    <h2 className="section-title">EXPERIMENT LOGS</h2>
                    {loading ? (
                        <div className="loading-spinner">LOADING DATA...</div>
                    ) : (
                        <div className="table-container">
                            <table className="experiments-table">
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>HCl (%)</th>
                                        <th>NaCl (%)</th>
                                        <th>CuSO4 (%)</th>
                                        <th>FeSO4 (%)</th>
                                        <th>RESULT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experiments.map((exp) => (
                                        <tr key={exp.id}>
                                            <td>{new Date(exp.created_at).toLocaleDateString()}</td>
                                            <td>{exp.chemical_a}</td>
                                            <td>{exp.chemical_b}</td>
                                            <td>{exp.chemical_c}</td>
                                            <td>{exp.chemical_d}</td>
                                            <td>
                                                <span className="result-tag" style={{ color: exp.color_code }}>
                                                    {exp.result_description}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {experiments.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="no-data">NO DATA RECORDED</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;