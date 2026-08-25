import { describe, it, expect } from 'vitest';
import { parseStateFromJson } from './exporter.js';

describe('exporter utility unit tests', () => {
  describe('parseStateFromJson', () => {
    it('successfully parses a valid backup JSON structure wrapped in state object', () => {
      const validBackup = JSON.stringify({
        version: '1.2.0',
        appName: 'Project Tandem',
        state: {
          partners: [{ id: 'p1', name: 'Alex' }, { id: 'p2', name: 'Sam' }],
          expenses: [{ id: 'x1', label: 'Rent', amount: 3000 }]
        }
      });

      const res = parseStateFromJson(validBackup);
      expect(res.success).toBe(true);
      expect(res.state.partners).toHaveLength(2);
      expect(res.state.expenses).toHaveLength(1);
    });

    it('successfully parses a raw state JSON object directly', () => {
      const rawState = JSON.stringify({
        partners: [{ id: 'p1' }],
        expenses: []
      });

      const res = parseStateFromJson(rawState);
      expect(res.success).toBe(true);
      expect(res.state.partners).toHaveLength(1);
    });

    it('rejects invalid state missing partners or expenses arrays', () => {
      const missingExpenses = JSON.stringify({
        partners: [{ id: 'p1' }]
      });

      const res = parseStateFromJson(missingExpenses);
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Invalid backup file structure/i);
    });

    it('returns error result for corrupted or malformed JSON text', () => {
      const corruptedJson = '{ invalid json content...';
      const res = parseStateFromJson(corruptedJson);
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/JSON Parse Error/i);
    });
  });
});
