import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';
import "./history.css";

const PAGE_SIZE = 20;

const History = () => {
    const [experiments, setExperiments] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Fetch data from Supabase "experiment_results"
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                if (page === 0) {
                    setInitialLoading(true);
                } else {
                    setLoadingMore(true);
                }

                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const from = page * PAGE_SIZE;
                    const to = (page + 1) * PAGE_SIZE - 1;

                    const { data, error } = await supabase
                        .from('experiment_results')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .range(from, to);

                    if (error) throw error;

                    const newExperiments = data || [];

                    setExperiments(prev => {
                        if (page === 0) return newExperiments;
                        // Avoid duplicates if strict mode causes double fetch, though usually not an issue with simple pagination
                        // A Set based on ID could be safer, but let's stick to simple append for now.
                        const existingIds = new Set(prev.map(e => e.id));
                        const uniqueNew = newExperiments.filter(e => !existingIds.has(e.id));
                        return [...prev, ...uniqueNew];
                    });

                    // If we got fewer items than requested, we've reached the end.
                    if (newExperiments.length < PAGE_SIZE) {
                        setHasMore(false);
                    } else {
                         // We got a full page. Assume there MIGHT be more.
                         // Only way to know for sure is to count or fetch one more.
                         // Standard infinite scroll logic: if full page, assume more.
                         setHasMore(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setInitialLoading(false);
                setLoadingMore(false);
            }
        };

        fetchHistory();
    }, [page]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            setPage(prev => prev + 1);
        }
    };

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
                    {initialLoading ? (
                        <div className="loading-container">
                            <div className="logo-spinner">
                                <img src={logo} alt="Loading..." className="loading-logo-img" />
                            </div>
                            <p className="neon-text blink">LOADING ARCHIVES...</p>
                        </div>
                    ) : experiments.length === 0 ? (
                        <div className="empty-state">No experiments recorded yet. Go to the Lab or Titration to start!</div>
                    ) : (
                        <>
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

                            {hasMore && (
                                <div className="load-more-container">
                                    <button
                                        className="load-more-btn"
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? "LOADING..." : "LOAD MORE"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
