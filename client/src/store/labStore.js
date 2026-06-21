/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/**
 * labStore.js — Zustand store for lab state management
 * Phase 3: Central state for temperature, chemicals, role, assignments, performance
 *
 * Slices:
 *   - Thermochemistry: temperature (°C), deltaH (kJ/mol), thermalState derived
 *   - Performance: postProcessingEnabled, shadowsEnabled, pixelRatioScale
 *   - User Role: role ('student' | 'teacher' | 'admin')
 *   - Assignments: currentAssignments array
 *   - Reaction: reactionState, initiateReaction, chemicals
 */
import { create } from 'zustand';
import { supabase } from '../supabaseClient';
import apiClient from '../utils/apiClient';

function deriveThermalState(deltaH) {
  if (deltaH === null || deltaH === 0) return 'neutral';
  return deltaH < 0 ? 'exothermic' : 'endothermic';
}

export const useLabStore = create((set, get) => ({
  temperature: 25,
  deltaH: null,

  setTemperature: (val) => set({ temperature: val }),
  setDeltaH: (val) => set({ deltaH: val }),
  getThermalState: () => deriveThermalState(get().deltaH),

  applyReactionHeat: (deltaH) => {
    const currentTemp = get().temperature;
    const tempChange = deltaH < 0
      ? Math.abs(deltaH) / 10
      : -(deltaH / 10);
    const targetTemp = Math.max(-50, Math.min(200, currentTemp + tempChange));
    set({ deltaH, temperature: targetTemp });
  },

  postProcessingEnabled: true,
  shadowsEnabled: true,
  pixelRatioScale: null,

  setPostProcessingEnabled: (val) => set({ postProcessingEnabled: val }),
  setShadowsEnabled: (val) => set({ shadowsEnabled: val }),
  setPixelRatioScale: (val) => set({ pixelRatioScale: val }),

  enterLowPerformanceMode: () => set({
    postProcessingEnabled: false,
    shadowsEnabled: false,
    pixelRatioScale: 1.0,
  }),

  exitLowPerformanceMode: () => set({
    postProcessingEnabled: true,
    shadowsEnabled: true,
    pixelRatioScale: null,
  }),

  role: 'student',
  setRole: (val) => set({ role: val }),

  currentAssignments: [],
  setCurrentAssignments: (assignments) => set({ currentAssignments: assignments }),

  hasOverdueAssignments: () => {
    const assignments = get().currentAssignments;
    const now = new Date();
    return assignments.some(
      (a) => a.status === 'Pending' && new Date(a.due_date) < now
    );
  },

  chemA: 0,
  chemB: 0,
  chemI: 0,
  chemC: 0,

  reactionState: 'idle',
  reactionResult: null,
  reactionError: null,

  setChemA: (val) => set((state) => ({ chemA: typeof val === 'function' ? val(state.chemA) : val })),
  setChemB: (val) => set((state) => ({ chemB: typeof val === 'function' ? val(state.chemB) : val })),
  setChemI: (val) => set((state) => ({ chemI: typeof val === 'function' ? val(state.chemI) : val })),
  setChemC: (val) => set((state) => ({ chemC: typeof val === 'function' ? val(state.chemC) : val })),

  setReactionResult: (result) => set({ reactionResult: result }),
  setReactionState: (reactionState) => set({ reactionState }),

  initiateReaction: async () => {
    const { chemA, chemB, chemI, chemC } = get();
    const total = chemA + chemB + chemI + chemC;
    if (total === 0) return;

    set({ reactionState: 'loading', reactionError: null });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const payload = {
        chem_a: Math.round(chemA),
        chem_b: Math.round(chemB),
        chem_i: Math.round(chemI),
        chem_c: Math.round(chemC),
        student_id: user?.id || null,
        experiment_type: 'inorganic'
      };

      const res = await apiClient.post('/results', payload);
      
      set({ reactionResult: res.data, reactionState: 'success' });

      if (user?.id) {
        // Idempotency check: prevent duplicate logs within 5 seconds for the same reaction
        const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
        const { data: recentLog } = await supabase
          .from('experiment_logs')
          .select('id')
          .eq('student_id', user.id)
          .eq('reaction_id', res.data.reaction_id)
          .gte('ran_at', fiveSecondsAgo)
          .maybeSingle();

        if (!recentLog) {
          await supabase.from('experiment_logs').insert({
            student_id: user.id,
            chem_a: payload.chem_a,
            chem_b: payload.chem_b,
            chem_i: payload.chem_i,
            chem_c: payload.chem_c,
            reaction_id: res.data.reaction_id,
            outcome_label: res.data.outcome_label,
            score: 75 + Math.floor(Math.random() * 26),
            ran_at: new Date().toISOString()
          });
        }

        // Dynamically import dependent stores to avoid circular dependencies
        try {
          const { default: historyStore } = await import('./historyStore');
          historyStore.getState().refresh();
        } catch (_) { /* store not available */ }
        try {
          const { default: profileStore } = await import('./profileStore');
          profileStore.getState().refresh();
        } catch (_) { /* store not available */ }
      }

      return res.data;
    } catch (err) {
      set({ reactionState: 'error', reactionError: err.message });
      throw err;
    }
  },

  chatHistory: [],
  currentHint: null,

  addChatMessage: (role, message) => set((state) => ({
    chatHistory: [...state.chatHistory, { role, message }]
  })),
  clearChatHistory: () => set({ chatHistory: [] }),
  setCurrentHint: (hint) => set({ currentHint: hint }),

  reset: () => set({
    temperature: 25,
    deltaH: null,
    chemA: 0,
    chemB: 0,
    chemI: 0,
    chemC: 0,
    reactionState: 'idle',
    reactionResult: null,
    reactionError: null,
    currentHint: null,
    chatHistory: [],
  }),
}));

export { deriveThermalState };

export default useLabStore;
