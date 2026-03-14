import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { supabase } from '../supabaseClient';
import logo from '../assets/logo.png';
import logger from '../utils/logger';
import "./profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalExperiments: 0,
        averageScore: 0,
        totalXP: 0,
        masteryLevel: 1,
        highestScore: 0
    });

    const [badges, setBadges] = useState([
        { id: 'novice', name: 'Novice Chemist', icon: '🧪', description: 'First experiment completed', earned: false },
        { id: 'regular', name: 'Lab Regular', icon: '🥼', description: '5 experiments completed', earned: false },
        { id: 'master', name: 'Master Researcher', icon: '🧬', description: '10 experiments completed', earned: false },
        { id: 'perfect', name: 'Perfectionist', icon: '⭐', description: 'Scored 100 on an experiment', earned: false },
        { id: 'titration', name: 'Titration Expert', icon: '💧', description: '3 Titration experiments', earned: false },
        { id: 'organic', name: 'Organic Specialist', icon: '🌿', description: '3 Organic experiments', earned: false },
    ]);

    useEffect(() => {
        const fetchUserDataAndStats = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUser(user);
                    
                    const { data, error } = await supabase
                        .from('experiment_results')
                        .select('*')
                        .eq('user_id', user.id);

                    if (error) throw error;
                    
                    if (data) {
                        setExperiments(data);
                        calculateStats(data);
                    }
                }
            } catch (error) {
                logger.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataAndStats();
    }, []);

    const calculateStats = (data) => {
        const total = data.length;
        if (total === 0) return;

        let totalScore = 0;
        let highest = -Infinity;
        let titrationCount = 0;
        let organicCount = 0;

        for (const exp of data) {
            const score = exp.score || 0;
            totalScore += score;
            if (score > highest) highest = score;

            const expType = exp.experiment_type?.toLowerCase() || '';
            if (expType.includes('titration')) titrationCount++;
            if (expType.includes('organic')) organicCount++;
        }

        const avg = Math.round(totalScore / total);
        
        // XP is sum of scores. Level increases every 500 XP.
        const xp = totalScore;
        const level = Math.floor(xp / 500) + 1;

        setStats({
            totalExperiments: total,
            averageScore: avg,
            totalXP: xp,
            masteryLevel: level,
            highestScore: highest
        });

        // Check badges using separate if statements
        const updatedBadges = badges.map(badge => {
            let earned = false;
            if (badge.id === 'novice') earned = total >= 1;
            else if (badge.id === 'regular') earned = total >= 5;
            else if (badge.id === 'master') earned = total >= 10;
            else if (badge.id === 'perfect') earned = highest === 100;
            else if (badge.id === 'titration') earned = titrationCount >= 3;
            else if (badge.id === 'organic') earned = organicCount >= 3;
            return { ...badge, earned };
        });
        
        setBadges(updatedBadges);
    };

    if (loading) {
        return (
            <div className="profile-page">
                <Navbar />
                <div className="loading-container">
                    <div className="logo-spinner">
                        <img src={logo} alt="Loading..." style={{ width: '80px' }} />
                    </div>
                    <p className="neon-text blink">DECODING PROFILE...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Navbar />
            
            <div className="profile-container">
                <h1 className="page-title neon-glow">USER PROFILE</h1>
                
                <div className="profile-grid">
                    <aside className="profile-sidebar">
                        <div className="glass-panel user-info">
                            <div className="avatar-container">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <h3>{user?.email?.split('@')[0]}</h3>
                            <p className="user-email">{user?.email}</p>
                            
                            <div className="mastery-level">
                                <span className="level-label">Mastery Rank</span>
                                <span className="level-number">Lvl {stats.masteryLevel}</span>
                                <div className="xp-bar-container" style={{ 
                                    width: '100%', 
                                    height: '8px', 
                                    background: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '4px',
                                    marginTop: '10px',
                                    overflow: 'hidden'
                                }}>
                                    <div className="xp-progress" style={{ 
                                        width: `${(stats.totalXP % 500) / 5}%`, 
                                        height: '100%', 
                                        background: '#00ff88',
                                        boxShadow: '0 0 10px #00ff88'
                                    }}></div>
                                </div>
                                <p style={{ fontSize: '0.7rem', marginTop: '5px', color: '#888' }}>
                                    {stats.totalXP % 500} / 500 XP to next level
                                </p>
                            </div>
                        </div>
                    </aside>

                    <main className="profile-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-value">{stats.totalExperiments}</span>
                                <span className="stat-label">Experiments</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{stats.averageScore}%</span>
                                <span className="stat-label">Avg. Accuracy</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{stats.highestScore}%</span>
                                <span className="stat-label">Best Score</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-value">{stats.totalXP}</span>
                                <span className="stat-label">Total XP</span>
                            </div>
                        </div>

                        <div className="glass-panel badges-section">
                            <h2>ACHIEVEMENTS</h2>
                            <div className="badges-grid">
                                {badges.map(badge => (
                                    <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : ''}`} title={badge.description}>
                                        <div className="badge-icon">{badge.icon}</div>
                                        <span className="badge-name">{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;
