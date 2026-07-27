import React from 'react';
import { HeartHandshake, ShieldCheck, Sparkles, Lightbulb } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';

export function HarmonyCoachCard({ data, savingsTargetMonthly, partners }) {
  const current = data?.baseline;
  if (!current) return null;

  const netMonthly = current.netCashflowMonthly || 0;
  const usableMonthly = current.combinedUsableMonthly || 1;
  const expensesMonthly = current.totalExpensesMonthly || 0;
  const superMonthly = current.totalSuperMonthly || 0;

  const expenseRatio = Math.round((expensesMonthly / usableMonthly) * 100);
  const p1Name = partners?.[0]?.name || 'Partner 1';
  const p2Name = partners?.[1]?.name || 'Partner 2';

  let Icon = HeartHandshake;
  let statusClass = 'coach-healthy';
  let title = 'Financial Harmony Outlook';
  let message = '';
  let tip = '';

  if (netMonthly >= usableMonthly * 0.3) {
    Icon = Sparkles;
    statusClass = 'coach-excellent';
    title = 'Outstanding Cashflow Harmony!';
    message = `${p1Name} and ${p2Name} are retaining ${100 - expenseRatio}% of your take-home pay (${formatMoney(netMonthly)}/mo buffer). Your household finances have strong momentum.`;
    tip = `Tip: Consider allocating a portion of your ${formatMoney(netMonthly)} monthly surplus toward high-interest savings or additional super contributions.`;
  } else if (netMonthly > 0) {
    Icon = ShieldCheck;
    statusClass = 'coach-healthy';
    title = 'Balanced & Sustainable Position';
    message = `${p1Name} and ${p2Name} have a comfortable ${formatMoney(netMonthly)} monthly buffer after paying all household outgoings (${expenseRatio}% of take-home pay spent).`;
    tip = `Tip: Setting aside ${formatMoney(Math.min(netMonthly, savingsTargetMonthly || 500))}/mo in reserves builds a 3-month emergency safety net.`;
  } else {
    Icon = Lightbulb;
    statusClass = 'coach-attention';
    title = 'Cashflow Alignment Needed';
    message = `Currently, household outgoings exceed total take-home pay by ${formatMoney(Math.abs(netMonthly))}/mo.`;
    tip = `Tip: Open the "What-If Scenario" tab to simulate lowering a major expense line or boosting side income without disrupting your lifestyle.`;
  }

  return (
    <div className={`harmony-coach-card ${statusClass}`}>
      <div className="coach-header">
        <div className="coach-icon-badge">
          <Icon className="icon-sm" />
        </div>
        <div>
          <h3 className="coach-title">{title}</h3>
          <p className="coach-message">{message}</p>
        </div>
      </div>

      <div className="coach-tip-box">
        <Lightbulb className="icon-xs inline-icon text-warning" /> <span>{tip}</span>
      </div>

      <div className="coach-wealth-note">
        🛡️ Plus, you're quietly building <strong>{formatMoney(superMonthly * 12)}/year</strong> together in protected superannuation wealth.
      </div>
    </div>
  );
}
