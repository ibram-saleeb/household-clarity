import React from 'react';
import { Zap, RotateCcw, Plus, Trash2, Sliders, ArrowRight } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';

export function ScenarioEngine({
  scenarioMode,
  onToggleScenario,
  scenarioData,
  onUpdateScenario,
  partners,
  baselineExpenses
}) {
  const p1Name = partners?.[0]?.name || 'Partner 1';
  const p2Name = partners?.[1]?.name || 'Partner 2';

  const currentOverrides = scenarioData?.incomeOverrides || {
    p1: { salary: null, salaryPercent: 100 },
    p2: { salary: null, salaryPercent: 100 }
  };

  const scenarioExpenseList = scenarioData?.expensesOverride !== null && scenarioData?.expensesOverride !== undefined
    ? scenarioData.expensesOverride
    : baselineExpenses;

  // Handlers for Partner Salary Overrides
  const handlePartnerSalaryChange = (partnerKey, val) => {
    const num = val === '' ? null : Math.max(0, Number(val));
    onUpdateScenario({
      ...scenarioData,
      incomeOverrides: {
        ...currentOverrides,
        [partnerKey]: {
          ...currentOverrides[partnerKey],
          salary: num
        }
      }
    });
  };

  const handlePartnerPercentChange = (partnerKey, percent) => {
    const numPercent = Math.max(0, Math.min(200, Number(percent)));
    onUpdateScenario({
      ...scenarioData,
      incomeOverrides: {
        ...currentOverrides,
        [partnerKey]: {
          ...currentOverrides[partnerKey],
          salaryPercent: numPercent,
          salary: null // reset fixed salary override when using percent slider
        }
      }
    });
  };

  // Preset Scenario Handlers
  const applyPreset = (type) => {
    if (!scenarioMode) {
      onToggleScenario();
    }

    if (type === 'p2_parental_leave') {
      const p2BaseSalary = partners[1]?.salary || 85000;
      onUpdateScenario({
        incomeOverrides: {
          p1: { salary: null, salaryPercent: 100 },
          p2: { salary: p2BaseSalary * 0.5, salaryPercent: 50 }
        },
        expensesOverride: null
      });
    } else if (type === 'p2_zero_income') {
      onUpdateScenario({
        incomeOverrides: {
          p1: { salary: null, salaryPercent: 100 },
          p2: { salary: 0, salaryPercent: 0 }
        },
        expensesOverride: null
      });
    } else if (type === 'new_mortgage') {
      const newMortgageExpense = {
        id: 'scenario_mortgage_' + Date.now(),
        label: 'New Mortgage Repayment',
        amount: 4200,
        frequency: 'monthly',
        assignedTo: 'shared',
        category: 'Housing'
      };
      onUpdateScenario({
        incomeOverrides: {
          p1: { salary: null, salaryPercent: 100 },
          p2: { salary: null, salaryPercent: 100 }
        },
        expensesOverride: [...baselineExpenses, newMortgageExpense]
      });
    } else if (type === 'clear') {
      onUpdateScenario({
        incomeOverrides: {
          p1: { salary: null, salaryPercent: 100 },
          p2: { salary: null, salaryPercent: 100 }
        },
        expensesOverride: null
      });
    }
  };

  // Scenario Expense Handlers
  const handleAddScenarioExpense = () => {
    const newExp = {
      id: 'scenario_exp_' + Date.now(),
      label: 'What-If Test Expense',
      amount: 500,
      frequency: 'monthly',
      assignedTo: 'shared',
      category: 'Test'
    };
    onUpdateScenario({
      ...scenarioData,
      expensesOverride: [...scenarioExpenseList, newExp]
    });
  };

  const handleUpdateScenarioExpense = (id, field, value) => {
    const updated = scenarioExpenseList.map((exp) => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onUpdateScenario({
      ...scenarioData,
      expensesOverride: updated
    });
  };

  const handleDeleteScenarioExpense = (id) => {
    const updated = scenarioExpenseList.filter((exp) => exp.id !== id);
    onUpdateScenario({
      ...scenarioData,
      expensesOverride: updated
    });
  };

  // Comparison Metrics Config
  const baseline = scenarioData?.baseline;
  const scenario = scenarioData?.scenario;
  const deltas = scenarioData?.deltas;

  const comparisonMetrics = [
    {
      title: 'Net Monthly Cash Flow (Hero Metric)',
      isHero: true,
      baselineVal: baseline?.netCashflowMonthly,
      scenarioVal: scenario?.netCashflowMonthly,
      deltaVal: deltas?.netCashflowMonthly,
      inverseDelta: false
    },
    {
      title: 'Net Cash Flow After Savings Target',
      isHero: false,
      baselineVal: baseline?.netAfterSavingsMonthly,
      scenarioVal: scenario?.netAfterSavingsMonthly,
      deltaVal: deltas?.netAfterSavingsMonthly,
      inverseDelta: false
    },
    {
      title: 'Combined Usable Spendable Income',
      isHero: false,
      baselineVal: baseline?.combinedUsableMonthly,
      scenarioVal: scenario?.combinedUsableMonthly,
      deltaVal: deltas?.combinedUsableMonthly,
      inverseDelta: false
    },
    {
      title: 'Total Household Outgoings',
      isHero: false,
      baselineVal: baseline?.totalExpensesMonthly,
      scenarioVal: scenario?.totalExpensesMonthly,
      deltaVal: deltas?.totalExpensesMonthly,
      inverseDelta: true
    },
    {
      title: `${p1Name} Spendable Cash`,
      isHero: false,
      baselineVal: baseline?.p1?.spendableIncomeMonthly,
      scenarioVal: scenario?.p1?.spendableIncomeMonthly,
      deltaVal: (scenario?.p1?.spendableIncomeMonthly || 0) - (baseline?.p1?.spendableIncomeMonthly || 0),
      inverseDelta: false
    },
    {
      title: `${p2Name} Spendable Cash`,
      isHero: false,
      baselineVal: baseline?.p2?.spendableIncomeMonthly,
      scenarioVal: scenario?.p2?.spendableIncomeMonthly,
      deltaVal: (scenario?.p2?.spendableIncomeMonthly || 0) - (baseline?.p2?.spendableIncomeMonthly || 0),
      inverseDelta: false
    },
    {
      title: 'Superannuation Wealth Accumulation',
      isHero: false,
      baselineVal: baseline?.totalSuperMonthly,
      scenarioVal: scenario?.totalSuperMonthly,
      deltaVal: deltas?.totalSuperMonthly,
      inverseDelta: false
    }
  ];

  return (
    <section className="section-container scenario-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Zap className="icon-md inline-icon text-zap" /> What-If Live Scenario Engine
          </h2>
          <p className="section-subtitle">
            Simulate life events—job changes, parental leave, mortgage surge—and instantly compare your Baseline vs Scenario position.
          </p>
        </div>

        <div className="scenario-toggle-wrapper">
          <button
            className={`btn ${scenarioMode ? 'btn-scenario-active' : 'btn-outline'}`}
            onClick={onToggleScenario}
          >
            <Zap className="icon-xs inline-icon" />
            {scenarioMode ? 'Scenario Mode ACTIVE' : 'Enable What-If Scenario'}
          </button>
        </div>
      </div>

      {/* Quick Presets Grid */}
      <div className="presets-bar">
        <span className="presets-title">Quick Stress-Test Presets:</span>
        <div className="preset-cards-grid">
          <div className="preset-card" onClick={() => applyPreset('p2_parental_leave')}>
            <div className="preset-card-title">👶 {p2Name} Parental Leave</div>
            <div className="preset-card-desc">-50% Salary reduction stress test</div>
          </div>
          <div className="preset-card" onClick={() => applyPreset('p2_zero_income')}>
            <div className="preset-card-title">💼 Single Income Test</div>
            <div className="preset-card-desc">{p2Name} $0 income scenario</div>
          </div>
          <div className="preset-card" onClick={() => applyPreset('new_mortgage')}>
            <div className="preset-card-title">🏠 New Mortgage / Surge</div>
            <div className="preset-card-desc">+$4,200/mo extra outgoings</div>
          </div>
          <div className="preset-card preset-reset" onClick={() => applyPreset('clear')}>
            <div className="preset-card-title"><RotateCcw className="icon-xs inline-icon" /> Reset Overrides</div>
            <div className="preset-card-desc">Restore baseline data</div>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Controls */}
      {scenarioMode && (
        <div className="scenario-controls-grid">
          {/* Income Overrides Card */}
          <div className="scenario-card">
            <h3 className="card-subtitle">
              <Sliders className="icon-xs inline-icon" /> Adjust Partner Incomes
            </h3>
            
            {/* P1 Controls */}
            <div className="scenario-partner-control">
              <div className="control-label-row">
                <span className="control-name">{p1Name} Salary Adjustment:</span>
                <span className="percent-pill">{currentOverrides.p1?.salaryPercent ?? 100}%</span>
              </div>

              <div className="scenario-slider-row">
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  className="range-slider"
                  value={currentOverrides.p1?.salaryPercent ?? 100}
                  onChange={(e) => handlePartnerPercentChange('p1', e.target.value)}
                />
              </div>

              <div className="quick-percent-buttons">
                {[0, 50, 75, 100, 125].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    className={`btn-pct-chip ${(currentOverrides.p1?.salaryPercent ?? 100) === pct ? 'active' : ''}`}
                    onClick={() => handlePartnerPercentChange('p1', pct)}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <div className="override-direct-input">
                <span className="text-xs text-muted">Or dollar amount override:</span>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    min="0"
                    className="input-field input-xs"
                    placeholder={`Baseline: ${partners[0]?.salary || 0}`}
                    value={currentOverrides.p1?.salary ?? ''}
                    onChange={(e) => handlePartnerSalaryChange('p1', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* P2 Controls */}
            <div className="scenario-partner-control">
              <div className="control-label-row">
                <span className="control-name">{p2Name} Salary Adjustment:</span>
                <span className="percent-pill">{currentOverrides.p2?.salaryPercent ?? 100}%</span>
              </div>

              <div className="scenario-slider-row">
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  className="range-slider"
                  value={currentOverrides.p2?.salaryPercent ?? 100}
                  onChange={(e) => handlePartnerPercentChange('p2', e.target.value)}
                />
              </div>

              <div className="quick-percent-buttons">
                {[0, 50, 75, 100, 125].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    className={`btn-pct-chip ${(currentOverrides.p2?.salaryPercent ?? 100) === pct ? 'active' : ''}`}
                    onClick={() => handlePartnerPercentChange('p2', pct)}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <div className="override-direct-input">
                <span className="text-xs text-muted">Or dollar amount override:</span>
                <div className="input-prefix-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    min="0"
                    className="input-field input-xs"
                    placeholder={`Baseline: ${partners[1]?.salary || 0}`}
                    value={currentOverrides.p2?.salary ?? ''}
                    onChange={(e) => handlePartnerSalaryChange('p2', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Expenses Overrides Card */}
          <div className="scenario-card">
            <div className="scenario-card-header">
              <h3 className="card-subtitle">Scenario Outgoings Overrides</h3>
              <button className="btn btn-ghost-sm" onClick={handleAddScenarioExpense}>
                <Plus className="icon-xs inline-icon" /> Add Test Expense
              </button>
            </div>
            
            <div className="scenario-expenses-list">
              {scenarioExpenseList.map((exp) => (
                <div key={exp.id} className="scenario-expense-item-card">
                  <div className="scenario-expense-item-top">
                    <input
                      type="text"
                      className="input-field scenario-expense-title"
                      value={exp.label}
                      onChange={(e) => handleUpdateScenarioExpense(exp.id, 'label', e.target.value)}
                    />
                    <button
                      className="btn-icon-danger"
                      onClick={() => handleDeleteScenarioExpense(exp.id)}
                      title="Remove expense from scenario"
                    >
                      <Trash2 className="icon-xs" />
                    </button>
                  </div>

                  <div className="scenario-expense-item-bottom">
                    <div className="input-prefix-wrapper">
                      <span className="input-prefix">$</span>
                      <input
                        type="number"
                        className="input-field"
                        value={exp.amount}
                        onChange={(e) => handleUpdateScenarioExpense(exp.id, 'amount', Math.max(0, Number(e.target.value) || 0))}
                      />
                    </div>
                    <select
                      className="input-select"
                      value={exp.frequency}
                      onChange={(e) => handleUpdateScenarioExpense(exp.id, 'frequency', e.target.value)}
                    >
                      <option value="monthly">/ mo</option>
                      <option value="weekly">/ wk</option>
                      <option value="fortnightly">/ fortnight</option>
                      <option value="annual">/ yr</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile-First Scenario Impact Comparison Cards */}
      {scenarioMode && baseline && scenario && (
        <div className="comparison-section-wrapper">
          <h3 className="comparison-section-title">
            <Zap className="icon-xs inline-icon text-zap" /> Baseline vs Scenario Position Impact
          </h3>

          <div className="scenario-impact-cards-grid">
            {comparisonMetrics.map((m, idx) => {
              const delta = m.deltaVal || 0;
              const isPositive = m.inverseDelta ? delta <= 0 : delta >= 0;
              const deltaClass = isPositive ? 'delta-tag-surplus' : 'delta-tag-deficit';

              return (
                <div key={idx} className={`scenario-impact-card ${m.isHero ? 'hero-impact-card' : ''}`}>
                  <div className="impact-card-header">
                    <span className="impact-metric-title">{m.title}</span>
                    <span className={`impact-delta-tag ${deltaClass}`}>
                      {delta >= 0 ? '+' : ''}{formatMoney(delta, true)} / mo
                    </span>
                  </div>

                  <div className="impact-comparison-row">
                    <div className="impact-value-box">
                      <span className="impact-value-label">Baseline</span>
                      <span className="impact-value-number">{formatMoney(m.baselineVal, true)}</span>
                    </div>

                    <div className="impact-arrow">
                      <ArrowRight className="icon-xs" />
                    </div>

                    <div className="impact-value-box highlight">
                      <span className="impact-value-label">Scenario</span>
                      <span className="impact-value-number">{formatMoney(m.scenarioVal, true)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
