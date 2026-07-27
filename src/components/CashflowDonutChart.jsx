import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatMoney } from '../utils/formatters.js';

const CATEGORY_COLORS = {
  Housing: '#6366F1',
  Living: '#3B82F6',
  Transport: '#06B6D4',
  Insurance: '#10B981',
  Personal: '#EC4899',
  Debt: '#F59E0B',
  General: '#94A3B8'
};

export function CashflowDonutChart({ expenses = [] }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="donut-chart-placeholder">
        No expense data to display chart.
      </div>
    );
  }

  // Aggregate category totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    const amount = Number(exp.amount) || 0;
    let monthlyVal = amount;
    if (exp.frequency === 'annual') monthlyVal = amount / 12;
    if (exp.frequency === 'weekly') monthlyVal = (amount * 52) / 12;
    if (exp.frequency === 'fortnightly') monthlyVal = (amount * 26) / 12;

    const cat = exp.category || 'General';
    acc[cat] = (acc[cat] || 0) + monthlyVal;
    return acc;
  }, {});

  const data = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: Math.round(categoryTotals[cat]),
    color: CATEGORY_COLORS[cat] || '#94A3B8'
  })).filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-cat-title" style={{ color: item.payload.color }}>
            ● {item.name}
          </div>
          <div className="tooltip-cat-value">
            {formatMoney(item.value)} /mo
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="donut-chart-wrapper">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Chart Legend */}
      <div className="donut-legend-grid">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: item.color }} />
            <span className="legend-name">{item.name}</span>
            <span className="legend-val">{formatMoney(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
