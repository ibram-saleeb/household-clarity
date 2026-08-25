import { describe, it, expect } from 'vitest';
import { formatMoney, formatPercent } from './formatters.js';

describe('formatters utility unit tests', () => {
  describe('formatMoney', () => {
    it('formats positive numbers as AUD currency without sign', () => {
      expect(formatMoney(1200)).toBe('$1,200');
      expect(formatMoney(50000)).toBe('$50,000');
    });

    it('formats positive numbers with forced sign when forceSign is true', () => {
      expect(formatMoney(1200, true)).toBe('+$1,200');
    });

    it('formats negative numbers with leading minus sign', () => {
      expect(formatMoney(-450)).toBe('-$450');
      expect(formatMoney(-1500, true)).toBe('-$1,500');
    });

    it('handles zero and falsy/invalid inputs gracefully', () => {
      expect(formatMoney(0)).toBe('$0');
      expect(formatMoney(null)).toBe('$0');
      expect(formatMoney(undefined)).toBe('$0');
      expect(formatMoney('invalid')).toBe('$0');
    });

    it('handles string numeric inputs', () => {
      expect(formatMoney('3500')).toBe('$3,500');
      expect(formatMoney('-250')).toBe('-$250');
    });
  });

  describe('formatPercent', () => {
    it('formats rates with default 1 decimal place', () => {
      expect(formatPercent(12)).toBe('12.0%');
      expect(formatPercent(5.5)).toBe('5.5%');
    });

    it('formats rates with specified decimal precision', () => {
      expect(formatPercent(2.345, 2)).toBe('2.35%');
      expect(formatPercent(10, 0)).toBe('10%');
    });

    it('handles falsy or invalid inputs gracefully', () => {
      expect(formatPercent(null)).toBe('0.0%');
      expect(formatPercent('abc')).toBe('0.0%');
    });
  });
});
