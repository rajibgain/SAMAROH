import React, { useState } from 'react';
import { useExpenses } from '../hooks/useFirebaseEvents';
import { FormError } from './FormError';
import { useNotification } from '../hooks/useNotification';
import { validateExpenseForm } from '../utils/formValidation';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_OPTIONS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../constants';
import styles from '../styles/components.module.css';

export function ExpenseTracker({ eventId }) {
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(eventId);
  const { notify } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    category: EXPENSE_CATEGORIES.DECORATION,
    amount: '',
    paidBy: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = EXPENSE_CATEGORY_OPTIONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateExpenseForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      notify(SUCCESS_MESSAGES.EXPENSE_RECORDED, 'success');
      setFormData({ description: '', category: EXPENSE_CATEGORIES.DECORATION, amount: '', paidBy: '', notes: '' });
      setShowForm(false);
    } catch (error) {
      notify(error.message || ERROR_MESSAGES.EXPENSE_ADD_FAILED, 'error');
    } finally {
      setIsSubmitting(false);
    }
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
              <span>{categories.find((category) => category.value === cat)?.label || cat}</span>
              <span className={styles.catAmount}>₹ {amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description *</label>
            <input
              type="text"
              placeholder="Expense Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${styles.input} ${errors.description ? styles.error : ''}`}
              aria-invalid={!!errors.description}
            />
            {errors.description && <FormError error={errors.description} />}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={styles.input}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Amount (₹) *</label>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`${styles.input} ${errors.amount ? styles.error : ''}`}
              aria-invalid={!!errors.amount}
              step="0.01"
              min="0"
            />
            {errors.amount && <FormError error={errors.amount} />}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Paid By (optional)</label>
            <input
              type="text"
              placeholder="Paid By (name)"
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Notes (optional)</label>
            <textarea
              placeholder="Additional notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={styles.input}
              rows="2"
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess} disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Expense'}
            </button>
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
                <p className={styles.expenseCat}>{categories.find((category) => category.value === expense.category)?.label || expense.category}</p>
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
