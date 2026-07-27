import React from 'react';
import { LayoutDashboard, Wallet, CreditCard, Zap } from 'lucide-react';

export function NavTabs({ activeTab, onTabChange, scenarioMode }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: Wallet },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'scenario', label: 'What-If', icon: Zap, badge: scenarioMode ? 'ACTIVE' : null }
  ];

  return (
    <>
      {/* Desktop & Tablet Segmented Tab Bar */}
      <nav className="nav-tabs-wrapper desktop-nav-tabs" aria-label="Main Navigation">
        <div className="nav-tabs-container">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab-button ${isActive ? 'active' : ''} ${tab.id === 'scenario' && scenarioMode ? 'tab-scenario-active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="nav-tab-icon" />
                <span>{tab.id === 'income' ? 'Income & Salaries' : tab.id === 'scenario' ? 'What-If Scenario' : tab.label}</span>
                {tab.badge && <span className="tab-pill-badge">{tab.badge}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Monzo/Copilot Style Mobile Floating Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''} ${tab.id === 'scenario' && scenarioMode ? 'scenario-active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="mobile-nav-icon" />
              <span className="mobile-nav-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
