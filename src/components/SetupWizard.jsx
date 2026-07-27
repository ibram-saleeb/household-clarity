import React, { useState } from 'react';
import { Sparkles, CheckCircle, ArrowRight, ChevronDown, ChevronUp, X } from 'lucide-react';

export function SetupWizard({ activeTab, onTabChange, hasIncomes, hasExpenses, onDismiss }) {
  const [collapsed, setCollapsed] = useState(false);

  const steps = [
    {
      id: 'income',
      stepNumber: 1,
      title: 'Partner Incomes',
      desc: 'Enter salaries & tax setups for both partners',
      completed: hasIncomes,
      tab: 'income'
    },
    {
      id: 'expenses',
      stepNumber: 2,
      title: 'Household Outgoings',
      desc: 'Itemise rent, groceries, and regular bills',
      completed: hasExpenses,
      tab: 'expenses'
    },
    {
      id: 'overview',
      stepNumber: 3,
      title: 'Financial Harmony',
      desc: 'See spendable cashflow & test What-If scenarios',
      completed: hasIncomes && hasExpenses,
      tab: 'overview'
    }
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="setup-wizard-card">
      <div className="setup-wizard-header">
        <div className="wizard-title-group">
          <span className="wizard-badge">
            <Sparkles className="icon-xs inline-icon" /> Guided Setup Assistant
          </span>
          <span className="wizard-progress-text">
            Step {completedCount} of 3 ({progressPct}% Complete)
          </span>
        </div>

        <div className="wizard-actions">
          <button
            className="btn-icon-subtle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand setup guide' : 'Collapse setup guide'}
          >
            {collapsed ? <ChevronDown className="icon-xs" /> : <ChevronUp className="icon-xs" />}
          </button>
          <button
            className="btn-icon-subtle"
            onClick={onDismiss}
            title="Dismiss setup guide"
          >
            <X className="icon-xs" />
          </button>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="wizard-progress-track">
        <div className="wizard-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {!collapsed && (
        <div className="wizard-steps-grid">
          {steps.map((step) => {
            const isActiveStep = activeTab === step.tab;
            return (
              <div
                key={step.id}
                className={`wizard-step-card ${step.completed ? 'completed' : ''} ${isActiveStep ? 'active-step' : ''}`}
                onClick={() => onTabChange(step.tab)}
              >
                <div className="step-header">
                  <span className="step-number">
                    {step.completed ? (
                      <CheckCircle className="icon-xs text-surplus" />
                    ) : (
                      `0${step.stepNumber}`
                    )}
                  </span>
                  <span className="step-title">{step.title}</span>
                </div>
                <p className="step-desc">{step.desc}</p>

                <div className="step-footer">
                  <span className="step-action-label">
                    {step.completed ? 'Review' : 'Set Up'} <ArrowRight className="icon-xs inline-icon" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
