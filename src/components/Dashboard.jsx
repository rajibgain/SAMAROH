import React, { useState } from 'react';
import styles from '../styles/components.module.css';

export function Dashboard({ event, stats }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.eventInfo}>
          <h2>{event.eventName}</h2>
          <p className={styles.eventType}>{event.eventType.toUpperCase()}</p>
          <p className={styles.eventDate}>
            📅 {new Date(event.date).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <div className={styles.statusBadge}>
          <span>{event.status.toUpperCase()}</span>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        {/* Guests Overview */}
        <div className={styles.dashboardCard}>
          <button 
            className={styles.cardHeader}
            onClick={() => toggleSection('guests')}
          >
            <h3>🎫 Guests</h3>
            <span className={styles.chevron}>
              {expandedSection === 'guests' ? '▼' : '▶'}
            </span>
          </button>
          <div className={styles.cardStat}>
            <span className={styles.bigNumber}>{stats.totalGuests}</span>
            <span className={styles.label}>Total Guests</span>
          </div>
          {expandedSection === 'guests' && (
            <div className={styles.expandedContent}>
              <div className={styles.miniStat}>
                <span>✓ Confirmed: {stats.confirmedGuests}</span>
              </div>
              <div className={styles.miniStat}>
                <span>⏱ Pending: {stats.pendingGuests}</span>
              </div>
              <div className={styles.miniStat}>
                <span>✕ Declined: {stats.declinedGuests}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Overview */}
        <div className={styles.dashboardCard}>
          <button 
            className={styles.cardHeader}
            onClick={() => toggleSection('tasks')}
          >
            <h3>✓ Tasks</h3>
            <span className={styles.chevron}>
              {expandedSection === 'tasks' ? '▼' : '▶'}
            </span>
          </button>
          <div className={styles.cardStat}>
            <span className={styles.bigNumber}>{stats.totalTasks}</span>
            <span className={styles.label}>Total Tasks</span>
          </div>
          {expandedSection === 'tasks' && (
            <div className={styles.expandedContent}>
              <div className={styles.miniStat}>
                <span>📌 Pending: {stats.pendingTasks}</span>
              </div>
              <div className={styles.miniStat}>
                <span>✓ Completed: {stats.completedTasks}</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progress}
                  style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Budget Overview */}
        <div className={styles.dashboardCard}>
          <button 
            className={styles.cardHeader}
            onClick={() => toggleSection('budget')}
          >
            <h3>💰 Budget</h3>
            <span className={styles.chevron}>
              {expandedSection === 'budget' ? '▼' : '▶'}
            </span>
          </button>
          <div className={styles.cardStat}>
            <span className={styles.bigNumber}>₹{stats.totalExpenses.toFixed(0)}</span>
            <span className={styles.label}>Total Expenses</span>
          </div>
          {expandedSection === 'budget' && (
            <div className={styles.expandedContent}>
              <p className={styles.budgetInfo}>
                Track all expenses related to the event
              </p>
            </div>
          )}
        </div>

        {/* Team Overview */}
        <div className={styles.dashboardCard}>
          <button 
            className={styles.cardHeader}
            onClick={() => toggleSection('team')}
          >
            <h3>👥 Team</h3>
            <span className={styles.chevron}>
              {expandedSection === 'team' ? '▼' : '▶'}
            </span>
          </button>
          <div className={styles.cardStat}>
            <span className={styles.bigNumber}>{stats.totalMembers}</span>
            <span className={styles.label}>Family Members</span>
          </div>
          {expandedSection === 'team' && (
            <div className={styles.expandedContent}>
              <p className={styles.budgetInfo}>
                {stats.totalMembers} members coordinating this event
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>📅</span>
          <span className={styles.statText}>
            {Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24))} days left
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🎯</span>
          <span className={styles.statText}>
            {Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)}% tasks complete
          </span>
        </div>
      </div>
    </div>
  );
}
