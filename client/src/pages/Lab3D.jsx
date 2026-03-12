import React, { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { Canvas } from '@react-three/fiber';
import "./Lab3D.css";
import useLabStore from "../store/labStore";
import axios from "axios";
import { toast } from "react-hot-toast";
import AiTutorPanel from "../components/AiTutorPanel";
import ResultModal from "../components/ResultModal";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorBoundary from "../components/ErrorBoundary";

const PhysicsLab = lazy(() => import('../components/3d-animations/PhysicsLab'));

const Lab3D = () => {
    const navigate = useNavigate();
    const { 
        chemA, setChemA, 
        chemB, setChemB, 
        chemC, setChemC, 
        chemD, setChemD,
        setLastReactionResult,
        currentHint, setCurrentHint
    } = useLabStore();
    const [isReacting, setIsReacting] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [reactionResult, setReactionResult] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [lockedChems, setLockedChems] = useState([]);

    // Fetch Classroom Restrictions
    useEffect(() => {
        const fetchRestrictions = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Get classrooms student is in
                const { data: classes } = await supabase
                    .from('classroom_students')
                    .select('classroom_id');
                
                if (!classes || classes.length === 0) return;

                // Get locked chemicals from those classrooms
                const { data: classroomData } = await supabase
                    .from('classrooms')
                    .select('locked_chemicals')
                    .in('id', classes.map(c => c.classroom_id));

                if (classroomData) {
                    const allLocked = classroomData.reduce((acc, curr) => {
                        return [...acc, ...(curr.locked_chemicals || [])];
                    }, []);
                    setLockedChems([...new Set(allLocked)]); // Unique set
                }
            } catch (error) {
                console.error("Error fetching classroom restrictions:", error);
            }
        };

        fetchRestrictions();
    }, []);

    // Presence Tracking
    useEffect(() => {
        const updatePresence = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('classroom_students')
                .update({ last_active_at: new Date().toISOString() })
                .eq('student_id', user.id);
        };

        updatePresence();
        const interval = setInterval(updatePresence, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    // Initial Load Simulation (e.g. while Supabase initialises)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoading(false);
            toast.success("Welcome to the Laboratory!", { icon: '🧪' });
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // AI Hint Debounce Logic
    useEffect(() => {
        // Don't fetch hints while a reaction is in progress
        if (isReacting) return;

        // If no chemicals are selected, clear hint
        if (chemA === 0 && chemB === 0 && chemC === 0 && chemD === 0) {
            setCurrentHint(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await axios.get('/api/ai/hint', {
                    params: {
                        chem_a: Math.round(chemA),
                        chem_b: Math.round(chemB),
                        chem_c: Math.round(chemC),
                        chem_d: Math.round(chemD)
                    }
                });
                setCurrentHint(res.data.hint);
            } catch (error) {
                console.error("Failed to fetch AI hint:", error);
            }
        }, 800); // 800ms debounce to be safe with rate limits

        return () => clearTimeout(timer);
    }, [chemA, chemB, chemC, chemD, isReacting, setCurrentHint]);

    const handlePlayClick = async () => {
        setIsReacting(true);
        setCurrentHint(null); // Clear hint when reaction starts
        setIsResultOpen(false);
        setReactionResult(null);
        
        try {
            // Get current user from Supabase
            const { data: { user } } = await supabase.auth.getUser();

            const payload = {
                chem_a: Math.round(chemA),
                chem_b: Math.round(chemB),
                chem_c: Math.round(chemC),
                chem_d: Math.round(chemD),
                student_id: user?.id || null,
                experiment_type: 'inorganic'
            };

            // Initiate reaction API call
            const res = await axios.post('/api/results', payload);
            
            if (res.status === 200) {
                // Store result in Zustand for global access
                setLastReactionResult(res.data);
                setReactionResult(res.data);
                
                // Allow user to watch the 3D reaction (bubbles/smoke) for a few seconds
                setTimeout(() => {
                    setIsResultOpen(true);
                    setIsReacting(false);
                    toast.success("Reaction complete!");
                }, 4000); // Wait for 3D animations to finish
            }
        } catch (error) {
            console.error("Reaction failed:", error);
            toast.error(error.response?.data?.error || 'Reaction failed. Please try again.');
            setIsReacting(false);
        }
    };

    const handleResetLab = () => {
        useLabStore.getState().resetLab();
        setIsResultOpen(false);
        setReactionResult(null);
        toast.success("Lab reset complete.");
    };

    const handleAskAI = () => {
        setIsResultOpen(false);
        setIsAiOpen(true);
        // We could also pre-fill the AI chat here if desired
    };

    function onOrNot() {
        let sum = 0;
        if (chemA > 0) sum += 1;
        if (chemB > 0) sum += 1;
        if (chemC > 0) sum += 1;
        if (chemD > 0) sum += 1;
        return sum >= 2;
    }


    const isPlayDisabled = !(onOrNot());

    return (
        <div className="lab3d-page">
            <div className="lab3d-header glass-panel">
                <h2 className="neon-glow">3D PHYSICS LABORATORY</h2>
                <p>Drag and pour the chemicals into the beaker using interactive physics!</p>
            </div>

            {/* Dedicated 3D Canvas Area — no OrbitControls to avoid event conflicts */}
            <div className="lab3d-canvas-wrapper">
                {currentHint && !isReacting && (
                    <div className="ai-hint-tooltip">
                        <span className="hint-icon">💡</span>
                        <span className="hint-text">{currentHint}</span>
                    </div>
                )}

                <ErrorBoundary>
                    <Suspense fallback={
                        <div className="canvas-loader">
                            <div className="loader-spinner"></div>
                            <p>Loading 3D Environment...</p>
                        </div>
                    }>
                        <Canvas
                            camera={{ position: [0, 2, 12], fov: 45 }}
                            style={{ background: 'transparent' }}
                            gl={{ antialias: true, alpha: true }}
                        >
                            <PhysicsLab
                                setChemA={setChemA}
                                setChemB={setChemB}
                                setChemC={setChemC}
                                setChemD={setChemD}
                                isReacting={isReacting}
                                lockedChems={lockedChems}
                            />
                        </Canvas>
                    </Suspense>
                </ErrorBoundary>
            </div>

            {isInitialLoading && <LoadingOverlay message="Initialising Alchemistry Lab..." />}

            {/* Chemical Level Indicators / Sliders */}
            <div className="lab3d-controls-container">
                <div className="glass-panel chem-levels-panel">
                    <h3>Experiment Controls</h3>
                    
                    <div className="slider-grid">
                        <div className="slider-card acid">
                            <div className="slider-header">
                                <div className="label-group">
                                    <span className="chem-name">Hydrochloric Acid</span>
                                    <span className="chem-formula">HCl</span>
                                </div>
                                <span className="chem-value">{Math.round(chemA)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={chemA} 
                                onChange={(e) => setChemA(Number(e.target.value))}
                                className="chem-slider"
                                disabled={isReacting}
                                style={{ '--chem-thumb-color': '#EF4444' }} // Red for Acid
                            />
                        </div>

                        <div className="slider-card base">
                            <div className="slider-header">
                                <div className="label-group">
                                    <span className="chem-name">Sodium Hydroxide</span>
                                    <span className="chem-formula">NaOH</span>
                                </div>
                                <span className="chem-value">{Math.round(chemB)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={chemB} 
                                onChange={(e) => setChemB(Number(e.target.value))}
                                className="chem-slider"
                                disabled={isReacting}
                                style={{ '--chem-thumb-color': '#6366F1' }} // Blue for Base
                            />
                        </div>

                        <div className="slider-card indicator">
                            <div className="slider-header">
                                <div className="label-group">
                                    <span className="chem-name">Phenolphthalein</span>
                                    <span className="chem-formula">C₂₀H₁₄O₄</span>
                                </div>
                                <span className="chem-value">{Math.round(chemC)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={chemC} 
                                onChange={(e) => setChemC(Number(e.target.value))}
                                className="chem-slider"
                                disabled={isReacting}
                                style={{ '--chem-thumb-color': '#10B981' }} // Green for Indicator
                            />
                        </div>

                        <div className="slider-card catalyst">
                            <div className="slider-header">
                                <div className="label-group">
                                    <span className="chem-name">Iron(III) Chloride</span>
                                    <span className="chem-formula">FeCl₃</span>
                                </div>
                                <span className="chem-value">{Math.round(chemD)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={chemD} 
                                onChange={(e) => setChemD(Number(e.target.value))}
                                className="chem-slider"
                                disabled={isReacting}
                                style={{ '--chem-thumb-color': '#F59E0B' }} // Orange for Catalyst
                            />
                        </div>
                    </div>

                    <div className="lab3d-actions">
                        <button
                            className={`action-button ${!isPlayDisabled && !isReacting ? 'active' : ''} ${isReacting ? 'loading' : ''}`}
                            disabled={isPlayDisabled || isReacting}
                            onClick={handlePlayClick}
                        >
                            {isReacting ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    <span>REACTING...</span>
                                </>
                            ) : "INITIATE REACTION"}
                        </button>
                        {!onOrNot() && <p className="note-warn">Mix at least 2 chemicals to start</p>}
                    </div>
                </div>
            </div>

            {/* AI Tutor Integration */}
            <button 
                className="ai-toggle-button"
                onClick={() => setIsAiOpen(true)}
                title="Ask AI Tutor"
            >
                🤖
            </button>

            <AiTutorPanel 
                isOpen={isAiOpen} 
                onClose={() => setIsAiOpen(false)} 
            />

            <ResultModal 
                isOpen={isResultOpen}
                result={reactionResult}
                onClose={() => setIsResultOpen(false)}
                onReset={handleResetLab}
                onAskAI={handleAskAI}
            />
        </div>
    );
};


export default Lab3D;
