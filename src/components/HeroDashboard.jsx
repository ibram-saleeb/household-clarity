import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';
import { Tooltip } from './Tooltip.jsx';

export function HeroDashboard({ data, scenarioMode, savingsTargetMonthly, onSavingsChange }) {
  const { baseline, scenario, deltas } = data;

  const current = scenarioMode && scenario ? scenario : baseline;
  const isSurplus = current.netCashflowMonthly >= 0;
  const isAfterSavingsSurplus = current.netAfterSavingsMonthly >= 0;

  return (
    <section className="hero-dashboard-section">
      <div className={`hero-card ${isSurplus ? 'hero-surplus' : 'hero-deficit'}`}>
        <div className="hero-card-header">
          <div className="hero-title-group">
            <span className="hero-badge">
              {isSurplus ? (
                <>
                  <TrendingUp className="icon-sm" /> Monthly Cashflow Buffer (Surplus)
                </>
              ) : (
                <>
                  <TrendingDown className="icon-sm" /> Monthly Cashflow Deficit
                </>
              )}
            </span>
            {scenarioMode && (
              <span className="scenario-pill-badge">
                <Sparkles className="icon-xs inline-icon" /> What-If Stress Test View
              </span>
            )}
          </div>
        </div>

        <div className="hero-main-row">
          <div className="hero-number-container">
            <h2 className={`hero-hero-number ${isSurplus ? 'text-surplus' : 'text-deficit'}`}>
              {formatMoney(current.netCashflowMonthly, true)}
              <span className="hero-period">/ month</span>
            </h2>
            <p className="hero-number-subtext">
              Take-Home Pay minus Household Expenses{' '}
              <Tooltip text={`Combined Spendable Income (${formatMoney(current.combinedUsableMonthly)}/mo) minus Total Expenses (${formatMoney(current.totalExpensesMonthly)}/mo)`} />
            </p>
          </div>

          {/* Scenario Live Delta Badge */}
          {scenarioMode && deltas && (
            <div className="scenario-delta-box">
              <div className="delta-label">Scenario Impact vs Baseline</div>
              <div className={`delta-value ${deltas.netCashflowMonthly >= 0 ? 'text-surplus' : 'text-deficit'}`}>
                {formatMoney(deltas.netCashflowMonthly, true)} / month
              </div>
              <div className="delta-comparison">
                Baseline: {formatMoney(baseline.netCashflowMonthly)} <ArrowRight className="icon-xs inline-icon" /> Scenario: {formatMoney(scenario.netCashflowMonthly)}
              </div>
            </div>
          )}
        </div>

        {/* Savings & Emergency Reserve Row */}
        <div className="hero-savings-bar">
          <div className="savings-input-group">
            <label className="savings-label">
              <PiggyBank className="icon-sm inline-icon" /> Monthly Savings Allocation:
            </label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="number"
                min="0"
                step="50"
                className="input-field input-sm savings-input"
                value={savingsTargetMonthly}
                onChange={(e) => onSavingsChange(Math.max(0, Number(e.target.value) || 0))}
                placeholder="0"
              />
              <span className="input-suffix">/mo</span>
            </div>
          </div>

          <div className="net-after-savings-result">
            <span className="after-savings-label">Buffer Remaining:</span>
            <span className={`after-savings-value ${isAfterSavingsSurplus ? 'text-surplus' : 'text-deficit'}`}>
              {formatMoney(current.netAfterSavingsMonthly, true)} <span className="text-muted">/mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card">
          <div className="metric-label">
            Take-Home Pay Together{' '}
            <Tooltip text="Combined post-tax & post-Medicare spendable cash for both partners" />
          </div>
          <div className="metric-value text-primary">
            {formatMoney(current.combinedUsableMonthly)} <span className="metric-period">/mo</span>
          </div>
          <div className="metric-subtext">
            {formatMoney(current.combinedUsableAnnual)}/yr combined spendable cash
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            Household Expenses{' '}
            <Tooltip text="Sum of all shared & personal expenses normalized to a monthly figure" />
          </div>
          <div className="metric-value text-warning">
            {formatMoney(current.totalExpensesMonthly)} <span className="metric-period">/mo</span>
          </div>
          <div className="metric-subtext">
            Normalized across all regular outgoings
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <Shield className="icon-xs inline-icon" /> Super Guarantee (Wealth){' '}
            <Tooltip text="Employer Super Guarantee (12%) is protected for retirement and strictly excluded from spendable cashflow" />
          </div>
          <div className="metric-value text-info">
            {formatMoney(current.totalSuperMonthly)} <span className="metric-period">/mo</span>
          </div>
          <div className="metric-subtext">
            {formatMoney(current.totalSuperMonthly * 12)}/yr total employer super
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            Partner Cashflow Split{' '}
            <Tooltip text="Individual take-home pay minus personal expenses and 50% of shared expenses" />
          </div>
          <div className="partner-split-values">
            <span className="split-partner">
              <strong>{current.p1?.name || 'P1'}:</strong> {formatMoney(current.p1NetMonthly, true)}/mo
            </span>
            <span className="split-divider">|</span>
            <span className="split-partner">
              <strong>{current.p2?.name || 'P2'}:</strong> {formatMoney(current.p2NetMonthly, true)}/mo
            </span>
          </div>
          <div className="metric-subtext">
            Net position per partner
          </div>
        </div>
      </div>
    </section>
  );
}
