/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "react-hot-toast";

import "./dashboard.css";

const Dashboard = () => {
    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinClassroom = async (e) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please log in first");

            // Find classroom by code
            const { data: className, error: classError } = await supabase
                .from('classrooms')
                .select('id, class_name')
                .eq('class_code', joinCode.toUpperCase())
                .single();

            if (classError || !className) throw new Error("Invalid class code");

            // Check if already in classroom
            const { data: existing } = await supabase
                .from('class_memberships')
                .select('*')
                .eq('classroom_id', className.id)
                .eq('student_id', user.id)
                .single();

            if (existing) {
                toast("You are already in this classroom");
                setJoinCode("");
                return;
            }

            // Join classroom
            const { error: joinError } = await supabase
                .from('class_memberships')
                .insert([
                    { classroom_id: className.id, student_id: user.id }
                ]);

            if (joinError) throw joinError;

            toast.success(`Joined ${className.class_name}!`);
            setJoinCode("");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="dashboard-page scene_element scene_element--fadein">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="neon-glow">Dashboard</h1>
                    <p className="subtitle">Select a module to begin experimentation</p>
                </div>

                <main className="module-grid" aria-label="Experiment modules">
                    {/* Experiment Module */}
                    <Link to="/lab" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-flask"></i>
                        </div>
                        <h3>LABORATORY</h3>
                        <p>Conduct virtual chemical reactions.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* Titration Module */}
                    <Link to="/titration" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-flask-vial"></i>
                        </div>
                        <h3>TITRATION</h3>
                        <p>Precise volumetric analysis.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* Organic Module */}
                    <Link to="/organic" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-dna"></i>
                        </div>
                        <h3>ORGANIC</h3>
                        <p>Explore carbon-based chemistry.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* Inorganic Module */}
                    <Link to="/inorganic" className="module-card glass-panel">
                        <div className="icon-container">
                            <i className="fa-solid fa-atom"></i>
                        </div>
                        <h3>INORGANIC</h3>
                        <p>Study elements and compounds.</p>
                        <div className="card-glow"></div>
                    </Link>

                    {/* Join Classroom Module */}
                    <div className="module-card glass-panel classroom-card">
                        <div className="icon-container">
                            <i className="fa-solid fa-users-rectangle"></i>
                        </div>
                        <h3>CLASSROOM</h3>
                        <p>Join your teacher&apos;s session.</p>
                        
                        <form onSubmit={handleJoinClassroom} className="join-form">
                            <label htmlFor="join-code" className="sr-only">Classroom join code</label>
                            <input 
                                id="join-code"
                                type="text"
                                placeholder="Enter Code"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                maxLength={6}
                                disabled={loading}
                                aria-label="Enter 6-character classroom join code"
                            />
                            <button type="submit" disabled={loading || joinCode.length < 6}>
                                {loading ? '...' : 'JOIN'}
                            </button>
                        </form>
                        <div className="card-glow"></div>
                    </div>

                </main>
            </div>
        </div>
    );
};



export default Dashboard;
