import React from 'react';

export function DesktopSidebar({
  activeTab,
  onTabChange,
  partners,
  trialDaysLeft = 14,
  onOpenExport
}) {
  const p1Name = partners?.[0]?.name || 'Alex';
  const p2Name = partners?.[1]?.name || 'Sam';

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'income', label: 'Income' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'scenario', label: 'What-if' }
  ];

  return (
    <aside className="desktop-sidebar" aria-label="Desktop Sidebar Rail">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <div className="sidebar-dot" />
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-title">Tandem</div>
          <div className="sidebar-brand-sub">{p1Name} &amp; {p2Name}</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <span className="sidebar-nav-dot" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Meta & Trial */}
      <div className="sidebar-footer">
        <div className="sidebar-trial-label">Trial · {trialDaysLeft} days left</div>
        <div className="sidebar-trial-track">
          <div className="sidebar-trial-progress" style={{ width: '53%' }} />
        </div>
        <button
          type="button"
          className="sidebar-meta-btn"
          onClick={onOpenExport}
        >
          v1.2.0 · Export &amp; backup
        </button>
      </div>
    </aside>
  );
}
