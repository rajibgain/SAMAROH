import React, { useState } from 'react';
import { useGuests } from '../hooks/useFirebaseEvents';
import styles from '../styles/components.module.css';

export function GuestManagement({ eventId }) {
  const { guests, loading, addGuest, updateGuest, deleteGuest, markGuestAttended } = useGuests(eventId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const statuses = ['pending', 'confirmed', 'declined'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter guest name');
      return;
    }
    await addGuest(formData);
    setFormData({ name: '', email: '', phone: '' });
    setShowForm(false);
  };

  const handleStatusChange = async (guestId, newStatus) => {
    await updateGuest(guestId, { status: newStatus });
  };

  if (loading) return <div className={styles.loading}>Loading guests...</div>;

  const confirmed = guests.filter(g => g.status === 'confirmed').length;
  const pending = guests.filter(g => g.status === 'pending').length;
  const declined = guests.filter(g => g.status === 'declined').length;
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
          <input
            type="text"
            placeholder="Guest Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={styles.input}
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess}>Invite</button>
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
                  {statuses.map(status => (
                    <option key={status} value={status}>{status.toUpperCase()}</option>
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
