import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Shield, ArrowRight, Sparkles } from 'lucide-react';

export function formatMoney(amount, forceSign = false) {
  const val = Number(amount) || 0;
  const absFormatted = Math.abs(val).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (val < 0) {
    return `-${absFormatted}`;
  }
  if (val > 0 && forceSign) {
    return `+${absFormatted}`;
  }
  return absFormatted;
}

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
                  <TrendingUp className="icon-sm" /> Real Monthly Household Surplus
                </>
              ) : (
                <>
                  <TrendingDown className="icon-sm" /> Real Monthly Household Deficit
                </>
              )}
            </span>
            {scenarioMode && (
              <span className="scenario-pill-badge">
                <Sparkles className="icon-xs inline-icon" /> Live What-If Scenario View
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
              Usable Spendable Income ({formatMoney(current.combinedUsableMonthly)}/mo) minus Total Outgoings ({formatMoney(current.totalExpensesMonthly)}/mo)
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
              <PiggyBank className="icon-sm inline-icon" /> Monthly Savings / Emergency Fund Allocation:
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
            <span className="after-savings-label">Net Surplus After Savings:</span>
            <span className={`after-savings-value ${isAfterSavingsSurplus ? 'text-surplus' : 'text-deficit'}`}>
              {formatMoney(current.netAfterSavingsMonthly, true)} <span className="text-muted">/mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Combined Usable Cash Income</div>
          <div className="metric-value text-primary">
            {formatMoney(current.combinedUsableMonthly)} <span className="metric-period">/mo</span>
          </div>
          <div className="metric-subtext">
            Post-tax & post-super combined spendable cash ({formatMoney(current.combinedUsableAnnual)}/yr)
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Total Outgoings & Expenses</div>
          <div className="metric-value text-warning">
            {formatMoney(current.totalExpensesMonthly)} <span className="metric-period">/mo</span>
          </div>
          <div className="metric-subtext">
            Normalised across all weekly, monthly & annual line items
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">
            <Shield className="icon-xs inline-icon" /> Superannuation (Wealth Fund)
          </div>
          <div className="metric-value text-info">
            {formatMoney(current.totalSuperMonthly)} <span className="metric-period">/mo</span>
          </div>
          <div className="metric-subtext">
            {formatMoney(current.totalSuperMonthly * 12)}/yr total employer super (Excluded from cash flow)
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Partner Cash Flow Split</div>
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
            Individual spendable income minus personal & 50% shared outgoings
          </div>
        </div>
      </div>
    </section>
  );
}
