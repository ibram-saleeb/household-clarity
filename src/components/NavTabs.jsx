import React from 'react';

export function NavTabs({ activeTab, onTabChange, scenarioMode }) {
  const tabs = [
    { id: 'overview', label: 'Month' },
    { id: 'expenses', label: 'Spending' },
    { id: 'income', label: 'Incomes' },
    { id: 'scenario', label: 'What-if' }
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;
  const pillWidthPct = 100 / tabs.length;
  const pillShift = `${safeIndex * 100}%`;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="desktop-nav-tabs" aria-label="Main Navigation">
        <div className="desktop-nav-container">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-button ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Floating 56px Glass Pill Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <div className="mobile-nav-pill-container">
          <div
            className="mobile-nav-sliding-pill"
            style={{
              width: `calc(${pillWidthPct}% - 4px)`,
              transform: `translateX(${safeIndex * 100}%)`
            }}
          />
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                <span className="mobile-nav-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
