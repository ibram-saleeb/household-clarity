/**
 * Formats a numeric value into AUD currency format ($X,XXX.XX).
 * 
 * @param {number|string} amount - The numeric amount to format
 * @param {boolean} forceSign - If true, explicitly prepends '+' for positive numbers
 * @returns {string} Formatted currency string
 */
export function formatMoney(amount, forceSign = false) {
  const val = Number(amount) || 0;
  const absFormatted = Math.abs(val).toLocaleString('en-AU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  if (val < 0) {
    return `-$${absFormatted}`;
  }
  if (val > 0 && forceSign) {
    return `+$${absFormatted}`;
  }
  return `$${absFormatted}`;
}

/**
 * Formats a decimal/percentage number into a standard percentage string.
 * 
 * @param {number|string} rate - The percentage value (e.g., 2.0)
 * @param {number} decimals - Number of decimal places (default 1)
 * @returns {string} Formatted percentage string
 */
export function formatPercent(rate, decimals = 1) {
  const val = Number(rate) || 0;
  return `${val.toFixed(decimals)}%`;
}
