import React from 'react';
import { formatMoney } from '../utils/formatters.js';

export function ScenarioEngine({
  scenarioMode,
  onToggleScenario,
  scenarioData,
  onUpdateScenario,
  onAddScenario,
  onDeleteScenario,
  onSelectScenario,
  partners,
  baselineExpenses
}) {
  const p1Name = partners?.[0]?.name || 'Alex';
  const p2Name = partners?.[1]?.name || 'Sam';

  const multiScenarios = scenarioData?.multiScenarios || [];
  const activeScenarioId = scenarioData?.activeScenarioId;
  const activeCalc = multiScenarios.find(s => s.id === activeScenarioId) || multiScenarios[0] || null;
  const activeRaw = activeCalc?.rawConfig || scenarioData;

  const currentOverrides = activeRaw?.incomeOverrides || {
    p1: { salary: null, salaryPercent: 100 },
    p2: { salary: null, salaryPercent: 100 }
  };

  const p2Cut = 100 - (currentOverrides.p2?.salaryPercent ?? 100);

  const handleCutChange = (e) => {
    const cut = Number(e.target.value);
    const newPercent = 100 - cut;
    if (!scenarioMode) onToggleScenario();

    onUpdateScenario({
      ...activeRaw,
      name: `${p2Name} −${cut}% Income`,
      incomeOverrides: {
        ...currentOverrides,
        p2: { salaryPercent: newPercent, salary: null }
      }
    });
  };

  const applyPreset = (type) => {
    if (!scenarioMode) onToggleScenario();

    if (type === 'parental_leave') {
      onUpdateScenario({
        ...activeRaw,
        name: `${p2Name} Parental Leave`,
        presetKey: 'parental_leave',
        incomeOverrides: {
          p1: { salary: null, salaryPercent: 100 },
          p2: { salaryPercent: 50, salary: null }
        }
      });
    } else if (type === 'single_income') {
      onUpdateScenario({
        ...activeRaw,
        name: `Single Income (${p1Name} only)`,
        presetKey: 'single_income',
        incomeOverrides: {
          p1: { salary: null, salaryPercent: 100 },
          p2: { salaryPercent: 0, salary: null }
        }
      });
    } else if (type === 'mortgage_rise') {
      const newMortgage = {
        id: 'scen_mortgage_' + Date.now(),
        label: 'Mortgage Surge',
        amount: 4200,
        frequency: 'monthly',
        assignedTo: 'shared',
        category: 'Housing'
      };
      onUpdateScenario({
        ...activeRaw,
        name: 'Mortgage +$4,200',
        presetKey: 'mortgage_rise',
        expensesOverride: [
          ...(baselineExpenses || []).filter(e => e.category !== 'Housing'),
          newMortgage
        ]
      });
    }
  };

  const resetScenario = () => {
    onUpdateScenario({
      ...activeRaw,
      name: 'Baseline Position',
      incomeOverrides: {
        p1: { salary: null, salaryPercent: 100 },
        p2: { salary: null, salaryPercent: 100 }
      },
      expensesOverride: null
    });
  };

  const scenResult = activeCalc?.result || scenarioData?.baseline;
  const deltas = activeCalc?.deltas || { netCashflowMonthly: 0 };
  const scenarioBuffer = scenResult?.netCashflowMonthly || 6216;
  const scenarioUsable = scenResult?.combinedUsableMonthly || 13083;
  const scenarioExpenses = scenResult?.totalExpensesMonthly || 6867;

  return (
    <section className="section-panel" aria-label="What-If Scenario Stress Test">
      <div className="expenses-title-row">
        <h2 className="expenses-main-title">What if {p2Name} earned less?</h2>
        <div className="expenses-sub-row">
          <span className="expenses-count-tag">Nothing here affects your real data. Drag to stress-test.</span>
        </div>
      </div>

      {/* Preset Scenario Pills */}
      <div className="category-filter-row">
        <button
          type="button"
          className="cat-filter-btn"
          onClick={() => applyPreset('parental_leave')}
        >
          Parental leave
        </button>
        <button
          type="button"
          className="cat-filter-btn"
          onClick={() => applyPreset('single_income')}
        >
          Single income
        </button>
        <button
          type="button"
          className="cat-filter-btn"
          onClick={() => applyPreset('mortgage_rise')}
        >
          Mortgage +$4,200
        </button>
      </div>

      {/* Main What-If Leftover Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Left over each month
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '3.5rem', fontWeight: 600, color: 'var(--mint)', lineHeight: 1, letterSpacing: '-0.035em' }}>
          {formatMoney(scenarioBuffer)}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {deltas.netCashflowMonthly < 0 ? `−${formatMoney(Math.abs(deltas.netCashflowMonthly))}` : `+${formatMoney(deltas.netCashflowMonthly)}`} vs your normal month
        </div>
      </div>

      {/* Interactive Income Slider */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{p2Name}'s income</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--amber-light)' }}>−{p2Cut}%</span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={p2Cut}
          onChange={handleCutChange}
          style={{ width: '100%', accentColor: 'var(--primary)', height: '32px', cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>no change</span>
          <span>no income</span>
        </div>
      </div>

      {/* Scenario Flow Breakdown */}
      <div className="cashflow-flow-list" style={{ marginTop: '0.5rem' }}>
        <div className="flow-row">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Coming in</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.95rem' }}>{formatMoney(scenarioUsable)}</span>
        </div>
        <div className="flow-row">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Going out</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-main)', fontSize: '0.95rem' }}>{formatMoney(scenarioExpenses)}</span>
        </div>
        <div className="flow-row">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Savings buffer</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--mint)', fontSize: '0.95rem' }}>
            {scenarioBuffer >= 1500 ? 'Target met ($1,500)' : `Shortfall (${formatMoney(scenarioBuffer)})`}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={resetScenario}
          style={{ flex: 1, height: '48px', borderRadius: 'var(--radius-pill)' }}
        >
          Reset
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {}}
          style={{ flex: 1.4, height: '48px', borderRadius: 'var(--radius-pill)', background: 'var(--primary)', color: '#eafaf6', border: 'none' }}
        >
          Save scenario
        </button>
      </div>
    </section>
  );
}
