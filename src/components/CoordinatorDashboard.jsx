import React, { useState } from 'react';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../hooks/useFirebaseEvents';
import { FormError } from './FormError';
import { validateEventForm } from '../utils/formValidation';
import { Dashboard } from './Dashboard';
import { GuestManagement } from './GuestManagement';
import { TaskManagement } from './TaskManagement';
import { ExpenseTracker } from './ExpenseTracker';
import { ScheduleView } from './ScheduleView';
import { FamilyMembers } from './FamilyMembers';
import { AttendanceOverview } from './AttendanceOverview';
import { PageLayout } from './PageLayout';
import { AIBot } from './AIBot';
import { VendorComparison } from './VendorComparison';
import { SmartNotificationHub } from './SmartNotificationHub';
import { AdvancedBudgetAnalytics } from './AdvancedBudgetAnalytics';
import styles from '../styles/components.module.css';
import {
  EVENT_TYPE_OPTIONS,
  EVENT_TYPES,
  EVENT_STATUS,
  EVENT_TYPE_LABELS,
  EVENT_STATUS_LABELS,
  GUEST_STATUS,
  TASK_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../constants';

export function CoordinatorDashboard() {
  const { user, logout } = useAuth();
  const { events, loading, createEvent, deleteEvent } = useEvents();
  const { notify } = useNotification();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPES.WEDDING);
  const [eventDate, setEventDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateEventForm({ eventName, eventDate });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await createEvent({
        eventName,
        eventType,
        date: eventDate,
        status: EVENT_STATUS.PLANNING,
        coordinatorId: user.uid,
        coordinatorEmail: user.email,
      });

      notify(SUCCESS_MESSAGES.EVENT_CREATED, 'success');
      setEventName('');
      setEventDate('');
      setEventType(EVENT_TYPES.WEDDING);
    } catch (error) {
      notify(error.message || ERROR_MESSAGES.EVENT_CREATION_FAILED, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const myEvents = events.filter(
    (e) => !e.coordinatorId || e.coordinatorId === user?.uid
  );

  if (loading) {
    return (
      <PageLayout>
        <h2 className={styles.loading}>Loading events...</h2>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="app-header">
        <h1>👑 Samaroh — Coordinator Dashboard</h1>
        <p>Manage events, job roles, attendance, and team presence</p>
        <button type="button" className="app-header__logout" onClick={handleLogout}>
          Logout
        </button>
        <p className="app-header__meta">Welcome, {user.email}</p>
      </div>

      <div className="app-container">
        {selectedEvent ? (
          <EventDetailsView
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        ) : (
          <div>
            {/* Create Event Form */}
            <div className={styles.section}>
              <h3>Create New Event</h3>
              <form onSubmit={handleCreateEvent} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Event Name *</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Event Name"
                    className={`${styles.input} ${errors.eventName ? styles.error : ''}`}
                    aria-invalid={!!errors.eventName}
                  />
                  {errors.eventName && <FormError error={errors.eventName} />}
                </div>

                <div className={styles.formGridLayout}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Event Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className={styles.input}
                    >
                      {EVENT_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Event Date *</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className={`${styles.input} ${errors.eventDate ? styles.error : ''}`}
                      aria-invalid={!!errors.eventDate}
                    />
                    {errors.eventDate && <FormError error={errors.eventDate} />}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={styles.btn + ' ' + styles.btnPrimary}
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? 'Creating...' : '+ Create Event'}
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className={styles.section}>
              <h3>Your Events ({myEvents.length})</h3>
              {myEvents.length === 0 ? (
                <p className={styles.empty}>No events yet. Create your first event above!</p>
              ) : (
                <div className={styles.grid}>
                  {myEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`${styles.card} ${styles.cursorPointer}`}
                      onClick={() => setSelectedEvent(event)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={styles.cardHeader}>
                        <h4>{event.eventName}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(event.id);
                          }}
                          className={styles.btnClose}
                        >
                          ✕
                        </button>
                      </div>
                      <p className={styles.cardInfo}>
                        📅 {new Date(event.date).toLocaleDateString('en-IN')}
                      </p>
                      <p className={styles.cardInfo}>
                        <strong>Type:</strong> {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                      </p>
                      <span className={styles.statusPlanning}>
                        {EVENT_STATUS_LABELS[event.status] || event.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function EventDetailsView({ event, onBack, activeTab, onTabChange }) {
  const stats = {
    totalGuests: event.guests?.length || 0,
    confirmedGuests: event.guests?.filter(g => g.status === GUEST_STATUS.CONFIRMED).length || 0,
    pendingGuests: event.guests?.filter(g => g.status === GUEST_STATUS.PENDING).length || 0,
    declinedGuests: event.guests?.filter(g => g.status === GUEST_STATUS.DECLINED).length || 0,
    totalTasks: event.tasks?.length || 0,
    pendingTasks: event.tasks?.filter(t => t.status === TASK_STATUS.PENDING).length || 0,
    completedTasks: event.tasks?.filter(t => t.status === TASK_STATUS.COMPLETED).length || 0,
    totalExpenses: event.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0,
    totalMembers: event.members?.length || 0,
  };

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'guests', label: '🎫 Guests' },
    { id: 'tasks', label: '✓ Tasks' },
    { id: 'schedule', label: '📅 Schedule' },
    { id: 'expenses', label: '💰 Budget' },
    { id: 'vendors', label: '🎯 Vendors' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'members', label: '👥 Team' },
    { id: 'attendance', label: '✅ Attendance' },
  ];

  return (
    <div className={styles.section}>
      <button 
        onClick={onBack}
        className={`${styles.btn} ${styles.marginBottom20}`}
      >
        ← Back to Events
      </button>

      <div className={`nav ${styles.navJustifyStart}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={'navBtn' + (activeTab === tab.id ? ' active' : '')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.marginTop30}>
        {activeTab === 'dashboard' && <Dashboard event={event} stats={stats} />}
        {activeTab === 'guests' && <GuestManagement eventId={event.id} />}
        {activeTab === 'tasks' && <TaskManagement eventId={event.id} />}
        {activeTab === 'schedule' && <ScheduleView eventId={event.id} />}
        {activeTab === 'expenses' && <ExpenseTracker eventId={event.id} />}
        {activeTab === 'vendors' && <VendorComparison eventType={event.eventType} />}
        {activeTab === 'analytics' && <AdvancedBudgetAnalytics expenses={event.expenses || []} budget={event.budget || 100000} guests={event.guests || []} />}
        {activeTab === 'members' && <FamilyMembers eventId={event.id} />}
        {activeTab === 'attendance' && <AttendanceOverview eventId={event.id} />}
      </div>

      {/* AI Bot Helper */}
      <AIBot event={event} stats={stats} expenses={event.expenses || []} tasks={event.tasks || []} guests={event.guests || []} />

      {/* Smart Notification Hub */}
      <SmartNotificationHub tasks={event.tasks || []} guests={event.guests || []} expenses={event.expenses || []} event={event} />
    </div>
  );
}
