import PropTypes from 'prop-types';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useHistoryStore from "../store/historyStore";
import EmptyState from "../components/EmptyState";
import SkeletonBlock from "../components/SkeletonBlock";
import "./history.css";

const getChemicalBadges = (exp) => {
    const badges = [];
    if (exp.chem_a > 0) badges.push({ chem: 'HCl', color: '#EF4444' });
    if (exp.chem_b > 0) badges.push({ chem: 'NaOH', color: '#6366F1' });
    if (exp.chem_i > 0) badges.push({ chem: 'BTB', color: '#10B981' });
    if (exp.chem_c > 0) badges.push({ chem: 'MnO₂', color: '#F59E0B' });
    return badges;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();

    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    if (isToday) {
        return `Today at ${time}`;
    }
    if (isYesterday) {
        return `Yesterday at ${time}`;
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) + ` at ${time}`;
};


const HistoryRow = React.memo(function HistoryRow({ exp }) { return (
    <tr>
        <td>
            <div className="outcome-cell">
                <span
                    className="outcome-dot"
                    style={{ backgroundColor: exp.color || '#6366F1' }}
                ></span>
                <span className="outcome-label">{exp.outcome_label || 'Mixing Chemicals...'}</span>
            </div>
        </td>
        <td className="date-cell">{formatDate(exp.created_at)}</td>
        <td className="type-cell">
            <span className="type-badge">{exp.experiment_type || 'Lab Experiment'}</span>
        </td>
        <td className="chemicals-cell">
            {getChemicalBadges(exp).map((badge, idx) => (
                <span
                    key={idx}
                    className="chem-badge"
                    style={{ backgroundColor: `${badge.color}20`, borderColor: badge.color }}
                >
                    {badge.chem}
                </span>
            ))}
        </td>
    </tr>
)});


HistoryRow.displayName = 'HistoryRow';
HistoryRow.propTypes = {
    exp: PropTypes.shape({
        id: PropTypes.string,
        color: PropTypes.string,
        outcome_label: PropTypes.string,
        created_at: PropTypes.string,
        experiment_type: PropTypes.string,
        chem_a: PropTypes.number,
        chem_b: PropTypes.number,
        chem_i: PropTypes.number,
        chem_c: PropTypes.number,
    }).isRequired,
};


const History = () => {
    const navigate = useNavigate();
    
    const logs = useHistoryStore(state => state.logs);
    const loading = useHistoryStore(state => state.loading);
    const fetch = useHistoryStore(state => state.fetch);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return (
        <div className="history-page">

            <div className="history-container">
                <h1 className="neon-glow page-title">EXPERIMENT LOGS</h1>

                <main className="glass-panel history-panel" aria-label="Experiment history">
                    {loading ? (
                        <div className="loading-container">
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <SkeletonBlock width="200px" height="20px" />
                                    <div style={{ marginTop: '10px' }}>
                                        <SkeletonBlock width="80px" height="16px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : logs.length === 0 ? (
                        <EmptyState
                            icon="⚗️"
                            title="Your experiment log is empty"
                            description="Complete an experiment in the Lab to see your results here."
                            actionLabel="Go to Lab →"
                            onAction={() => navigate('/student/lab')}
                        />
                    ) : (
                        <div className="table-wrapper">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Outcome</th>
                                        <th>Date & Time</th>
                                        <th>Type</th>
                                        <th>Chemicals</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((exp) => (
                                        <HistoryRow key={exp.id} exp={exp} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default History;

HistoryRow.propTypes = {
    exp: PropTypes.shape({
        id: PropTypes.string,
        color: PropTypes.string,
        outcome_label: PropTypes.string,
        created_at: PropTypes.string,
        experiment_type: PropTypes.string,
        chem_a: PropTypes.number,
        chem_b: PropTypes.number,
        chem_i: PropTypes.number,
        chem_c: PropTypes.number,
    }).isRequired,
};
