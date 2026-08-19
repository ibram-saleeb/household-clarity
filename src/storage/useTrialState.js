import { useState, useEffect, useCallback } from 'react';

const TRIAL_STORAGE_KEY = 'tandem_trial_installed_at';
const TRIAL_SIMULATE_KEY = 'tandem_trial_simulated_expired';
export const TRIAL_DURATION_DAYS = 14;

/**
 * Custom React hook to track the 14-day free trial lifecycle.
 */
export function useTrialState() {
  const [installedAt, setInstalledAt] = useState(() => {
    try {
      const stored = localStorage.getItem(TRIAL_STORAGE_KEY);
      if (stored) {
        return Number(stored);
      }
      const now = Date.now();
      localStorage.setItem(TRIAL_STORAGE_KEY, String(now));
      return now;
    } catch {
      return Date.now();
    }
  });

  const [simulatedExpired, setSimulatedExpired] = useState(() => {
    try {
      return localStorage.getItem(TRIAL_SIMULATE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Calculate days remaining
  const calculateDaysRemaining = useCallback(() => {
    if (simulatedExpired) return 0;
    const now = Date.now();
    const elapsedMs = Math.max(0, now - installedAt);
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(TRIAL_DURATION_DAYS - elapsedDays));
  }, [installedAt, simulatedExpired]);

  const [daysRemaining, setDaysRemaining] = useState(calculateDaysRemaining);

  useEffect(() => {
    setDaysRemaining(calculateDaysRemaining());
  }, [installedAt, simulatedExpired, calculateDaysRemaining]);

  const isExpired = simulatedExpired || daysRemaining <= 0;

  // Toggle simulated expired mode for testing/demo
  const toggleSimulateExpired = useCallback((forceState) => {
    setSimulatedExpired((prev) => {
      const next = typeof forceState === 'boolean' ? forceState : !prev;
      try {
        localStorage.setItem(TRIAL_SIMULATE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Reset trial timestamp
  const resetTrial = useCallback(() => {
    const now = Date.now();
    try {
      localStorage.setItem(TRIAL_STORAGE_KEY, String(now));
      localStorage.removeItem(TRIAL_SIMULATE_KEY);
    } catch {
      // Ignore
    }
    setInstalledAt(now);
    setSimulatedExpired(false);
  }, []);

  return {
    installedAt,
    daysRemaining,
    totalDays: TRIAL_DURATION_DAYS,
    isExpired,
    simulatedExpired,
    toggleSimulateExpired,
    resetTrial
  };
}
