/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useEffect } from "react";
import useAuthStore from "../store/authStore";
import useProfileStore from "../store/profileStore";
import SkeletonBlock from "../components/SkeletonBlock";
import "./profile.css";

const BADGE_DEFINITIONS = [
    { id: 'novice', name: 'Novice Chemist', icon: '🧪', description: 'First experiment completed' },
    { id: 'regular', name: 'Lab Regular', icon: '🥼', description: '10 experiments completed' },
    { id: 'master', name: 'Master Researcher', icon: '🧬', description: '25 experiments completed' },
    { id: 'perfect', name: 'Perfectionist', icon: '⭐', description: 'Scored 100 on an experiment' },
    { id: 'titration', name: 'Titration Expert', icon: '💧', description: '5 Titration experiments' },
    { id: 'organic', name: 'Organic Specialist', icon: '🌿', description: '5 Organic experiments' },
];

const Profile = () => {
    const profile = useAuthStore(state => state.profile);
    const stats = useProfileStore(state => state.stats);
    const achievements = useProfileStore(state => state.achievements);
    const loading = useProfileStore(state => state.loading);
    const fetch = useProfileStore(state => state.fetch);

    useEffect(() => {
        fetch();
    }, [fetch]);

    const getFirstName = () => {
        const name = profile?.display_name || profile?.full_name || 'Scientist';
        return name.split(' ')[0] || 'Scientist';
    };

    const getMasteryLevel = () => {
        if (!stats) return 1;
        return Math.floor(stats.total_xp / 500) + 1;
    };

    const getXpProgress = () => {
        if (!stats) return 0;
        return (stats.total_xp % 500) / 5;
    };

    const getBadges = () => {
        return BADGE_DEFINITIONS.map(badge => ({
            ...badge,
            earned: achievements.includes(badge.id)
        }));
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <h1 className="page-title neon-glow">USER PROFILE</h1>
                    
                    <div className="profile-grid">
                        <aside className="profile-sidebar">
                            <div className="glass-panel user-info">
                                <div className="avatar-container">
                                    <SkeletonBlock width="120px" height="120px" borderRadius="50%" />
                                </div>
                                <SkeletonBlock width="60%" height="20px" />
                                <SkeletonBlock width="80%" height="14px" />
                            </div>
                        </aside>

                        <main className="profile-content">
                            <div className="stats-grid">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="stat-card">
                                        <SkeletonBlock width="40px" height="40px" borderRadius="50%" />
                                        <SkeletonBlock width="60px" height="32px" />
                                        <SkeletonBlock width="80px" height="14px" />
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            
            <div className="profile-container">
                <h1 className="page-title neon-glow">USER PROFILE</h1>
                
                <div className="profile-grid">
                    <aside className="profile-sidebar">
                        <div className="glass-panel user-info">
                            <div className="avatar-container">
                                {profile?.email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <h3>{getFirstName()}</h3>
                            <p className="user-email">{profile?.email}</p>
                            
                            <div className="mastery-level">
                                <span className="level-label">Mastery Rank</span>
                                <span className="level-number">Lvl {getMasteryLevel()}</span>
                                <div className="xp-bar-container" style={{ 
                                    width: '100%', 
                                    height: '8px', 
                                    background: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '4px',
                                    marginTop: '10px',
                                    overflow: 'hidden'
                                }}>
                                    <div className="xp-progress" style={{ 
                                        width: `${getXpProgress()}%`, 
                                        height: '100%', 
                                        background: '#6366F1',
                                        boxShadow: '0 0 10px #6366F1'
                                    }}></div>
                                </div>
                                <p style={{ fontSize: '0.7rem', marginTop: '5px', color: '#888' }}>
                                    {stats ? stats.total_xp % 500 : 0} / 500 XP to next level
                                </p>
                            </div>
                        </div>
                    </aside>

                    <main className="profile-content" aria-label="User statistics and achievements">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-icon" aria-hidden="true">🧪</span>
                                <span className="stat-value">{stats?.total_experiments || 0}</span>
                                <span className="stat-label">Experiments</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-icon" aria-hidden="true">🎯</span>
                                <span className="stat-value">{stats?.avg_accuracy || 0}%</span>
                                <span className="stat-label">Avg. Accuracy</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-icon" aria-hidden="true">⭐</span>
                                <span className="stat-value">{stats?.best_score || 0}%</span>
                                <span className="stat-label">Best Score</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-icon" aria-hidden="true">⚡</span>
                                <span className="stat-value">{stats?.total_xp || 0}</span>
                                <span className="stat-label">Total XP</span>
                            </div>
                        </div>

                        <div className="glass-panel badges-section">
                            <h2>ACHIEVEMENTS</h2>
                            <div className="badges-grid">
                                {getBadges().map(badge => (
                                    <div 
                                        key={badge.id} 
                                        className={`badge-item ${badge.earned ? 'earned' : ''}`}
                                        title={badge.description}
                                        role="img"
                                        aria-label={badge.earned ? `${badge.name}: ${badge.description}` : `Locked: ${badge.name}`}
                                    >
                                        <div className="badge-icon" aria-hidden="true">
                                            {badge.earned ? badge.icon : '🔒'}
                                        </div>
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
