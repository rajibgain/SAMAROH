import React, { useState } from 'react';
import { useSchedule } from '../hooks/useFirebaseEvents';
import styles from '../styles/components.module.css';

export function ScheduleView({ eventId }) {
  const { schedule, loading, addScheduleItem, updateScheduleItem, deleteScheduleItem } = useSchedule(eventId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    time: '',
    location: '',
    description: '',
    attendees: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.eventName || !formData.time) {
      alert('Please fill in event name and time');
      return;
    }
    await addScheduleItem(formData);
    setFormData({ eventName: '', time: '', location: '', description: '', attendees: '' });
    setShowForm(false);
  };

  if (loading) return <div className={styles.loading}>Loading schedule...</div>;

  const sortedSchedule = [...schedule].sort((a, b) => new Date(a.time) - new Date(b.time));

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>📅 Event Schedule</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={styles.btn + ' ' + styles.btnPrimary}
        >
          + Add Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Event Name (e.g., Ceremony, Reception)"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            className={styles.input}
          />
          <input
            type="datetime-local"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={styles.input}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.input}
            rows="3"
          />
          <input
            type="text"
            placeholder="Attendees (comma separated)"
            value={formData.attendees}
            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            className={styles.input}
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess}>Add to Schedule</button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.btn}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.timeline}>
        {sortedSchedule.length === 0 ? (
          <p className={styles.empty}>No scheduled events yet</p>
        ) : (
          sortedSchedule.map((item, idx) => (
            <div key={item.id} className={styles.timelineItem}>
              <div className={styles.timelineDot}>{idx + 1}</div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h4>{item.eventName}</h4>
                  <span className={styles.time}>
                    {new Date(item.time).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {item.location && <p>📍 {item.location}</p>}
                {item.description && <p className={styles.desc}>{item.description}</p>}
                {item.attendees && <p>👥 {item.attendees}</p>}
                <button 
                  onClick={() => deleteScheduleItem(item.id)}
                  className={styles.btnSmall}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
