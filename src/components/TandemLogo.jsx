import React from 'react';

/**
 * Custom Vector SVG Logo Component for Tandem.
 * Features two interlocking, synchronized arcs forming a stylized 'T' and infinity balance mark.
 */
export function TandemLogo({ size = 'md', className = '', showText = false }) {
  const dimensions = {
    sm: { width: 28, height: 28 },
    md: { width: 36, height: 36 },
    lg: { width: 48, height: 48 }
  };

  const { width, height } = dimensions[size] || dimensions.md;

  return (
    <div className={`tandem-logo-wrapper ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="tandem-logo-svg"
      >
        <defs>
          <linearGradient id="tandemGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="tandemGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Emerald Arc (Partner 1) */}
        <path
          d="M 28 50 C 28 32, 42 22, 58 22 C 74 22, 84 34, 84 50 C 84 66, 72 78, 54 78"
          stroke="url(#tandemGrad1)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#logoGlow)"
        />

        {/* Interlocking Indigo Arc (Partner 2) */}
        <path
          d="M 72 50 C 72 68, 58 78, 42 78 C 26 78, 16 66, 16 50 C 16 34, 28 22, 46 22"
          stroke="url(#tandemGrad2)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#logoGlow)"
        />

        {/* Center Synchronized Core Dot */}
        <circle cx="50" cy="50" r="7" fill="#F8FAFC" />
      </svg>

      {showText && <span className="tandem-brand-name">Tandem</span>}
    </div>
  );
}
