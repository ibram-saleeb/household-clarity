import React from 'react';

export function NavTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'overview', label: 'Month' },
    { id: 'expenses', label: 'Spending' },
    { id: 'scenario', label: 'What-if' }
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-nav-pill-container">
        <div
          className="mobile-nav-sliding-pill"
          style={{
            width: 'calc((100% - 12px) / 3)',
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
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
