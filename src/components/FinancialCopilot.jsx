import React, { useState } from 'react';
import { Sparkles, Activity } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';

export function FinancialCopilot({ data, savingsTargetMonthly, partners, expenses }) {
  const [activeCopilotTab, setActiveCopilotTab] = useState('structure'); // 'structure' | 'tax' | 'runway' | 'equity'

  const current = data?.baseline;
  if (!current) return null;

  const p1 = current.p1 || {};
  const p2 = current.p2 || {};

  const p1Name = partners?.[0]?.name || 'Partner 1';
  const p2Name = partners?.[1]?.name || 'Partner 2';

  const totalExpenses = current.totalExpensesMonthly || 0;
  const totalSuper = current.totalSuperMonthly || 0;

  // 1. Expense Structure Analysis (Fixed vs Discretionary)
  const fixedCategories = ['Housing', 'Debt', 'Insurance', 'Childcare'];
  const fixedExpensesVal = expenses
    .filter(e => fixedCategories.includes(e.category || 'General'))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const discretionaryExpensesVal = Math.max(0, totalExpenses - fixedExpensesVal);
  const fixedRatio = totalExpenses > 0 ? Math.round((fixedExpensesVal / totalExpenses) * 100) : 0;
  const discRatio = Math.max(0, 100 - fixedRatio);

  // 2. ATO Tax Bracket Proximity Analysis
  const p1TaxableAnnual = p1.taxableIncomeAnnual || 0;
  const p2TaxableAnnual = p2.taxableIncomeAnnual || 0;

  // ATO Thresholds: $45,000 (16%), $135,000 (30%), $190,000 (37%)
  const getBracketInfo = (salary) => {
    if (salary > 190000) return { rate: '45%', nextThreshold: null, distance: 0 };
    if (salary > 135000) return { rate: '37%', nextThreshold: 190000, distance: 190000 - salary };
    if (salary > 45000) return { rate: '30%', nextThreshold: 135000, distance: 135000 - salary };
    if (salary > 18200) return { rate: '16%', nextThreshold: 45000, distance: 45000 - salary };
    return { rate: '0%', nextThreshold: 18200, distance: 18200 - salary };
  };

  const p1Bracket = getBracketInfo(p1TaxableAnnual);
  const p2Bracket = getBracketInfo(p2TaxableAnnual);

  // 3. Emergency Runway Months
  const monthlySavingsReserves = savingsTargetMonthly || 0;
  // Estimate safety net: reserves vs fixed monthly commitments
  const runwayMonths = fixedExpensesVal > 0 ? (monthlySavingsReserves * 6 / fixedExpensesVal).toFixed(1) : '6+';

  // 4. Partner Contribution Equity
  const p1Usable = p1.spendableIncomeMonthly || 0;
  const p2Usable = p2.spendableIncomeMonthly || 0;
  const combinedPartners = (p1Usable + p2Usable) || 1;
  const p1EquityPct = Math.round((p1Usable / combinedPartners) * 100);
  const p2EquityPct = 100 - p1EquityPct;

  return (
    <div className="financial-copilot-card">
      <div className="copilot-card-header">
        <div className="copilot-badge-group">
          <span className="copilot-glow-badge">
            <Sparkles className="icon-xs inline-icon text-primary" /> Tandem Intelligence Copilot
          </span>
          <span className="copilot-status-indicator">
            <Activity className="icon-xs inline-icon text-surplus" /> Live Analysis Active
          </span>
        </div>

        {/* Insight Tabs Header */}
        <div className="copilot-tabs-bar">
          <button
            type="button"
            className={`copilot-tab-btn ${activeCopilotTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveCopilotTab('structure')}
          >
            📊 Cashflow Structure
          </button>
          <button
            type="button"
            className={`copilot-tab-btn ${activeCopilotTab === 'tax' ? 'active' : ''}`}
            onClick={() => setActiveCopilotTab('tax')}
          >
            ⚖️ Tax Efficiency
          </button>
          <button
            type="button"
            className={`copilot-tab-btn ${activeCopilotTab === 'runway' ? 'active' : ''}`}
            onClick={() => setActiveCopilotTab('runway')}
          >
            🛡️ Runway & Reserves
          </button>
          <button
            type="button"
            className={`copilot-tab-btn ${activeCopilotTab === 'equity' ? 'active' : ''}`}
            onClick={() => setActiveCopilotTab('equity')}
          >
            🤝 Partner Equity
          </button>
        </div>
      </div>

      {/* Insight Body 1: Cashflow Structure */}
      {activeCopilotTab === 'structure' && (
        <div className="copilot-insight-body">
          <div className="insight-main-metric">
            <span className="insight-label">Expense Commitment Structure:</span>
            <span className="insight-highlight">
              <strong>{fixedRatio}% Fixed Commitments</strong> ({formatMoney(fixedExpensesVal)}/mo) | <strong>{discRatio}% Flexible</strong> ({formatMoney(discretionaryExpensesVal)}/mo)
            </span>
          </div>

          <div className="progress-bar-track copilot-track">
            <div className="progress-bar-fill fill-cat-housing" style={{ width: `${fixedRatio}%` }} title={`Fixed Commitments: ${fixedRatio}%`} />
            <div className="progress-bar-fill fill-cat-personal" style={{ width: `${discRatio}%` }} title={`Flexible Outgoings: ${discRatio}%`} />
          </div>

          <p className="copilot-narrative">
            💡 <strong>Copilot Insight:</strong> {fixedRatio > 70
              ? `${fixedRatio}% of your outgoings are locked into fixed commitments (Housing, Debt, Insurance). Reducing fixed commitments gives 3x more cashflow relief than cutting small personal items.`
              : `Your expense structure is flexible! Only ${fixedRatio}% is locked into fixed commitments, allowing your household to adapt easily to unexpected income changes.`
            }
          </p>
        </div>
      )}

      {/* Insight Body 2: Tax Efficiency */}
      {activeCopilotTab === 'tax' && (
        <div className="copilot-insight-body">
          <div className="copilot-tax-grid">
            <div className="partner-tax-card">
              <div className="tax-partner-name">{p1Name} (ATO Marginal Tax Rate: <strong>{p1Bracket.rate}</strong>)</div>
              <div className="tax-threshold-text">
                {p1Bracket.nextThreshold
                  ? `$${Math.round(p1Bracket.distance).toLocaleString()} below the next tax bracket threshold ($${p1Bracket.nextThreshold.toLocaleString()}/yr).`
                  : `Currently in top ATO tax bracket (45%).`}
              </div>
            </div>

            <div className="partner-tax-card">
              <div className="tax-partner-name">{p2Name} (ATO Marginal Tax Rate: <strong>{p2Bracket.rate}</strong>)</div>
              <div className="tax-threshold-text">
                {p2Bracket.nextThreshold
                  ? `$${Math.round(p2Bracket.distance).toLocaleString()} below the next tax bracket threshold ($${p2Bracket.nextThreshold.toLocaleString()}/yr).`
                  : `Currently in top ATO tax bracket (45%).`}
              </div>
            </div>
          </div>

          <p className="copilot-narrative">
            🛡️ <strong>Super Guarantee & Tax Strategy:</strong> You both build <strong>{formatMoney(totalSuper * 12)}/yr</strong> in non-cash super wealth (12% employer SG). Voluntary salary sacrifice contributions are taxed at just 15% super rate instead of your marginal tax rate ({p1Bracket.rate} / {p2Bracket.rate}).
          </p>
        </div>
      )}

      {/* Insight Body 3: Runway & Reserves */}
      {activeCopilotTab === 'runway' && (
        <div className="copilot-insight-body">
          <div className="insight-main-metric">
            <span className="insight-label">Estimated Emergency Runway Buffer:</span>
            <span className="insight-highlight text-surplus">
              <strong>{monthlySavingsReserves > 0 ? `${formatMoney(monthlySavingsReserves)}/mo` : 'No target set'}</strong> ({runwayMonths} months of fixed outgoings covered)
            </span>
          </div>

          <p className="copilot-narrative">
            🛡️ <strong>Copilot Safety Net Model:</strong> Setting aside a consistent monthly savings target builds a 3-to-6 month emergency fund. If income drops unexpectedly, your fixed expenses ({formatMoney(fixedExpensesVal)}/mo) remain fully protected.
          </p>
        </div>
      )}

      {/* Insight Body 4: Partner Equity */}
      {activeCopilotTab === 'equity' && (
        <div className="copilot-insight-body">
          <div className="insight-main-metric">
            <span className="insight-label">Spendable Post-Tax Contribution Parity:</span>
            <span className="insight-highlight text-primary">
              <strong>{p1Name}: {p1EquityPct}%</strong> ({formatMoney(p1Usable)}/mo) | <strong>{p2Name}: {p2EquityPct}%</strong> ({formatMoney(p2Usable)}/mo)
            </span>
          </div>

          <div className="progress-bar-track copilot-track">
            <div className="progress-bar-fill fill-p1" style={{ width: `${p1EquityPct}%` }} />
            <div className="progress-bar-fill fill-p2" style={{ width: `${p2EquityPct}%` }} />
          </div>

          <p className="copilot-narrative">
            🤝 <strong>Financial Harmony Insight:</strong> {p1Name} contributes {p1EquityPct}% and {p2Name} contributes {p2EquityPct}% of your post-tax spendable income. Expenses assigned to <strong>Shared (50/50)</strong> are automatically split equally between both partners' net positions.
          </p>
        </div>
      )}
    </div>
  );
}
