import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';
import { annualiseAmount, deannualiseToMonthly } from '../logic/calculator.js';

export function ExpenseSection({ expenses, onUpdateExpenses, partners }) {
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState('monthly');
  const newAssignedTo = 'shared';
  const newCategory = 'Living';
  const [activeFilter, setActiveFilter] = useState('all');

  const p1Name = partners?.[0]?.name || 'Alex';
  const p2Name = partners?.[1]?.name || 'Sam';

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newLabel.trim() || !newAmount || Number(newAmount) <= 0) return;

    const newExpense = {
      id: 'exp_' + Date.now(),
      label: newLabel.trim(),
      amount: Number(newAmount),
      frequency: newFrequency,
      assignedTo: newAssignedTo,
      category: newCategory.trim() || 'General'
    };

    onUpdateExpenses([...expenses, newExpense]);
    setNewLabel('');
    setNewAmount('');
  };

  const handleDeleteExpense = (id) => {
    onUpdateExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Compute total normalised monthly outgoings
  const totalMonthlyOutgoings = expenses.reduce((sum, exp) => {
    return sum + deannualiseToMonthly(annualiseAmount(exp.amount, exp.frequency));
  }, 0) || 1;

  // Filter expenses
  const filteredExpenses = expenses.filter(exp => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'fixed') {
      const fixedCats = ['Housing', 'Debt', 'Insurance', 'Childcare'];
      return fixedCats.includes(exp.category || 'General');
    }
    if (activeFilter === 'p1') return exp.assignedTo === 'p1';
    if (activeFilter === 'p2') return exp.assignedTo === 'p2';
    return true;
  });

  return (
    <section className="section-panel" aria-label="Household Spending">
      {/* Title & Total Subtitle */}
      <div className="expenses-title-row">
        <h2 className="expenses-main-title">Expenses</h2>
        <div className="expenses-sub-row">
          <div className="expenses-total-amt">{formatMoney(totalMonthlyOutgoings)} / mo</div>
          <div className="expenses-count-tag">· {expenses.length} outgoings</div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter-row">
        <button
          type="button"
          className={`cat-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All {expenses.length}
        </button>
        <button
          type="button"
          className={`cat-filter-btn ${activeFilter === 'fixed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('fixed')}
        >
          Fixed
        </button>
        <button
          type="button"
          className={`cat-filter-btn ${activeFilter === 'p1' ? 'active' : ''}`}
          onClick={() => setActiveFilter('p1')}
        >
          {p1Name}
        </button>
        <button
          type="button"
          className={`cat-filter-btn ${activeFilter === 'p2' ? 'active' : ''}`}
          onClick={() => setActiveFilter('p2')}
        >
          {p2Name}
        </button>
      </div>

      {/* Ranked Expense Items List */}
      <div className="expenses-cards-list">
        {filteredExpenses.map((exp) => {
          const monthlyVal = deannualiseToMonthly(annualiseAmount(exp.amount, exp.frequency));
          const pct = Math.round((monthlyVal / totalMonthlyOutgoings) * 100);
          const isFixed = ['Housing', 'Debt', 'Insurance', 'Childcare'].includes(exp.category || 'General');

          return (
            <div key={exp.id} className="expense-card-item">
              <div className="expense-card-main">
                <div className="expense-label-row">
                  <span className="expense-card-name">{exp.label}</span>
                  {exp.assignedTo !== 'shared' && (
                    <span className="expense-assignee-tag">
                      {exp.assignedTo === 'p1' ? p1Name : p2Name}
                    </span>
                  )}
                </div>

                <div className="expense-card-meta">
                  {exp.frequency === 'monthly' ? 'Monthly' : `${formatMoney(exp.amount)} ${exp.frequency}`} · {exp.assignedTo === 'shared' ? 'shared 50/50' : 'personal'}
                </div>

                <div className="expense-card-progress">
                  <div
                    className="expense-progress-bar"
                    style={{
                      width: `${pct}%`,
                      background: isFixed ? 'var(--amber)' : 'var(--slate-dim)'
                    }}
                  />
                </div>
              </div>

              <div className="expense-card-right">
                <div className="expense-card-amount">{formatMoney(monthlyVal)}</div>
                <div className="expense-card-pct">{pct}%</div>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm text-dim"
                onClick={() => handleDeleteExpense(exp.id)}
                title="Delete item"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Expense Form / Sheet */}
      <form onSubmit={handleAddExpense} className="add-expense-box" style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="input-field"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Rent, Groceries, Electricity"
            style={{ flex: '1.5', minWidth: '160px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', color: 'var(--text-main)' }}
            required
          />

          <input
            type="number"
            min="0"
            step="10"
            className="input-field"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="0"
            style={{ width: '90px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', color: 'var(--text-main)' }}
            required
          />

          <select
            value={newFrequency}
            onChange={(e) => setNewFrequency(e.target.value)}
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.55rem 0.75rem', color: 'var(--text-main)' }}
          >
            <option value="monthly">per month</option>
            <option value="weekly">per week</option>
            <option value="fortnightly">per fortnight</option>
            <option value="annual">per year</option>
          </select>

          <button
            type="submit"
            className="btn btn-secondary"
            style={{ background: 'var(--primary)', color: '#eafaf6', border: 'none', padding: '0.55rem 1rem' }}
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </form>
    </section>
  );
}
