import React, { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "../supabaseClient";
import { Canvas } from '@react-three/fiber';
import "./Lab3D.css";
import useLabStore from "../store/labStore";
import { toast } from "react-hot-toast";
import AiTutorPanel from "../components/AiTutorPanel";
import ResultModal from "../components/ResultModal";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorBoundary from "../components/ErrorBoundary";

const PhysicsLab = lazy(() => import('../components/3d-animations/PhysicsLab'));

const Lab3D = () => {
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [lockedChems, setLockedChems] = useState([]);

    const chemA = useLabStore(state => state.chemA);
    const chemB = useLabStore(state => state.chemB);
    const chemI = useLabStore(state => state.chemI);
    const chemC = useLabStore(state => state.chemC);
    const setChemA = useLabStore(state => state.setChemA);
    const setChemB = useLabStore(state => state.setChemB);
    const setChemI = useLabStore(state => state.setChemI);
    const setChemC = useLabStore(state => state.setChemC);
    const reactionState = useLabStore(state => state.reactionState);
    const reactionResult = useLabStore(state => state.reactionResult);
    const currentHint = useLabStore(state => state.currentHint);
    const setCurrentHint = useLabStore(state => state.setCurrentHint);
    const initiateReaction = useLabStore(state => state.initiateReaction);
    const setReactionState = useLabStore(state => state.setReactionState);
    const reset = useLabStore(state => state.reset);

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
        if (reactionState === 'loading') return;

        if (chemA === 0 && chemB === 0 && chemI === 0 && chemC === 0) {
            setCurrentHint(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const res = await fetch('/api/ai/hint', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                if (data.hint) {
                    setCurrentHint(data.hint);
                }
            } catch (error) {
                console.error("Failed to fetch AI hint:", error);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [chemA, chemB, chemI, chemC, reactionState, setCurrentHint]);

    const handlePlayClick = async () => {
        if (reactionState === 'loading') return;
        
        setCurrentHint(null);
        setIsResultOpen(false);
        
        try {
            const result = await initiateReaction();
            
            if (result) {
                setTimeout(() => {
                    setIsResultOpen(true);
                    toast.dismiss();
                    toast.success("Reaction complete!");
                }, 4000);
            }
        } catch (error) {
            console.error("Reaction failed:", error);
            toast.dismiss();
            
            let userMessage = 'Something went wrong. Please try again.';
            if (error.response?.data?.error) {
                userMessage = error.response.data.error;
            } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network')) {
                userMessage = 'Network error. Please check your connection and try again.';
            }
            
            toast.error(userMessage);
        }
    };

    const handleResetLab = () => {
        reset();
        setIsResultOpen(false);
        toast.success("Lab reset complete.");
    };

    const handleAskAI = () => {
        setIsResultOpen(false);
        setIsAiOpen(true);
        // We could also pre-fill the AI chat here if desired
    };

    function getActiveChemCount() {
        let count = 0;
        if (chemA > 0) count += 1;
        if (chemB > 0) count += 1;
        if (chemI > 0) count += 1;
        if (chemC > 0) count += 1;
        return count;
    }

    const activeCount = getActiveChemCount();
    const isPlayDisabled = activeCount < 2;

    return (
        <div className="lab3d-page">
            <div className="lab3d-header glass-panel">
                <h2 className="neon-glow">3D PHYSICS LABORATORY</h2>
                <p>Drag and pour the chemicals into the beaker using interactive physics!</p>
            </div>

            {/* Dedicated 3D Canvas Area — no OrbitControls to avoid event conflicts */}
            <main className="lab3d-canvas-wrapper" aria-label="3D Chemistry Laboratory">
                {currentHint && reactionState !== 'loading' && (
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
                            style={{ background: '#0A0A1A' }}
                            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
                            gl={{ antialias: true, alpha: false }}
                        >
                            <PhysicsLab
                                setChemA={setChemA}
                                setChemB={setChemB}
                                setChemI={setChemI}
                                setChemC={setChemC}
                                reactionStateIsLoading={reactionState === 'loading'}
                                lockedChems={lockedChems}
                                reactionResult={reactionResult}
                                chemA={chemA}
                                chemB={chemB}
                                chemI={chemI}
                                chemC={chemC}
                            />
                        </Canvas>
                    </Suspense>
                </ErrorBoundary>
            </main>

            {/* Screen reader alternative for 3D scene */}
            <div 
                className="sr-only" 
                aria-live="polite" 
                aria-label="3D Laboratory status"
            >
                {reactionState === 'idle' && 'Chemistry lab ready. Adjust chemical concentrations using the sliders below, then press Initiate Reaction.'}
                {reactionState === 'loading' && 'Reaction in progress. Please wait.'}
                {reactionState === 'success' && reactionResult && `Reaction complete. Result: ${reactionResult.outcome_label}. ${reactionResult.product_formula || ''}`}
                {reactionState === 'error' && 'Reaction failed. Please try again.'}
            </div>

            {/* Keyboard instructions for 3D navigation */}
            <div 
                className="keyboard-instructions" 
                aria-hidden="true"
            >
                <span>Use arrow keys or WASD to rotate view</span>
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
                                disabled={reactionState === 'loading'}
                                style={{ '--chem-thumb-color': '#EF4444' }}
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
                                disabled={reactionState === 'loading'}
                                style={{ '--chem-thumb-color': '#6366F1' }} // Blue for Base
                            />
                        </div>

                        <div className="slider-card indicator">
                            <div className="slider-header">
                                <div className="label-group">
                                    <span className="chem-name">Bromothymol Blue</span>
                                    <span className="chem-formula">BTB</span>
                                </div>
                                <span className="chem-value">{Math.round(chemI)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={chemI} 
                                onChange={(e) => setChemI(Number(e.target.value))}
                                className="chem-slider"
                                disabled={reactionState === 'loading'}
                                style={{ '--chem-thumb-color': '#10B981' }} // Green for Indicator
                            />
                        </div>

                        <div className="slider-card catalyst">
                            <div className="slider-header">
                                <div className="label-group">
                                    <span className="chem-name">Manganese Dioxide</span>
                                    <span className="chem-formula">MnO₂</span>
                                </div>
                                <span className="chem-value">{Math.round(chemC)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={chemC} 
                                onChange={(e) => setChemC(Number(e.target.value))}
                                className="chem-slider"
                                disabled={reactionState === 'loading'}
                                style={{ '--chem-thumb-color': '#F59E0B' }} // Orange for Catalyst
                            />
                        </div>
                    </div>

                    <div className="lab3d-actions">
                        <button
                            className={`action-button ${!isPlayDisabled && reactionState !== 'loading' ? 'active' : ''} ${reactionState === 'loading' ? 'loading' : ''}`}
                            disabled={isPlayDisabled || reactionState === 'loading'}
                            onClick={handlePlayClick}
                            aria-describedby="reaction-status"
                        >
                            {reactionState === 'loading' ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    <span>REACTING...</span>
                                </>
                            ) : "INITIATE REACTION"}
                        </button>
                        {reactionState !== 'loading' && (
                            <div
                                id="reaction-status"
                                className={`reaction-status-badge ${activeCount >= 2 ? 'ready' : 'waiting'}`}
                                aria-live="polite"
                            >
                                {activeCount === 0 && (
                                    <><span className="status-icon">🧪</span> <span>Add chemicals to begin</span></>
                                )}
                                {activeCount === 1 && (
                                    <><span className="status-icon">⚠️</span> <span>Add 1 more chemical to react</span></>
                                )}
                                {activeCount >= 2 && (
                                    <><span className="status-icon">✨</span> <span>Ready to react</span></>
                                )}
                            </div>
                        )}
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
