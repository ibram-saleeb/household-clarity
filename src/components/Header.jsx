import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Zap, Trash2, Download, MessageSquarePlus, Sparkles, Lock, MoreHorizontal, ChevronDown } from 'lucide-react';
import { TandemLogo } from './TandemLogo';
import { APP_VERSION, APP_NAME } from '../config/version.js';

export function Header({ 
  scenarioMode, 
  onToggleScenario, 
  onOpenAssumptions, 
  onOpenExport,
  onOpenFeedback,
  onResetDefaults, 
  onClearAll,
  trialState,
  onOpenPaywall
}) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isExpired = trialState?.isExpired;
  const daysRemaining = trialState?.daysRemaining ?? 14;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Section */}
        <div className="brand-section">
          <TandemLogo size="md" />
          <div>
            <div className="brand-title-row">
              <h1 className="app-title">{APP_NAME}</h1>
              <span className="version-pill" title={`Strict Release Version v${APP_VERSION}`}>v{APP_VERSION}</span>
              
              {/* 14-Day Free Trial Status Pill */}
              {trialState && (
                <button
                  type="button"
                  onClick={onOpenPaywall}
                  className={`trial-status-pill ${isExpired ? 'expired' : 'active'}`}
                  title={isExpired ? 'Your 14-day free access has concluded. Click to learn more.' : `${daysRemaining} of 14 free trial days remaining.`}
                >
                  {isExpired ? (
                    <>
                      <Lock size={12} />
                      <span>Trial Expired</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      <span>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="app-subtitle">Financial harmony in tandem.</p>
          </div>
        </div>

        {/* Streamlined Header Actions */}
        <div className="header-actions">
          {/* What-If Live Stress Test Toggle */}
          <button 
            className={`btn btn-sm ${scenarioMode ? 'btn-scenario-active' : 'btn-secondary'}`}
            onClick={onToggleScenario}
            title="Toggle Live What-If Scenario Mode"
          >
            <Zap className="icon-sm" />
            <span className="btn-label-desktop">{scenarioMode ? 'What-If Active' : 'Test What-If'}</span>
          </button>

          {/* Backup & Export (Primary Utility) */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenExport}
            title="Backup, export, or restore your household data snapshot"
          >
            <Download className="icon-sm" />
            <span className="btn-label-desktop">Backup & Export</span>
          </button>

          {/* Feedback & Ideas */}
          <button 
            className="btn btn-secondary btn-sm feedback-pill-btn"
            onClick={onOpenFeedback}
            title="Request features and share feedback"
          >
            <MessageSquarePlus className="icon-sm text-purple" />
            <span className="btn-label-desktop">Feedback & Ideas</span>
          </button>

          {/* Sleek Tools & Settings Popover Dropdown */}
          <div className="header-dropdown-wrap" ref={dropdownRef}>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-icon-round"
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              title="More Actions & Tools"
              aria-label="More tools"
            >
              <MoreHorizontal size={18} />
            </button>

            {isToolsOpen && (
              <div className="header-dropdown-menu glass-card">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenAssumptions();
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>ATO Rates & Math</span>
                </button>

                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setIsToolsOpen(false);
                    onResetDefaults();
                  }}
                >
                  <RefreshCw size={16} />
                  <span>Reset Sample Data</span>
                </button>

                <div className="dropdown-divider" />

                <button 
                  className="dropdown-item text-danger"
                  onClick={() => {
                    setIsToolsOpen(false);
                    onClearAll();
                  }}
                >
                  <Trash2 size={16} />
                  <span>Clear All Inputs</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
