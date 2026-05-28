import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { PageLayout } from './PageLayout';
import { MemberJobBoard } from './MemberJobBoard';
import { filterTasksForMember } from '../utils/taskStatus';
import { syncMemberPresenceAcrossEvents } from '../hooks/useFirebaseEvents';
import styles from '../styles/components.module.css';

function memberMatchesEvent(member, user, memberUid) {
  if (memberUid && member.memberUid === memberUid) return true;
  if (user?.uid && member.authUid === user.uid) return true;
  if (user?.uid && member.id === user.uid) return true;
  return false;
}

export function MemberDashboard() {
  const { user, memberUid, logout } = useAuth();
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    if (!user) return;

    if (memberUid) {
      syncMemberPresenceAcrossEvents(user.uid, memberUid);
    }

    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const events = [];
      const allTasks = [];

      snapshot.docs.forEach((docSnapshot) => {
        const eventData = docSnapshot.data();
        const myMember = (eventData.members || []).find((m) =>
          memberMatchesEvent(m, user, memberUid)
        );

        if (!myMember) return;

        const tasks = filterTasksForMember(eventData.tasks || [], {
          memberUid: myMember.memberUid || memberUid,
          memberName: myMember.name,
          email: user.email,
        }).map((task) => ({
          ...task,
          eventId: docSnapshot.id,
          eventName: eventData.eventName,
        }));

        events.push({
          id: docSnapshot.id,
          ...eventData,
          myMember,
          assignedTasks: tasks,
        });
        allTasks.push(...tasks);
      });

      setAssignedEvents(events);
      setAssignedTasks(allTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, memberUid]);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const handleToggleTask = async (task, newStatus) => {
    if (!task.eventId) return;
    try {
      const eventRef = doc(db, 'events', task.eventId);
      const eventSnap = await getDoc(eventRef);
      const eventData = eventSnap.data();
      const updatedTasks = (eventData.tasks || []).map((t) =>
        t.id === task.id ? { ...t, status: newStatus } : t
      );
      await updateDoc(eventRef, { tasks: updatedTasks });
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const header = (
    <div className="app-header">
      <h1>👤 Samaroh — Member Dashboard</h1>
      <p>Your job roles, tasks, and event updates</p>
      <button type="button" className="app-header__logout" onClick={handleLogout}>
        Logout
      </button>
      <p className="app-header__meta">
        {user?.email}
        {memberUid && <> · UID: <strong>{memberUid}</strong></>}
      </p>
    </div>
  );

  if (loading) {
    return (
      <PageLayout>
        <h2 className={styles.loading}>Loading your assignments...</h2>
      </PageLayout>
    );
  }

  if (activeView === 'event-details' && selectedEvent) {
    return (
      <PageLayout>
        {header}
        <div className="app-container">
          <EventMemberView
            event={selectedEvent}
            memberUid={memberUid}
            onBack={() => {
              setActiveView('overview');
              setSelectedEvent(null);
            }}
            onToggleTask={handleToggleTask}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {header}
      <div className="app-container">
        <div className={styles.section}>
          <h3>📋 Your Jobs by Status</h3>
          <MemberJobBoard tasks={assignedTasks} onToggleTask={handleToggleTask} />
        </div>

        <div className={styles.section}>
          <h3>🎉 Your Events</h3>
          {assignedEvents.length === 0 ? (
            <p className={styles.empty}>
              No events linked yet. Ask your coordinator to assign you and use your Member UID when signing in.
            </p>
          ) : (
            <div className={styles.grid}>
              {assignedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`${styles.card} ${styles.cursorPointer}`}
                  onClick={() => {
                    setSelectedEvent(event);
                    setActiveView('event-details');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedEvent(event);
                      setActiveView('event-details');
                    }
                  }}
                >
                  <div className={styles.cardHeader}>
                    <h4>{event.eventName}</h4>
                    {event.myMember?.isPresent && (
                      <span className={styles.badgePresent}>You are marked present</span>
                    )}
                  </div>
                  <p className={styles.cardInfo}>
                    📅 {new Date(event.date).toLocaleDateString('en-IN')}
                  </p>
                  <p className={styles.cardInfo}>Role: {event.myMember?.jobRole || event.myMember?.role}</p>
                  <p className={styles.cardInfo}>Tasks: {event.assignedTasks?.length || 0}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function EventMemberView({ event, memberUid, onBack, onToggleTask }) {
  const myTasks = filterTasksForMember(event.tasks || [], {
    memberUid: event.myMember?.memberUid || memberUid,
    memberName: event.myMember?.name,
  });

  return (
    <div className={styles.section}>
      <button type="button" onClick={onBack} className={`${styles.btn} ${styles.marginBottom20}`}>
        ← Back to Overview
      </button>

      <h2>{event.eventName}</h2>
      <p className={styles.muted}>
        📅 {new Date(event.date).toLocaleDateString('en-IN')} · {event.eventType}
      </p>

      <MemberJobBoard tasks={myTasks} onToggleTask={onToggleTask} />

      <div className={styles.spacerFull}>
        <h3>📋 Event Overview</h3>
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>
              {event.members?.filter((m) => m.isPresent).length || 0}
            </span>
            <span className={styles.statLabel}>Team Present</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>
              {event.guests?.filter((g) => g.attended).length || 0}
            </span>
            <span className={styles.statLabel}>Guests Attended</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{event.guests?.length || 0}</span>
            <span className={styles.statLabel}>Total Guests</span>
          </div>
        </div>
      </div>
    </div>
  );
}
