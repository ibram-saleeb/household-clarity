import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Tag, Layers, Filter } from 'lucide-react';
import { formatMoney } from './HeroDashboard';
import { annualiseAmount, deannualiseToMonthly } from '../logic/calculator';

export function ExpenseSection({ expenses, onUpdateExpenses, partners }) {
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState('monthly');
  const [newAssignedTo, setNewAssignedTo] = useState('shared');
  const [newCategory, setNewCategory] = useState('Living');

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
  }, 0);

  return (
    <section className="section-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <CreditCard className="icon-md inline-icon" /> Key Household Expenses & Outgoings
          </h2>
          <p className="section-subtitle">
            All expenses are automatically normalised to a monthly period. Assign expenses to Shared (50/50) or individual partners.
          </p>
        </div>
        <div className="total-outgoings-badge">
          Total Outgoings: <strong>{formatMoney(totalMonthlyOutgoings)}</strong> / month
        </div>
      </div>

      {/* Add New Expense Form */}
      <form onSubmit={handleAddExpense} className="add-expense-card">
        <h3 className="form-card-title">Add New Expense Item</h3>
        <div className="add-expense-grid">
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Expense Name (e.g. Mortgage, Health Ins)"
              required
            />
          </div>

          <div className="form-group">
            <div className="input-prefix-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="number"
                min="0"
                step="10"
                className="input-field"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Amount"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <select
              className="input-select"
              value={newFrequency}
              onChange={(e) => setNewFrequency(e.target.value)}
            >
              <option value="monthly">per month</option>
              <option value="weekly">per week</option>
              <option value="fortnightly">per fortnight</option>
              <option value="annual">per year</option>
            </select>
          </div>

          <div className="form-group">
            <select
              className="input-select"
              value={newAssignedTo}
              onChange={(e) => setNewAssignedTo(e.target.value)}
            >
              <option value="shared">Shared (Household)</option>
              <option value="p1">{p1Name} (Personal)</option>
              <option value="p2">{p2Name} (Personal)</option>
            </select>
          </div>

          <div className="form-group">
            <select
              className="input-select"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              <option value="Housing">Housing / Rent / Mortgage</option>
              <option value="Living">Living / Groceries</option>
              <option value="Transport">Transport / Vehicles</option>
              <option value="Insurance">Insurance / Medical</option>
              <option value="Personal">Personal & Subscriptions</option>
              <option value="Debt">Debt Repayments</option>
              <option value="Childcare">Childcare & Education</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-add-expense">
            <Plus className="icon-xs inline-icon" /> Add Expense
          </button>
        </div>
      </form>

      {/* Expenses Table */}
      <div className="expenses-table-card">
        {expenses.length > 0 ? (
          <div className="table-responsive">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Expense Line</th>
                  <th>Amount & Frequency</th>
                  <th>Normalised Monthly</th>
                  <th>Assignment</th>
                  <th>Category</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => {
                  const monthlyVal = deannualiseToMonthly(annualiseAmount(exp.amount, exp.frequency));

                  return (
                    <tr key={exp.id}>
                      <td>
                        <input
                          type="text"
                          className="input-field input-table-cell"
                          value={exp.label}
                          onChange={(e) => handleUpdateExpense(exp.id, 'label', e.target.value)}
                        />
                      </td>
                      <td>
                        <div className="table-amount-group">
                          <div className="input-prefix-wrapper input-table-amount">
                            <span className="input-prefix">$</span>
                            <input
                              type="number"
                              min="0"
                              className="input-field"
                              value={exp.amount}
                              onChange={(e) => handleUpdateExpense(exp.id, 'amount', Math.max(0, Number(e.target.value) || 0))}
                            />
                          </div>
                          <select
                            className="input-select input-table-freq"
                            value={exp.frequency}
                            onChange={(e) => handleUpdateExpense(exp.id, 'frequency', e.target.value)}
                          >
                            <option value="monthly">/ mo</option>
                            <option value="weekly">/ wk</option>
                            <option value="fortnightly">/ fortnight</option>
                            <option value="annual">/ yr</option>
                          </select>
                        </div>
                      </td>
                      <td className="font-weight-bold text-warning">
                        {formatMoney(monthlyVal)} / mo
                      </td>
                      <td>
                        <select
                          className={`input-select assignment-badge-select ${exp.assignedTo}`}
                          value={exp.assignedTo}
                          onChange={(e) => handleUpdateExpense(exp.id, 'assignedTo', e.target.value)}
                        >
                          <option value="shared">Shared 50/50</option>
                          <option value="p1">{p1Name}</option>
                          <option value="p2">{p2Name}</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input-field input-table-cell category-cell"
                          value={exp.category || ''}
                          onChange={(e) => handleUpdateExpense(exp.id, 'category', e.target.value)}
                        />
                      </td>
                      <td className="text-right">
                        <button
                          className="btn-icon-danger"
                          onClick={() => handleDeleteExpense(exp.id)}
                          title="Delete expense"
                        >
                          <Trash2 className="icon-xs" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-expenses-placeholder">
            No expenses listed. Add your key household expenses above to calculate net cash flow.
          </div>
        )}
      </div>
    </section>
  );
}
