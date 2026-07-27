import React from 'react';
import { LayoutDashboard, Wallet, CreditCard, Zap } from 'lucide-react';

export function NavTabs({ activeTab, onTabChange, scenarioMode }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'income', label: 'Income & Salaries', icon: Wallet },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'scenario', label: 'What-If Scenario', icon: Zap, badge: scenarioMode ? 'ACTIVE' : null }
  ];

  return (
    <nav className="nav-tabs-wrapper" aria-label="Main Navigation">
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
              <span>{tab.label}</span>
              {tab.badge && <span className="tab-pill-badge">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
