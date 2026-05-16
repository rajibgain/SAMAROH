import React, { useState } from 'react';
import { useExpenses } from '../hooks/useFirebaseEvents';
import styles from '../styles/components.module.css';

export function ExpenseTracker({ eventId }) {
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(eventId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: 'decoration',
    amount: '',
    paidBy: '',
    notes: '',
  });

  const categories = ['food', 'decoration', 'venue', 'entertainment', 'guest-gifts', 'transport', 'other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert('Please fill in description and amount');
      return;
    }
    await addExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({ description: '', category: 'decoration', amount: '', paidBy: '', notes: '' });
    setShowForm(false);
  };

  if (loading) return <div className={styles.loading}>Loading expenses...</div>;

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const byCategory = {};
  expenses.forEach(exp => {
    byCategory[exp.category] = (byCategory[exp.category] || 0) + (exp.amount || 0);
  });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>💰 Expense Tracker</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={styles.btn + ' ' + styles.btnPrimary}
        >
          + Add Expense
        </button>
      </div>

      {/* Expense Summary */}
      <div className={styles.expenseSummary}>
        <div className={styles.totalExpense}>
          <h3>Total Budget</h3>
          <p className={styles.amount}>₹ {totalExpenses.toFixed(2)}</p>
        </div>
        <div className={styles.categoryBreakdown}>
          <h4>By Category</h4>
          {Object.entries(byCategory).map(([cat, amount]) => (
            <div key={cat} className={styles.categoryItem}>
              <span>{cat}</span>
              <span className={styles.catAmount}>₹ {amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.input}
          />
          <select 
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={styles.input}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount (₹)"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={styles.input}
            step="0.01"
          />
          <input
            type="text"
            placeholder="Paid By (name)"
            value={formData.paidBy}
            onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
            className={styles.input}
          />
          <textarea
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className={styles.input}
            rows="2"
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess}>Record Expense</button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.btn}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {expenses.length === 0 ? (
          <p className={styles.empty}>No expenses recorded yet</p>
        ) : (
          expenses.map(expense => (
            <div key={expense.id} className={styles.expenseItem}>
              <div className={styles.itemContent}>
                <h4>{expense.description}</h4>
                <p className={styles.expenseCat}>{expense.category}</p>
                {expense.paidBy && <p>Paid By: {expense.paidBy}</p>}
                {expense.notes && <p className={styles.notes}>{expense.notes}</p>}
                <p className={styles.date}>
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className={styles.itemActions}>
                <span className={styles.amount}>₹ {expense.amount.toFixed(2)}</span>
                <button 
                  onClick={() => deleteExpense(expense.id)}
                  className={styles.btnClose}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
