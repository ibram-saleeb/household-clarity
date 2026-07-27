import React from 'react';
import { Info } from 'lucide-react';

/**
 * Lightweight, accessible tooltip component displaying an Info icon with a hover/focus bubble.
 */
export function Tooltip({ text, children, position = 'top' }) {
  return (
    <span className={`tooltip-wrapper tooltip-pos-${position}`}>
      {children || <Info className="icon-xs inline-icon tooltip-icon" />}
      <span className="tooltip-bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
