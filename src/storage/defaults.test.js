import { describe, it, expect } from 'vitest';
import { DEFAULT_APP_STATE, createNewScenario } from './defaults.js';

describe('defaults module unit tests', () => {
  it('DEFAULT_APP_STATE contains expected dual-partner structure', () => {
    expect(DEFAULT_APP_STATE).toBeDefined();
    expect(Array.isArray(DEFAULT_APP_STATE.partners)).toBe(true);
    expect(DEFAULT_APP_STATE.partners).toHaveLength(2);
    expect(DEFAULT_APP_STATE.partners[0].name).toBe('Alex');
    expect(DEFAULT_APP_STATE.partners[1].name).toBe('Sam');
  });

  it('DEFAULT_APP_STATE contains baseline expenses array', () => {
    expect(Array.isArray(DEFAULT_APP_STATE.expenses)).toBe(true);
    expect(DEFAULT_APP_STATE.expenses.length).toBeGreaterThan(0);
  });

  it('createNewScenario generates a valid scenario payload with defaults', () => {
    const scenario = createNewScenario('custom-1', 'Career Break');
    expect(scenario.id).toBe('custom-1');
    expect(scenario.name).toBe('Career Break');
    expect(scenario.presetKey).toBe('custom');
    expect(scenario.incomeOverrides.p1.salaryPercent).toBe(100);
    expect(scenario.incomeOverrides.p2.salaryPercent).toBe(100);
    expect(scenario.savingsTargetMonthly).toBe(1500);
  });
});
