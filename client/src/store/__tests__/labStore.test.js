/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/**
 * labStore.test.js — Unit tests for Zustand lab store
 * Phase 3 Task [3]: Verify all store slices work correctly
 *
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useLabStore, deriveThermalState } from '../labStore';

describe('labStore', () => {
  // Reset store to defaults before each test
  beforeEach(() => {
    useLabStore.setState({
      temperature: 25,
      deltaH: null,
      postProcessingEnabled: true,
      shadowsEnabled: true,
      pixelRatioScale: null,
      role: 'student',
      currentAssignments: [],
      chemA: 0,
      chemB: 0,
      chemI: 0,
      chemC: 0,
      reactionResult: null,
    });
  });

  describe('Thermochemistry slice', () => {
    it('has default temperature of 25°C', () => {
      expect(useLabStore.getState().temperature).toBe(25);
    });

    it('has default deltaH of null', () => {
      expect(useLabStore.getState().deltaH).toBeNull();
    });

    it('setTemperature updates temperature', () => {
      useLabStore.getState().setTemperature(100);
      expect(useLabStore.getState().temperature).toBe(100);
    });

    it('setDeltaH updates deltaH', () => {
      useLabStore.getState().setDeltaH(-57.1);
      expect(useLabStore.getState().deltaH).toBe(-57.1);
    });

    it('getThermalState returns exothermic for negative deltaH', () => {
      useLabStore.getState().setDeltaH(-100);
      expect(useLabStore.getState().getThermalState()).toBe('exothermic');
    });

    it('getThermalState returns endothermic for positive deltaH', () => {
      useLabStore.getState().setDeltaH(50);
      expect(useLabStore.getState().getThermalState()).toBe('endothermic');
    });

    it('getThermalState returns neutral for null deltaH', () => {
      expect(useLabStore.getState().getThermalState()).toBe('neutral');
    });

    it('getThermalState returns neutral for zero deltaH', () => {
      useLabStore.getState().setDeltaH(0);
      expect(useLabStore.getState().getThermalState()).toBe('neutral');
    });

    it('applyReactionHeat raises temp for exothermic (negative deltaH)', () => {
      useLabStore.getState().applyReactionHeat(-100);
      const state = useLabStore.getState();
      expect(state.temperature).toBe(35); // 25 + |(-100)| / 10 = 25 + 10 = 35
      expect(state.deltaH).toBe(-100);
    });

    it('applyReactionHeat lowers temp for endothermic (positive deltaH)', () => {
      useLabStore.getState().applyReactionHeat(60);
      const state = useLabStore.getState();
      expect(state.temperature).toBe(19); // 25 - 60/10 = 25 - 6 = 19
      expect(state.deltaH).toBe(60);
    });

    it('applyReactionHeat clamps temperature to min -50', () => {
      useLabStore.getState().setTemperature(-40);
      useLabStore.getState().applyReactionHeat(200); // Would drop to -40 - 20 = -60, clamped to -50
      expect(useLabStore.getState().temperature).toBe(-50);
    });

    it('applyReactionHeat clamps temperature to max 200', () => {
      useLabStore.getState().setTemperature(195);
      useLabStore.getState().applyReactionHeat(-100); // Would rise to 195 + 10 = 205, clamped to 200
      expect(useLabStore.getState().temperature).toBe(200);
    });
  });

  describe('Performance slice', () => {
    it('has default postProcessingEnabled true', () => {
      expect(useLabStore.getState().postProcessingEnabled).toBe(true);
    });

    it('setPostProcessingEnabled toggles post-processing', () => {
      useLabStore.getState().setPostProcessingEnabled(false);
      expect(useLabStore.getState().postProcessingEnabled).toBe(false);
    });

    it('enterLowPerformanceMode disables all effects', () => {
      useLabStore.getState().enterLowPerformanceMode();
      const state = useLabStore.getState();
      expect(state.postProcessingEnabled).toBe(false);
      expect(state.shadowsEnabled).toBe(false);
      expect(state.pixelRatioScale).toBe(1.0);
    });

    it('exitLowPerformanceMode re-enables all effects', () => {
      useLabStore.getState().enterLowPerformanceMode();
      useLabStore.getState().exitLowPerformanceMode();
      const state = useLabStore.getState();
      expect(state.postProcessingEnabled).toBe(true);
      expect(state.shadowsEnabled).toBe(true);
      expect(state.pixelRatioScale).toBeNull();
    });
  });

  describe('Role slice', () => {
    it('has default role of student', () => {
      expect(useLabStore.getState().role).toBe('student');
    });

    it('setRole changes the role', () => {
      useLabStore.getState().setRole('teacher');
      expect(useLabStore.getState().role).toBe('teacher');
    });
  });

  describe('Assignments slice', () => {
    it('has empty currentAssignments by default', () => {
      expect(useLabStore.getState().currentAssignments).toEqual([]);
    });

    it('setCurrentAssignments updates the list', () => {
      const assignments = [
        { id: '1', status: 'Pending', due_date: '2026-12-01' },
        { id: '2', status: 'Completed', due_date: '2026-01-01' },
      ];
      useLabStore.getState().setCurrentAssignments(assignments);
      expect(useLabStore.getState().currentAssignments).toHaveLength(2);
    });

    it('hasOverdueAssignments returns true when overdue pending assignments exist', () => {
      useLabStore.getState().setCurrentAssignments([
        { id: '1', status: 'Pending', due_date: '2020-01-01' }, // past date = overdue
      ]);
      expect(useLabStore.getState().hasOverdueAssignments()).toBe(true);
    });

    it('hasOverdueAssignments returns false when no overdue assignments', () => {
      useLabStore.getState().setCurrentAssignments([
        { id: '1', status: 'Pending', due_date: '2099-12-31' }, // future date
      ]);
      expect(useLabStore.getState().hasOverdueAssignments()).toBe(false);
    });

    it('hasOverdueAssignments returns false for completed assignments', () => {
      useLabStore.getState().setCurrentAssignments([
        { id: '1', status: 'Completed', due_date: '2020-01-01' }, // completed, even though past date
      ]);
      expect(useLabStore.getState().hasOverdueAssignments()).toBe(false);
    });
  });

  describe('Reaction slice', () => {
    it('setActiveChemicals updates chemicals', () => {
      useLabStore.getState().setChemA(10);
      useLabStore.getState().setChemB(20);
      expect(useLabStore.getState().chemA).toBe(10);
      expect(useLabStore.getState().chemB).toBe(20);
    });

    it('setReactionResult updates reactionResult', () => {
      const result = { success: true };
      useLabStore.getState().setReactionResult(result);
      expect(useLabStore.getState().reactionResult).toBe(result);
    });
  });

  describe('resetLab', () => {
    it('resets lab-specific state but keeps core properties', () => {
      useLabStore.getState().setTemperature(100);
      useLabStore.getState().setDeltaH(50);
      useLabStore.getState().setChemA(5);
      useLabStore.getState().setReactionResult({ success: true });

      useLabStore.getState().reset();

      const state = useLabStore.getState();
      expect(state.temperature).toBe(25);
      expect(state.deltaH).toBeNull();
      expect(state.chemA).toBe(0);
      expect(state.reactionResult).toBeNull();
    });

    it('does NOT reset role or assignments on reset', () => {
      useLabStore.getState().setRole('teacher');
      useLabStore.getState().setCurrentAssignments([{ id: '1' }]);

      useLabStore.getState().reset();

      expect(useLabStore.getState().role).toBe('teacher');
      expect(useLabStore.getState().currentAssignments).toHaveLength(1);
    });
  });

  describe('deriveThermalState utility', () => {
    it('returns neutral for null', () => {
      expect(deriveThermalState(null)).toBe('neutral');
    });

    it('returns neutral for 0', () => {
      expect(deriveThermalState(0)).toBe('neutral');
    });

    it('returns exothermic for negative values', () => {
      expect(deriveThermalState(-57.1)).toBe('exothermic');
    });

    it('returns endothermic for positive values', () => {
      expect(deriveThermalState(41.2)).toBe('endothermic');
    });
  });
});
