import React from 'react';
import styles from '../styles/components.module.css';

/**
 * Error Display Component for Form Validation
 * Displays validation errors below form fields
 */
export function FormError({ error }) {
  if (!error) return null;
  
  return (
    <div className={styles.formError}>
      <span className={styles.errorIcon}>⚠️</span>
      <span className={styles.errorText}>{error}</span>
    </div>
  );
}

/**
 * Form Group with Label, Input, and Error
 */
export function FormGroup({ label, error, children }) {
  return (
    <div className={styles.formGroup}>
      {label && <label className={styles.formLabel}>{label}</label>}
      {children}
      {error && <FormError error={error} />}
    </div>
  );
}

export default FormError;
