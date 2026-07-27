import React from 'react';
import { User, Plus, Trash2, HelpCircle, DollarSign, Calculator, Lock } from 'lucide-react';
import { formatMoney } from './HeroDashboard';
import { ATO_TAX_CONFIG } from '../config/atoTaxConfig';

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
      label: 'Rental / Dividend Income',
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
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <User className="icon-md inline-icon" /> Partner Incomes & Tax Picture
          </h2>
          <p className="section-subtitle">
            Enter each partner's gross salary, superannuation setup, and extra income lines. Tax is computed using official ATO resident tax brackets.
          </p>
        </div>
      </div>

      <div className="partners-grid">
        {partners.map((partner, index) => {
          const calc = index === 0 ? p1Calc : p2Calc;

          return (
            <div key={partner.id || index} className="partner-card">
              {/* Partner Header */}
              <div className="partner-card-header">
                <div className="partner-identity">
                  <span className="partner-avatar-badge">{partner.initials || `P${index + 1}`}</span>
                  <input
                    type="text"
                    className="input-field input-ghost partner-name-input"
                    value={partner.name}
                    onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                    placeholder={`Partner ${index + 1}`}
                  />
                </div>
                <div className="partner-initials-box">
                  <label className="label-xs">Initials:</label>
                  <input
                    type="text"
                    maxLength={3}
                    className="input-field input-xs partner-initials-input"
                    value={partner.initials}
                    onChange={(e) => handlePartnerChange(index, 'initials', e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              {/* Primary Salary Input */}
              <div className="form-group">
                <label className="input-label">
                  Primary Gross Salary (excluding super)
                </label>
                <div className="input-with-select">
                  <div className="input-prefix-wrapper">
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
                    className="input-select"
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

              {/* Superannuation Configuration */}
              <div className="super-config-box">
                <div className="super-header">
                  <span className="super-title">
                    <Lock className="icon-xs inline-icon text-info" /> Superannuation (Non-Cash Fund)
                  </span>
                  <div className="super-mode-toggle">
                    <button
                      className={`btn-toggle-sm ${partner.superMode !== 'fixed' ? 'active' : ''}`}
                      onClick={() => handlePartnerChange(index, 'superMode', 'rate')}
                    >
                      Rate (%)
                    </button>
                    <button
                      className={`btn-toggle-sm ${partner.superMode === 'fixed' ? 'active' : ''}`}
                      onClick={() => handlePartnerChange(index, 'superMode', 'fixed')}
                    >
                      Fixed ($)
                    </button>
                  </div>
                </div>

                {partner.superMode === 'fixed' ? (
                  <div className="input-with-select">
                    <div className="input-prefix-wrapper">
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
                      className="input-select"
                      value={partner.superFixedFrequency || 'annual'}
                      onChange={(e) => handlePartnerChange(index, 'superFixedFrequency', e.target.value)}
                    >
                      <option value="annual">per year</option>
                      <option value="monthly">per month</option>
                    </select>
                  </div>
                ) : (
                  <div className="super-rate-input-row">
                    <div className="input-prefix-wrapper">
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
                    <span className="super-calculated-badge">
                      = {formatMoney(calc?.superMonthly || 0)} / month
                    </span>
                  </div>
                )}
                <p className="super-note">
                  Super is excluded from spendable cash and tracked separately as retirement wealth.
                </p>
              </div>

              {/* Extra Income Lines */}
              <div className="extra-incomes-section">
                <div className="extra-incomes-header">
                  <span className="extra-title">Extra Incomes (Dividends, Rental, Bonus)</span>
                  <button
                    className="btn btn-ghost-sm"
                    onClick={() => handleAddExtraIncome(index)}
                  >
                    <Plus className="icon-xs inline-icon" /> Add Line
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
                          placeholder="Income Label"
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
                          className="input-select extra-freq-select"
                          value={extra.frequency}
                          onChange={(e) => handleUpdateExtraIncome(index, extra.id, 'frequency', e.target.value)}
                        >
                          <option value="monthly">/ mo</option>
                          <option value="annual">/ yr</option>
                          <option value="fortnightly">/ fortnite</option>
                          <option value="weekly">/ wk</option>
                        </select>
                        <button
                          className="btn-icon-danger"
                          onClick={() => handleRemoveExtraIncome(index, extra.id)}
                          title="Remove extra income line"
                        >
                          <Trash2 className="icon-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-extra-incomes">
                    No extra incomes added. Click "+ Add Line" for rental, side business, or dividend income.
                  </div>
                )}
              </div>

              {/* Calculated Results Summary Card */}
              {calc && (
                <div className="partner-calc-summary">
                  <div className="summary-row">
                    <span className="summary-label">Gross Taxable Income:</span>
                    <span className="summary-value">{formatMoney(calc.taxableIncomeMonthly)} / mo</span>
                  </div>
                  <div className="summary-row text-muted-row">
                    <span className="summary-label">ATO Income Tax & Medicare (Est.):</span>
                    <span className="summary-value text-warning">-{formatMoney(calc.totalTaxMonthly)} / mo</span>
                  </div>
                  <div className="summary-row summary-usable-row">
                    <span className="summary-label-highlight">Usable Spendable Cash:</span>
                    <span className="summary-value-highlight">{formatMoney(calc.spendableIncomeMonthly)} / mo</span>
                  </div>
                  <div className="summary-annual-sub">
                    ({formatMoney(calc.spendableIncomeAnnual)} / year spendable post-tax)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
