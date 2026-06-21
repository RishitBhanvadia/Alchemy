/* eslint-disable react/prop-types */
/* eslint-disable no-console */
/**
 * useTemperature.js — Global temperature state hook
 * Phase 3.3.1: Exposes temperature, setTemperature, thermalState
 */
import { useLabStore } from '../store/labStore';

/**
 * Hook for temperature state management.
 * @returns {object} { temperature, setTemperature, thermalState }
 */
export default function useTemperature() {
  const temperature = useLabStore((state) => state.temperature);
  const setTemperature = useLabStore((state) => state.setTemperature);
  const deltaH = useLabStore((state) => state.deltaH);

  // Derive thermal state from deltaH
  let thermalState = 'neutral';
  if (deltaH !== null && deltaH < 0) thermalState = 'exothermic';
  if (deltaH !== null && deltaH > 0) thermalState = 'endothermic';

  return {
    temperature,
    setTemperature,
    thermalState,
  };
}
