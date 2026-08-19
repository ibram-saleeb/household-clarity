import React, { useState } from 'react';
import { Sparkles, Check, ShieldCheck, Mail, ArrowRight, RotateCcw, X } from 'lucide-react';

export function PaywallModal({ isOpen, onClose, trialState, allowDismiss = false }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleJoinWaitlist = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const existing = JSON.parse(localStorage.getItem('tandem_waitlist_leads') || '[]');
      existing.push({
        email,
        submittedAt: new Date().toISOString(),
        source: 'paywall_modal'
      });
      localStorage.setItem('tandem_waitlist_leads', JSON.stringify(existing));
    } catch {
      // Ignore storage errors
    }

    setIsSubmitted(true);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText('https://project-tandem.pages.dev');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const upcomingFeatures = [
    { title: 'Couples Cloud Sync', desc: 'Connect Partner 1 & Partner 2 devices in real-time.' },
    { title: 'Unlimited What-If Scenarios', desc: 'Simulate property purchases, parental leave & career pivots.' },
    { title: 'PDF Executive Financial Reports', desc: 'Bank-ready household cashflow statements for mortgage applications.' },
    { title: 'Native iOS & Android App', desc: 'First-class mobile experience on the Apple App Store & Google Play.' }
  ];

  return (
    <div className="modal-backdrop paywall-backdrop" onClick={allowDismiss ? onClose : undefined}>
      <div
        className="modal-content glass-card paywall-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {allowDismiss && (
          <button className="btn-icon paywall-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        )}

        <div className="paywall-header">
          <div className="paywall-icon-badge">
            <Sparkles className="paywall-sparkle-icon" size={28} />
          </div>
          <span className="paywall-tag">PREMIUM EARLY ACCESS</span>
          <h2 className="paywall-title">Full App Launching Soon</h2>
          <p className="paywall-subtitle">
            Your <strong>14-day free trial</strong> has concluded. We are putting the final touches on our full cloud-synchronized version!
          </p>
        </div>

        <div className="paywall-body">
          {/* Waitlist Capture Card */}
          <div className="paywall-waitlist-card">
            {isSubmitted ? (
              <div className="waitlist-success">
                <div className="success-icon-wrap">
                  <Check size={24} />
                </div>
                <h3>You are on the VIP Launch List!</h3>
                <p>We'll notify you the moment the full app goes live and apply your <strong>50% Early Supporter Discount</strong>.</p>
                <button className="btn btn-secondary btn-sm" onClick={handleCopyShare}>
                  {isCopied ? 'Link Copied!' : 'Share Project Tandem'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="waitlist-form">
                <div className="waitlist-offer">
                  <Mail size={18} className="text-emerald" />
                  <span>Join the VIP waitlist to get <strong>50% off lifetime access</strong> at launch:</span>
                </div>
                <div className="waitlist-input-group">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field waitlist-input"
                  />
                  <button type="submit" className="btn btn-primary waitlist-submit-btn">
                    <span>Notify Me</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Premium Features List */}
          <div className="paywall-features-section">
            <h4 className="paywall-features-heading">What's coming in the Full Version:</h4>
            <div className="paywall-features-grid">
              {upcomingFeatures.map((feat, idx) => (
                <div key={idx} className="paywall-feature-item">
                  <div className="paywall-feature-check">
                    <Check size={14} />
                  </div>
                  <div>
                    <strong className="paywall-feature-title">{feat.title}</strong>
                    <p className="paywall-feature-desc">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Safety Reassurance */}
          <div className="paywall-safety-note">
            <ShieldCheck size={18} className="text-emerald" />
            <span>All your custom salaries, expenses, and scenarios remain securely saved on this device.</span>
          </div>

          {/* Developer / Testing Controls */}
          {trialState && (
            <div className="paywall-dev-bar">
              <span className="dev-label">Developer / Testing Override:</span>
              <div className="dev-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => {
                    trialState.resetTrial();
                    onClose();
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset 14-Day Trial</span>
                </button>
                {allowDismiss === false && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={onClose}
                  >
                    <span>Preview App Mode</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
