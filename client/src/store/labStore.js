/**
 * labStore.js — Zustand store for lab state management
 * Phase 3: Central state for temperature, chemicals, role, assignments, performance
 *
 * Slices:
 *   - Thermochemistry: temperature (°C), deltaH (kJ/mol), thermalState derived
 *   - Performance: postProcessingEnabled, shadowsEnabled, pixelRatioScale
 *   - User Role: role ('student' | 'teacher' | 'admin')
 *   - Assignments: currentAssignments array
 *   - Reaction: current reaction results and active chemicals
 */
import { create } from 'zustand';

/**
 * Derives the thermal state from deltaH.
 * @param {number|null} deltaH - Enthalpy change in kJ/mol
 * @returns {'neutral'|'exothermic'|'endothermic'}
 */
function deriveThermalState(deltaH) {
  if (deltaH === null || deltaH === 0) return 'neutral';
  return deltaH < 0 ? 'exothermic' : 'endothermic';
}

export const useLabStore = create((set, get) => ({
  // ─── Thermochemistry Slice ───────────────────────────────────────────
  temperature: 25,
  deltaH: null,

  /**
   * Set the current temperature in °C.
   * @param {number} val - Temperature value
   */
  setTemperature: (val) => set({ temperature: val }),

  /**
   * Set the enthalpy change (ΔH) from a reaction result.
   * Also updates the thermal state automatically.
   * @param {number|null} val - ΔH in kJ/mol (negative = exothermic, positive = endothermic)
   */
  setDeltaH: (val) => set({ deltaH: val }),

  /**
   * Get the derived thermal state based on current deltaH.
   * @returns {'neutral'|'exothermic'|'endothermic'}
   */
  getThermalState: () => deriveThermalState(get().deltaH),

  /**
   * Apply a temperature change from a reaction over time.
   * Calculates target temp from deltaH and updates temperature.
   * @param {number} deltaH - Enthalpy change in kJ/mol
   */
  applyReactionHeat: (deltaH) => {
    const currentTemp = get().temperature;
    // Temperature change = |deltaH| / 10, direction based on sign
    const tempChange = deltaH < 0
      ? Math.abs(deltaH) / 10   // Exothermic: temperature rises
      : -(deltaH / 10);          // Endothermic: temperature drops
    const targetTemp = Math.max(-50, Math.min(200, currentTemp + tempChange));
    set({ deltaH, temperature: targetTemp });
  },

  // ─── Performance Slice ───────────────────────────────────────────────
  postProcessingEnabled: true,
  shadowsEnabled: true,
  pixelRatioScale: null, // null = use device default

  /**
   * Toggle post-processing effects (Bloom, EffectComposer).
   * @param {boolean} val
   */
  setPostProcessingEnabled: (val) => set({ postProcessingEnabled: val }),

  /**
   * Toggle shadow rendering.
   * @param {boolean} val
   */
  setShadowsEnabled: (val) => set({ shadowsEnabled: val }),

  /**
   * Set the pixel ratio scale (1.0 = downscale, null = device default).
   * @param {number|null} val
   */
  setPixelRatioScale: (val) => set({ pixelRatioScale: val }),

  /**
   * Enter low-performance mode: disable effects and lower quality.
   */
  enterLowPerformanceMode: () => set({
    postProcessingEnabled: false,
    shadowsEnabled: false,
    pixelRatioScale: 1.0,
  }),

  /**
   * Exit low-performance mode: re-enable effects and quality.
   */
  exitLowPerformanceMode: () => set({
    postProcessingEnabled: true,
    shadowsEnabled: true,
    pixelRatioScale: null,
  }),

  // ─── User Role Slice ─────────────────────────────────────────────────
  role: 'student', // 'student' | 'teacher' | 'admin'

  /**
   * Set the current user role.
   * @param {'student'|'teacher'|'admin'} val
   */
  setRole: (val) => set({ role: val }),

  // ─── Assignments Slice ────────────────────────────────────────────────
  currentAssignments: [],

  /**
   * Set the list of current assignments for the logged-in student.
   * @param {Array} assignments
   */
  setCurrentAssignments: (assignments) => set({ currentAssignments: assignments }),

  /**
   * Check if the student has any overdue pending assignments.
   * @returns {boolean}
   */
  hasOverdueAssignments: () => {
    const assignments = get().currentAssignments;
    const now = new Date();
    return assignments.some(
      (a) => a.status === 'Pending' && new Date(a.due_date) < now
    );
  },

  // ─── Reaction State Slice ─────────────────────────────────────────────
  activeChemicals: { reactantA: null, reactantB: null },
  lastReactionResult: null,
  chemA: 0,
  chemB: 0,
  chemC: 0,
  chemD: 0,

  /**
   * Set active chemicals for the current experiment.
   * @param {string|null} reactantA
   * @param {string|null} reactantB
   */
  setActiveChemicals: (reactantA, reactantB) =>
    set({ activeChemicals: { reactantA, reactantB } }),

  /**
   * Set concentration of Chemical A.
   * @param {number|function} val
   */
  setChemA: (val) => set((state) => ({ 
    chemA: typeof val === 'function' ? val(state.chemA) : val 
  })),

  /**
   * Set concentration of Chemical B.
   * @param {number|function} val
   */
  setChemB: (val) => set((state) => ({ 
    chemB: typeof val === 'function' ? val(state.chemB) : val 
  })),

  /**
   * Set concentration of Chemical C.
   * @param {number|function} val
   */
  setChemC: (val) => set((state) => ({ 
    chemC: typeof val === 'function' ? val(state.chemC) : val 
  })),

  /**
   * Set concentration of Chemical D.
   * @param {number|function} val
   */
  setChemD: (val) => set((state) => ({ 
    chemD: typeof val === 'function' ? val(state.chemD) : val 
  })),

  /**
   * Store the last reaction result from the API.
   * @param {object|null} result
   */
  setLastReactionResult: (result) => set({ lastReactionResult: result }),

  // ─── Reset ────────────────────────────────────────────────────────────
  /**
   * Reset all lab state to defaults (for starting a new experiment).
   */
  resetLab: () => set({
    temperature: 25,
    deltaH: null,
    activeChemicals: { reactantA: null, reactantB: null },
    lastReactionResult: null,
    chemA: 0,
    chemB: 0,
    chemC: 0,
    chemD: 0,
    currentHint: null,
  }),

  // ─── AI History Slice ─────────────────────────────────────────────────
  chatHistory: [],
  currentHint: null,

  /**
   * Add a message to the chat history.
   * @param {'student'|'tutor'} role
   * @param {string} message
   */
  addChatMessage: (role, message) => set((state) => ({
    chatHistory: [...state.chatHistory, { role, message }]
  })),

  /**
   * Clear the chat history.
   */
  clearChatHistory: () => set({ chatHistory: [] }),

  /**
   * Set the current AI-generated hint.
   * @param {string|null} hint
   */
  setCurrentHint: (hint) => set({ currentHint: hint }),
}));


// Export the deriveThermalState utility for direct use
export { deriveThermalState };

export default useLabStore;
