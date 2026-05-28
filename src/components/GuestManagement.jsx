import React, { useState } from 'react';
import { useGuests } from '../hooks/useFirebaseEvents';
import { FormError } from './FormError';
import { useNotification } from '../hooks/useNotification';
import { validateGuestForm } from '../utils/formValidation';
import { GUEST_STATUS_OPTIONS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
import styles from '../styles/components.module.css';

export function GuestManagement({ eventId }) {
  const { guests, loading, addGuest, updateGuest, deleteGuest, markGuestAttended } = useGuests(eventId);
  const { notify } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statuses = GUEST_STATUS_OPTIONS.map((option) => option.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateGuestForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await addGuest(formData);
      notify(SUCCESS_MESSAGES.GUEST_INVITED, 'success');
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
    } catch (error) {
      notify(error.message || ERROR_MESSAGES.GUEST_ADD_FAILED, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (guestId, newStatus) => {
    await updateGuest(guestId, { status: newStatus });
  };

  if (loading) return <div className={styles.loading}>Loading guests...</div>;

  const confirmed = guests.filter(g => g.status === GUEST_STATUS.CONFIRMED).length;
  const pending = guests.filter(g => g.status === GUEST_STATUS.PENDING).length;
  const declined = guests.filter(g => g.status === GUEST_STATUS.DECLINED).length;
  const attended = guests.filter((g) => g.attended).length;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>🎫 Guest Invitations</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={styles.btn + ' ' + styles.btnPrimary}
        >
          + Invite Guest
        </button>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{confirmed}</span>
          <span className={styles.statLabel}>Confirmed</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{pending}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{declined}</span>
          <span className={styles.statLabel}>Declined</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{attended}</span>
          <span className={styles.statLabel}>Attended</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{guests.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Guest Name *</label>
            <input
              type="text"
              placeholder="Guest Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              aria-invalid={!!errors.name}
            />
            {errors.name && <FormError error={errors.name} />}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email (optional)</label>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`${styles.input} ${errors.email ? styles.error : ''}`}
              aria-invalid={!!errors.email}
            />
            {errors.email && <FormError error={errors.email} />}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone (optional)</label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <FormError error={errors.phone} />}
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.btn + ' ' + styles.btnSuccess}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Inviting...' : 'Invite'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.btn}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {guests.length === 0 ? (
          <p className={styles.empty}>No guests added yet</p>
        ) : (
          guests.map(guest => (
            <div key={guest.id} className={styles.listItem}>
              <div className={styles.itemContent}>
                <h4>{guest.name}</h4>
                {guest.email && <p>📧 {guest.email}</p>}
                {guest.phone && <p>📱 {guest.phone}</p>}
              </div>
              <div className={styles.itemActions}>
                <select 
                  value={guest.status}
                  onChange={(e) => handleStatusChange(guest.id, e.target.value)}
                  className={styles.select}
                >
                  {GUEST_STATUS_OPTIONS.map((statusOption) => (
                    <option key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.btn + ' ' + styles.btnSuccess}
                  onClick={() => markGuestAttended(guest.id, !guest.attended)}
                >
                  {guest.attended ? 'Undo attendance' : 'Mark attended'}
                </button>
                <button 
                  type="button"
                  onClick={() => deleteGuest(guest.id)}
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
