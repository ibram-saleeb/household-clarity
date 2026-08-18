import React, { useState } from 'react';
import { MessageSquarePlus, X, Check, Copy, Star, Send } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose }) {
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [usefulness, setUsefulness] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const featureOptions = [
    { id: 'rate_hike', label: '🏠 Mortgage Rate Hike Stress-Tester (+0.25% to +3%)' },
    { id: 'hecs_payoff', label: '🎓 HECS/HELP Indexation & Debt Freedom Countdown' },
    { id: 'parental_leave', label: '👶 Parental Leave & Single-Income Buffer Calculator' },
    { id: 'pdf_export', label: '📄 PDF Executive Household Report Exporter' },
    { id: 'super_co_contrib', label: '💰 Superannuation Salary Sacrifice Optimizer' }
  ];

  const toggleFeature = (id) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackPayload = {
      timestamp: new Date().toISOString(),
      usefulness,
      selectedFeatures,
      comment
    };

    // Save to local storage for local-first telemetry
    try {
      const existing = JSON.parse(localStorage.getItem('tandem_user_feedback') || '[]');
      existing.push(feedbackPayload);
      localStorage.setItem('tandem_user_feedback', JSON.stringify(existing));
    } catch {
      // Ignore storage errors
    }

    setSubmitted(true);
  };

  const handleCopyFeedback = () => {
    const text = `Tandem App Feedback:\n- Rating: ${usefulness}/5\n- Desired Features: ${selectedFeatures.join(', ')}\n- Comments: ${comment}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-card feedback-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessageSquarePlus className="text-emerald" size={24} />
            <div>
              <h2 className="modal-title">Shape Project Tandem</h2>
              <p className="modal-subtitle">What features should we build next?</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div className="feedback-success-banner" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}
              >
                <Check size={32} />
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Thank you for your feedback!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Your input directly shapes our v1.1 engineering roadmap.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={handleCopyFeedback}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied to Clipboard' : 'Copy Feedback Summary'}
                </button>
                <button className="btn btn-primary" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Vote on Features You Want Most:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {featureOptions.map((feat) => {
                    const isSelected = selectedFeatures.includes(feat.id);
                    return (
                      <button
                        type="button"
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`chip-button ${isSelected ? 'active' : ''}`}
                        style={{
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '8px',
                          border: isSelected
                            ? '1px solid var(--accent-emerald)'
                            : '1px solid rgba(255,255,255,0.1)',
                          background: isSelected
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(255,255,255,0.03)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          fontSize: '0.875rem'
                        }}
                      >
                        <span style={{ marginRight: '0.5rem' }}>{isSelected ? '✓' : '+'}</span>
                        {feat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  How useful is Tandem for your household? ({usefulness} / 5)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUsefulness(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: star <= usefulness ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <Star size={24} fill={star <= usefulness ? '#f59e0b' : 'transparent'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" htmlFor="feedback-comment" style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Any specific scenarios or feedback? (Optional)
                </label>
                <textarea
                  id="feedback-comment"
                  className="input-field"
                  rows={3}
                  placeholder="e.g. Would love to model buying an investment property or changing super sacrifice rates..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  Submit Feedback
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
