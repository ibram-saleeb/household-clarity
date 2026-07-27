import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Tag, Filter } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';
import { annualiseAmount, deannualiseToMonthly } from '../logic/calculator';
import { CashflowDonutChart } from './CashflowDonutChart.jsx';

export function ExpenseSection({ expenses, onUpdateExpenses, partners }) {
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState('monthly');
  const [newAssignedTo, setNewAssignedTo] = useState('shared');
  const [newCategory, setNewCategory] = useState('Living');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const p1Name = partners?.[0]?.name || 'Partner 1';
  const p2Name = partners?.[1]?.name || 'Partner 2';

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

  const handleUpdateExpense = (id, field, value) => {
    const updated = expenses.map((exp) => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onUpdateExpenses(updated);
  };

  const handleDeleteExpense = (id) => {
    onUpdateExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Compute total normalised monthly outgoings
  const totalMonthlyOutgoings = expenses.reduce((sum, exp) => {
    return sum + deannualiseToMonthly(annualiseAmount(exp.amount, exp.frequency));
  }, 0) || 1;

  // Filtered Expenses List
  const filteredExpenses = activeCategoryFilter === 'all'
    ? expenses
    : expenses.filter(exp => (exp.category || 'General').toLowerCase() === activeCategoryFilter.toLowerCase());

  return (
    <section className="section-panel">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <CreditCard className="icon-md text-warning inline-icon" /> Household Expenses
          </h2>
          <p className="app-subtitle">
            Itemise regular outgoings. Expenses are automatically normalised to a monthly amount.
          </p>
        </div>
        <div className="total-outgoings-pill">
          <span className="pill-title">Total Outgoings:</span>
          <strong className="pill-amount text-warning">{formatMoney(totalMonthlyOutgoings)}</strong>
          <span className="pill-sub">/mo</span>
        </div>
      </div>

      {/* Visual Category Distribution Meter & Interactive Donut Chart */}
      {expenses.length > 0 && (
        <div className="visual-cashflow-bar-container">
          <div className="cashflow-bar-header">
            <span className="bar-label">Expense Category Breakdown</span>
            <span className="bar-stats">{expenses.length} Total Outgoings</span>
          </div>

          <CashflowDonutChart expenses={expenses} />
        </div>
      )}

      {/* Add New Expense Form */}
      <form onSubmit={handleAddExpense} className="add-expense-card">
        <div className="add-expense-title">Add New Expense Item</div>
        <div className="add-expense-form-grid">
          <div className="form-group flex-2">
            <label className="form-label">Expense Name</label>
            <input
              type="text"
              className="input-field"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Rent, Groceries, Electricity"
              required
            />
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Amount</label>
            <div className="input-prefix-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="number"
                min="0"
                step="10"
                className="input-field"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Frequency</label>
            <select
              className="select-field"
              value={newFrequency}
              onChange={(e) => setNewFrequency(e.target.value)}
            >
              <option value="monthly">per month</option>
              <option value="weekly">per week</option>
              <option value="fortnightly">per fortnight</option>
              <option value="annual">per year</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Assigned To</label>
            <select
              className="select-field"
              value={newAssignedTo}
              onChange={(e) => setNewAssignedTo(e.target.value)}
            >
              <option value="shared">Shared (50/50)</option>
              <option value="p1">{p1Name} (Personal)</option>
              <option value="p2">{p2Name} (Personal)</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Category</label>
            <select
              className="select-field"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option value="Housing">Housing</option>
              <option value="Living">Living / Groceries</option>
              <option value="Transport">Transport</option>
              <option value="Insurance">Insurance</option>
              <option value="Personal">Personal</option>
              <option value="Debt">Debt</option>
              <option value="Childcare">Childcare</option>
            </select>
          </div>
        </div>

        <div className="add-expense-actions">
          <button type="submit" className="btn btn-primary">
            <Plus className="icon-xs" /> Add Expense
          </button>
        </div>
      </form>

      {/* Category Filter Pills */}
      <div className="category-filter-bar">
        <span className="filter-bar-label">
          <Filter className="icon-xs inline-icon" /> Filter by Category:
        </span>
        <button
          type="button"
          className={`category-filter-pill ${activeCategoryFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategoryFilter('all')}
        >
          All ({expenses.length})
        </button>
        {categoriesList.map((cat) => {
          const count = expenses.filter(e => (e.category || 'General').toLowerCase() === cat.toLowerCase()).length;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              type="button"
              className={`category-filter-pill ${activeCategoryFilter.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setActiveCategoryFilter(cat)}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Expense Item Cards List */}
      <div className="expenses-list-container">
        {filteredExpenses.length > 0 ? (
          <div className="expenses-card-list">
            {filteredExpenses.map((exp) => {
              const monthlyVal = deannualiseToMonthly(annualiseAmount(exp.amount, exp.frequency));
              const itemPct = ((monthlyVal / totalMonthlyOutgoings) * 100).toFixed(1);

              let assignedBadgeClass = 'badge-shared';

              if (exp.assignedTo === 'p1') {
                assignedBadgeClass = 'badge-p1';
              } else if (exp.assignedTo === 'p2') {
                assignedBadgeClass = 'badge-p2';
              }

              return (
                <div className="expense-item-card" key={exp.id}>
                  {/* Top Bar: Name, Category, Weight, Assignment */}
                  <div className="expense-card-top">
                    <div className="expense-card-info">
                      <input
                        type="text"
                        className="expense-name-input"
                        value={exp.label}
                        onChange={(e) => handleUpdateExpense(exp.id, 'label', e.target.value)}
                      />
                    </div>

                    <div className="expense-card-badges">
                      <span className="item-weight-badge" title={`${itemPct}% of total outgoings`}>
                        {itemPct}% of budget
                      </span>
                      <span className="category-pill">
                        <Tag className="icon-xs inline-icon" /> {exp.category || 'General'}
                      </span>
                      <select
                        className={`assignment-pill ${assignedBadgeClass}`}
                        value={exp.assignedTo}
                        onChange={(e) => handleUpdateExpense(exp.id, 'assignedTo', e.target.value)}
                      >
                        <option value="shared">Shared (50/50)</option>
                        <option value="p1">{p1Name}</option>
                        <option value="p2">{p2Name}</option>
                      </select>
                    </div>
                  </div>

                  {/* Bottom Row: Amount & Frequency Inputs + Monthly Result + Trash */}
                  <div className="expense-card-bottom">
                    <div className="expense-input-controls">
                      <div className="input-prefix-wrapper compact-prefix">
                        <span className="input-prefix">$</span>
                        <input
                          type="number"
                          min="0"
                          className="input-field input-compact"
                          value={exp.amount}
                          onChange={(e) => handleUpdateExpense(exp.id, 'amount', Math.max(0, Number(e.target.value) || 0))}
                        />
                      </div>

                      <select
                        className="select-field select-compact"
                        value={exp.frequency}
                        onChange={(e) => handleUpdateExpense(exp.id, 'frequency', e.target.value)}
                      >
                        <option value="monthly">/ month</option>
                        <option value="weekly">/ week</option>
                        <option value="fortnightly">/ fortnight</option>
                        <option value="annual">/ year</option>
                      </select>
                    </div>

                    <div className="expense-monthly-result">
                      <span className="monthly-val-highlight text-warning">{formatMoney(monthlyVal)}</span>
                      <span className="monthly-val-unit">/mo</span>

                      <button
                        type="button"
                        className="btn-icon-danger"
                        onClick={() => handleDeleteExpense(exp.id)}
                        title="Delete expense"
                      >
                        <Trash2 className="icon-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-expenses-placeholder">
            <p>
              {activeCategoryFilter === 'all'
                ? 'No expenses added yet. Fill out the form above to add your first household outgoing.'
                : `No expenses found in category "${activeCategoryFilter}".`}
            </p>
            {activeCategoryFilter !== 'all' && (
              <button
                type="button"
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => setActiveCategoryFilter('all')}
              >
                Show All Outgoings
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
