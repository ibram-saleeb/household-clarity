import React from 'react';
import { ShieldCheck, RefreshCw, Info, Zap, Trash2 } from 'lucide-react';
import { ATO_TAX_CONFIG } from '../config/atoTaxConfig';

export function Header({ 
  scenarioMode, 
  onToggleScenario, 
  onOpenAssumptions, 
  onResetDefaults, 
  onClearAll 
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-section">
          <div className="logo-badge">
            <span className="logo-icon">⚖️</span>
          </div>
          <div>
            <h1 className="app-title">Tandem</h1>
            <p className="app-subtitle">
              Household financial clarity & live what-if stress-testing for dual-income couples
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenAssumptions}
            title="View ATO tax rates, superannuation rules and math assumptions"
          >
            <ShieldCheck className="icon-sm" />
            <span>ATO Rates & Math</span>
          </button>

          <button 
            className={`btn btn-sm ${scenarioMode ? 'btn-scenario-active' : 'btn-outline'}`}
            onClick={onToggleScenario}
            title="Toggle Live What-If Scenario Mode"
          >
            <Zap className="icon-sm" />
            <span>{scenarioMode ? 'What-If Mode ACTIVE' : 'Test What-If Scenario'}</span>
          </button>

          <button 
            className="btn btn-ghost btn-sm"
            onClick={onResetDefaults}
            title="Reset inputs to realistic dual-income sample data"
          >
            <RefreshCw className="icon-sm" />
            <span>Reset Sample Data</span>
          </button>

          <button 
            className="btn btn-ghost btn-sm text-danger"
            onClick={onClearAll}
            title="Clear all partner incomes and expenses"
          >
            <Trash2 className="icon-sm" />
          </button>
        </div>
      </div>
      
      <div className="tax-banner">
        <span className="tax-tag">
          <Info className="icon-xs inline-icon" /> Official Tax Rules: {ATO_TAX_CONFIG.financialYearLabel} (Stage 3 Rates + 2% Medicare Levy + 12% SG)
        </span>
        <span className="tax-disclaimer">
          Spendable income excludes super (transferred directly to super funds). Calculations are estimates.
        </span>
      </div>
    </header>
  );
}
