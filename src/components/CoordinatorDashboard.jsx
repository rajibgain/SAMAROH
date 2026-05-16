import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../hooks/useFirebaseEvents';
import { Dashboard } from './Dashboard';
import { GuestManagement } from './GuestManagement';
import { TaskManagement } from './TaskManagement';
import { ExpenseTracker } from './ExpenseTracker';
import { ScheduleView } from './ScheduleView';
import { FamilyMembers } from './FamilyMembers';
import { AttendanceOverview } from './AttendanceOverview';
import { PageLayout } from './PageLayout';
import styles from '../styles/components.module.css';

export function CoordinatorDashboard() {
  const { user, logout } = useAuth();
  const { events, loading, createEvent, deleteEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('wedding');
  const [eventDate, setEventDate] = useState('');

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate) {
      alert('Please fill out the name and date!');
      return;
    }

    await createEvent({
      eventName: eventName,
      eventType: eventType,
      date: eventDate,
      status: 'planning',
      coordinatorId: user.uid,
      coordinatorEmail: user.email
    });

    setEventName('');
    setEventDate('');
    setEventType('wedding');
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
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Event Name"
                  className={styles.input}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className={styles.input}
                  >
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="festival">Festival / Puja</option>
                  </select>

                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <button type="submit" className={styles.btn + ' ' + styles.btnPrimary}>
                  + Create Event
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
                      className={styles.card}
                      onClick={() => setSelectedEvent(event)}
                      style={{ cursor: 'pointer' }}
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
                        <strong>Type:</strong> {event.eventType}
                      </p>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '10px',
                          padding: '4px 8px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {event.status.toUpperCase()}
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
    confirmedGuests: event.guests?.filter(g => g.status === 'confirmed').length || 0,
    pendingGuests: event.guests?.filter(g => g.status === 'pending').length || 0,
    declinedGuests: event.guests?.filter(g => g.status === 'declined').length || 0,
    totalTasks: event.tasks?.length || 0,
    pendingTasks: event.tasks?.filter(t => t.status === 'pending').length || 0,
    completedTasks: event.tasks?.filter(t => t.status === 'completed').length || 0,
    totalExpenses: event.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0,
    totalMembers: event.members?.length || 0,
  };

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'guests', label: '🎫 Guests' },
    { id: 'tasks', label: '✓ Tasks' },
    { id: 'schedule', label: '📅 Schedule' },
    { id: 'expenses', label: '💰 Budget' },
    { id: 'members', label: '👥 Team' },
    { id: 'attendance', label: '✅ Attendance' },
  ];

  return (
    <div className={styles.section}>
      <button 
        onClick={onBack}
        className={styles.btn}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Events
      </button>

      <div className="nav" style={{ justifyContent: 'flex-start' }}>
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

      <div style={{ marginTop: '30px' }}>
        {activeTab === 'dashboard' && <Dashboard event={event} stats={stats} />}
        {activeTab === 'guests' && <GuestManagement eventId={event.id} />}
        {activeTab === 'tasks' && <TaskManagement eventId={event.id} />}
        {activeTab === 'schedule' && <ScheduleView eventId={event.id} />}
        {activeTab === 'expenses' && <ExpenseTracker eventId={event.id} />}
        {activeTab === 'members' && <FamilyMembers eventId={event.id} />}
        {activeTab === 'attendance' && <AttendanceOverview eventId={event.id} />}
      </div>
    </div>
  );
}
