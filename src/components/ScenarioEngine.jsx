import React from 'react';
import { Zap, RotateCcw, Plus, Trash2, Sliders } from 'lucide-react';
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

  return (
    <section className="section-container scenario-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Zap className="icon-md inline-icon text-zap" /> What-If Live Scenario Engine
          </h2>
          <p className="section-subtitle">
            Simulate life events—job changes, parental leave, mortgage rate increases—and immediately compare your Baseline vs Scenario side-by-side.
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

      {/* Quick Presets Bar */}
      <div className="presets-bar">
        <span className="presets-title">Quick Stress-Test Presets:</span>
        <div className="preset-buttons-group">
          <button className="btn btn-chip" onClick={() => applyPreset('p2_parental_leave')}>
            👶 {p2Name} Parental Leave (-50% Salary)
          </button>
          <button className="btn btn-chip" onClick={() => applyPreset('p2_zero_income')}>
            💼 {p2Name} Career Transition ($0 Salary)
          </button>
          <button className="btn btn-chip" onClick={() => applyPreset('new_mortgage')}>
            🏠 Add New Mortgage (+$4,200/mo)
          </button>
          <button className="btn btn-chip text-muted" onClick={() => applyPreset('clear')}>
            <RotateCcw className="icon-xs inline-icon" /> Reset Overrides
          </button>
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
              <label className="input-label font-weight-bold">{p1Name} Salary Adjustment:</label>
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
                <span className="percent-badge">
                  {currentOverrides.p1?.salaryPercent ?? 100}%
                </span>
              </div>
              <div className="override-direct-input">
                <span className="text-xs text-muted">Or override dollar amount:</span>
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
              <label className="input-label font-weight-bold">{p2Name} Salary Adjustment:</label>
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
                <span className="percent-badge">
                  {currentOverrides.p2?.salaryPercent ?? 100}%
                </span>
              </div>
              <div className="override-direct-input">
                <span className="text-xs text-muted">Or override dollar amount:</span>
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
              <h3 className="card-subtitle">Scenario Expense Lines</h3>
              <button className="btn btn-ghost-sm" onClick={handleAddScenarioExpense}>
                <Plus className="icon-xs inline-icon" /> Add Test Expense
              </button>
            </div>
            
            <div className="scenario-expenses-list">
              {scenarioExpenseList.map((exp) => (
                <div key={exp.id} className="scenario-expense-item">
                  <input
                    type="text"
                    className="input-field input-xs"
                    value={exp.label}
                    onChange={(e) => handleUpdateScenarioExpense(exp.id, 'label', e.target.value)}
                  />
                  <div className="input-prefix-wrapper input-xs-amount">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      className="input-field input-xs"
                      value={exp.amount}
                      onChange={(e) => handleUpdateScenarioExpense(exp.id, 'amount', Math.max(0, Number(e.target.value) || 0))}
                    />
                  </div>
                  <select
                    className="input-select input-xs-freq"
                    value={exp.frequency}
                    onChange={(e) => handleUpdateScenarioExpense(exp.id, 'frequency', e.target.value)}
                  >
                    <option value="monthly">/ mo</option>
                    <option value="weekly">/ wk</option>
                    <option value="fortnightly">/ fortnight</option>
                    <option value="annual">/ yr</option>
                  </select>
                  <button
                    className="btn-icon-danger"
                    onClick={() => handleDeleteScenarioExpense(exp.id)}
                    title="Remove expense from scenario"
                  >
                    <Trash2 className="icon-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Baseline vs Scenario Comparison Table */}
      {scenarioMode && scenarioData?.baseline && scenarioData?.scenario && (
        <div className="comparison-card">
          <h3 className="comparison-title">
            <Zap className="icon-xs inline-icon text-zap" /> Baseline vs Scenario Side-by-Side Comparison
          </h3>

          <div className="table-responsive">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Financial Metric</th>
                  <th>Baseline</th>
                  <th>What-If Scenario</th>
                  <th>Delta / Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="highlight-row">
                  <td>
                    <strong>Net Monthly Cash Flow (Hero Metric)</strong>
                  </td>
                  <td className={scenarioData.baseline.netCashflowMonthly >= 0 ? 'text-surplus' : 'text-deficit'}>
                    {formatMoney(scenarioData.baseline.netCashflowMonthly, true)} / mo
                  </td>
                  <td className={scenarioData.scenario.netCashflowMonthly >= 0 ? 'text-surplus' : 'text-deficit'}>
                    {formatMoney(scenarioData.scenario.netCashflowMonthly, true)} / mo
                  </td>
                  <td className={`delta-cell ${scenarioData.deltas.netCashflowMonthly >= 0 ? 'text-surplus' : 'text-deficit'}`}>
                    {formatMoney(scenarioData.deltas.netCashflowMonthly, true)} / mo
                  </td>
                </tr>

                <tr>
                  <td>Net Cash Flow After Savings Target</td>
                  <td>{formatMoney(scenarioData.baseline.netAfterSavingsMonthly, true)} / mo</td>
                  <td>{formatMoney(scenarioData.scenario.netAfterSavingsMonthly, true)} / mo</td>
                  <td className={scenarioData.deltas.netAfterSavingsMonthly >= 0 ? 'text-surplus' : 'text-deficit'}>
                    {formatMoney(scenarioData.deltas.netAfterSavingsMonthly, true)} / mo
                  </td>
                </tr>

                <tr>
                  <td>Combined Usable Spendable Income (Post-Tax)</td>
                  <td>{formatMoney(scenarioData.baseline.combinedUsableMonthly)} / mo</td>
                  <td>{formatMoney(scenarioData.scenario.combinedUsableMonthly)} / mo</td>
                  <td className={scenarioData.deltas.combinedUsableMonthly >= 0 ? 'text-surplus' : 'text-deficit'}>
                    {formatMoney(scenarioData.deltas.combinedUsableMonthly, true)} / mo
                  </td>
                </tr>

                <tr>
                  <td>Total Outgoings & Expenses</td>
                  <td>{formatMoney(scenarioData.baseline.totalExpensesMonthly)} / mo</td>
                  <td>{formatMoney(scenarioData.scenario.totalExpensesMonthly)} / mo</td>
                  <td className={scenarioData.deltas.totalExpensesMonthly <= 0 ? 'text-surplus' : 'text-deficit'}>
                    {formatMoney(scenarioData.deltas.totalExpensesMonthly, true)} / mo
                  </td>
                </tr>

                <tr>
                  <td>{p1Name} Spendable Cash</td>
                  <td>{formatMoney(scenarioData.baseline.p1?.spendableIncomeMonthly)} / mo</td>
                  <td>{formatMoney(scenarioData.scenario.p1?.spendableIncomeMonthly)} / mo</td>
                  <td>
                    {formatMoney(
                      (scenarioData.scenario.p1?.spendableIncomeMonthly || 0) - (scenarioData.baseline.p1?.spendableIncomeMonthly || 0),
                      true
                    )} / mo
                  </td>
                </tr>

                <tr>
                  <td>{p2Name} Spendable Cash</td>
                  <td>{formatMoney(scenarioData.baseline.p2?.spendableIncomeMonthly)} / mo</td>
                  <td>{formatMoney(scenarioData.scenario.p2?.spendableIncomeMonthly)} / mo</td>
                  <td>
                    {formatMoney(
                      (scenarioData.scenario.p2?.spendableIncomeMonthly || 0) - (scenarioData.baseline.p2?.spendableIncomeMonthly || 0),
                      true
                    )} / mo
                  </td>
                </tr>

                <tr>
                  <td>Superannuation Wealth Accumulation</td>
                  <td>{formatMoney(scenarioData.baseline.totalSuperMonthly)} / mo</td>
                  <td>{formatMoney(scenarioData.scenario.totalSuperMonthly)} / mo</td>
                  <td>{formatMoney(scenarioData.deltas.totalSuperMonthly, true)} / mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
