import React from 'react';
import { User, Plus, Trash2, Lock } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';
import { ATO_TAX_CONFIG } from '../config/atoTaxConfig';
import { Tooltip } from './Tooltip.jsx';

export function IncomeSection({ partners, onUpdatePartner, calculatedData }) {
  const p1Calc = calculatedData?.baseline?.p1;
  const p2Calc = calculatedData?.baseline?.p2;

  const handlePartnerChange = (partnerIndex, field, value) => {
    const updated = [...partners];
    updated[partnerIndex] = {
      ...updated[partnerIndex],
      [field]: value
    };
    onUpdatePartner(updated);
  };

  const handleAddExtraIncome = (partnerIndex) => {
    const updated = [...partners];
    const newExtra = {
      id: 'extra_' + Date.now(),
      label: 'Dividend / Rental Income',
      amount: 500,
      frequency: 'monthly'
    };
    updated[partnerIndex].extraIncomes = [...(updated[partnerIndex].extraIncomes || []), newExtra];
    onUpdatePartner(updated);
  };

  const handleUpdateExtraIncome = (partnerIndex, extraId, field, value) => {
    const updated = [...partners];
    const extras = updated[partnerIndex].extraIncomes.map(item => {
      if (item.id === extraId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updated[partnerIndex].extraIncomes = extras;
    onUpdatePartner(updated);
  };

  const handleRemoveExtraIncome = (partnerIndex, extraId) => {
    const updated = [...partners];
    updated[partnerIndex].extraIncomes = updated[partnerIndex].extraIncomes.filter(item => item.id !== extraId);
    onUpdatePartner(updated);
  };

  return (
    <section className="section-panel">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <User className="icon-md text-primary inline-icon" /> Partner Incomes & ATO Tax Picture
          </h2>
          <p className="app-subtitle">
            Enter each partner's gross salary, super guarantee, and extra income. ATO income tax & Medicare levy are calculated automatically.
          </p>
        </div>
      </div>

      <div className="partners-grid">
        {partners.map((partner, index) => {
          const calc = index === 0 ? p1Calc : p2Calc;

          return (
            <div key={partner.id || index} className="partner-card">
              {/* Partner Header */}
              <div className="partner-header">
                <span className="partner-avatar">{partner.initials || `P${index + 1}`}</span>
                <input
                  type="text"
                  className="partner-title-input"
                  value={partner.name}
                  onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                  placeholder={`Partner ${index + 1}`}
                />
              </div>

              {/* Primary Salary Input */}
              <div className="form-group">
                <label className="form-label">
                  Primary Gross Salary (excluding super)
                </label>
                <div className="form-input-row">
                  <div className="input-prefix-wrapper flex-2">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      className="input-field"
                      value={partner.salary}
                      onChange={(e) => handlePartnerChange(index, 'salary', Math.max(0, Number(e.target.value) || 0))}
                      placeholder="0"
                    />
                  </div>
                  <select
                    className="select-field flex-1"
                    value={partner.salaryFrequency || 'annual'}
                    onChange={(e) => handlePartnerChange(index, 'salaryFrequency', e.target.value)}
                  >
                    <option value="annual">per year</option>
                    <option value="monthly">per month</option>
                    <option value="fortnightly">per fortnight</option>
                    <option value="weekly">per week</option>
                  </select>
                </div>
              </div>

              {/* Superannuation Setup */}
              <div className="super-config-box">
                <div className="super-header">
                  <span className="form-label">
                    <Lock className="icon-xs inline-icon text-info" /> Superannuation (Wealth Fund)
                  </span>
                  <div className="super-pill-toggle">
                    <button
                      type="button"
                      className={`pill-option ${partner.superMode !== 'fixed' ? 'active' : ''}`}
                      onClick={() => handlePartnerChange(index, 'superMode', 'rate')}
                    >
                      Rate (%)
                    </button>
                    <button
                      type="button"
                      className={`pill-option ${partner.superMode === 'fixed' ? 'active' : ''}`}
                      onClick={() => handlePartnerChange(index, 'superMode', 'fixed')}
                    >
                      Fixed ($)
                    </button>
                  </div>
                </div>

                {partner.superMode === 'fixed' ? (
                  <div className="form-input-row">
                    <div className="input-prefix-wrapper flex-2">
                      <span className="input-prefix">$</span>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        value={partner.superFixedAmount || 0}
                        onChange={(e) => handlePartnerChange(index, 'superFixedAmount', Math.max(0, Number(e.target.value) || 0))}
                      />
                    </div>
                    <select
                      className="select-field flex-1"
                      value={partner.superFixedFrequency || 'annual'}
                      onChange={(e) => handlePartnerChange(index, 'superFixedFrequency', e.target.value)}
                    >
                      <option value="annual">per year</option>
                      <option value="monthly">per month</option>
                    </select>
                  </div>
                ) : (
                  <div className="super-rate-row">
                    <div className="input-prefix-wrapper flex-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        className="input-field"
                        value={partner.superRate || ATO_TAX_CONFIG.defaultSuperGuaranteeRate}
                        onChange={(e) => handlePartnerChange(index, 'superRate', Math.max(0, Number(e.target.value) || 0))}
                      />
                      <span className="input-suffix">%</span>
                    </div>
                    <span className="super-calc-badge">
                      = {formatMoney(calc?.superMonthly || 0)} /mo
                    </span>
                  </div>
                )}
              </div>

              {/* Extra Incomes */}
              <div className="extra-incomes-section">
                <div className="extra-incomes-header">
                  <span className="form-label">Extra Incomes (Rental, Dividends)</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleAddExtraIncome(index)}
                  >
                    <Plus className="icon-xs" /> Add Line
                  </button>
                </div>

                {partner.extraIncomes && partner.extraIncomes.length > 0 ? (
                  <div className="extra-incomes-list">
                    {partner.extraIncomes.map((extra) => (
                      <div key={extra.id} className="extra-income-row">
                        <input
                          type="text"
                          className="input-field extra-label-input"
                          value={extra.label}
                          onChange={(e) => handleUpdateExtraIncome(index, extra.id, 'label', e.target.value)}
                          placeholder="Label"
                        />
                        <div className="input-prefix-wrapper extra-amount-input">
                          <span className="input-prefix">$</span>
                          <input
                            type="number"
                            min="0"
                            className="input-field"
                            value={extra.amount}
                            onChange={(e) => handleUpdateExtraIncome(index, extra.id, 'amount', Math.max(0, Number(e.target.value) || 0))}
                          />
                        </div>
                        <select
                          className="select-field extra-freq-select"
                          value={extra.frequency}
                          onChange={(e) => handleUpdateExtraIncome(index, extra.id, 'frequency', e.target.value)}
                        >
                          <option value="monthly">/ mo</option>
                          <option value="annual">/ yr</option>
                          <option value="fortnightly">/ fortnight</option>
                          <option value="weekly">/ wk</option>
                        </select>
                        <button
                          type="button"
                          className="btn-icon-danger"
                          onClick={() => handleRemoveExtraIncome(index, extra.id)}
                          title="Remove line"
                        >
                          <Trash2 className="icon-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-extra-incomes">
                    No extra incomes. Click "+ Add Line" for side business, rental, or dividend income.
                  </div>
                )}
              </div>

              {/* Partner Take-Home Pay Breakdown Card */}
              {calc && (() => {
                const grossVal = calc.taxableIncomeMonthly || 1;
                const taxPct = Math.min(100, Math.max(0, Math.round((calc.totalTaxMonthly / grossVal) * 100)));
                const takeHomePct = Math.max(0, 100 - taxPct);

                return (
                  <div className="partner-calc-summary">
                    <div className="summary-row">
                      <span className="summary-label">Gross Income:</span>
                      <span className="summary-value">{formatMoney(calc.taxableIncomeMonthly)} /mo</span>
                    </div>

                    {/* Visual Ratio Progress Bar */}
                    <div className="partner-tax-bar">
                      <div className="tax-bar-labels">
                        <span className="text-warning">Tax & Levy ({taxPct}%)</span>
                        <span className="text-surplus">Take-Home ({takeHomePct}%)</span>
                      </div>
                      <div className="progress-bar-track compact-track">
                        <div className="progress-bar-fill fill-expenses" style={{ width: `${taxPct}%` }} title={`Tax & Medicare Levy: ${taxPct}%`} />
                        <div className="progress-bar-fill fill-retained" style={{ width: `${takeHomePct}%` }} title={`Take-Home Cash: ${takeHomePct}%`} />
                      </div>
                    </div>

                    <div className="summary-row text-muted-row">
                      <span className="summary-label">
                        Estimated ATO Tax & Medicare:{' '}
                        <Tooltip text={`Stage 3 Tax & 2% Medicare Levy based on $${Math.round(calc.taxableIncomeAnnual).toLocaleString()}/yr taxable income`} />
                      </span>
                      <span className="summary-value text-warning">-{formatMoney(calc.totalTaxMonthly)} /mo</span>
                    </div>
                    <div className="summary-row summary-usable-row">
                      <span className="summary-label-highlight">Take-Home Pay:</span>
                      <span className="summary-value-highlight text-surplus">{formatMoney(calc.spendableIncomeMonthly)} /mo</span>
                    </div>
                    <div className="summary-annual-sub">
                      ({formatMoney(calc.spendableIncomeAnnual)} / year spendable post-tax)
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </section>
  );
}
