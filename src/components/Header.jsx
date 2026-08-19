import React from 'react';
import { ShieldCheck, RefreshCw, Zap, Trash2, Download, MessageSquarePlus, Sparkles, Lock } from 'lucide-react';
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
  const isExpired = trialState?.isExpired;
  const daysRemaining = trialState?.daysRemaining ?? 14;

  return (
    <header className="app-header">
      <div className="header-container">
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

        <div className="header-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenFeedback}
            title="Request features and share feedback"
            style={{ border: '1px solid rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
          >
            <MessageSquarePlus className="icon-sm" />
            <span className="btn-label-desktop">Feedback & Ideas</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenExport}
            title="Backup, export, or restore your household data snapshot"
          >
            <Download className="icon-sm" />
            <span className="btn-label-desktop">Backup & Export</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenAssumptions}
            title="View ATO tax rates, superannuation rules and math assumptions"
          >
            <ShieldCheck className="icon-sm" />
            <span className="btn-label-desktop">ATO Rates & Math</span>
          </button>

          <button 
            className={`btn btn-sm ${scenarioMode ? 'btn-scenario-active' : 'btn-outline'}`}
            onClick={onToggleScenario}
            title="Toggle Live What-If Scenario Mode"
          >
            <Zap className="icon-sm" />
            <span className="btn-label-desktop">{scenarioMode ? 'What-If Active' : 'Test What-If'}</span>
          </button>

          <button 
            className="btn btn-ghost btn-sm"
            onClick={onResetDefaults}
            title="Reset inputs to realistic dual-income sample data"
          >
            <RefreshCw className="icon-sm" />
            <span className="btn-label-desktop">Reset</span>
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
    </header>
  );
}
