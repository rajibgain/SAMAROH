import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Calendar, Users, DollarSign, CheckCircle2, 
  TrendingUp, Bell, Settings, LogOut
} from 'lucide-react';
import styles from '../styles/dashboard.module.css';

export function AdvancedDashboard({ events = [], user, onLogout }) {
  const [showStats, setShowStats] = useState(true);

  // Calculate statistics
  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.date) > new Date()).length,
    totalGuests: events.reduce((sum, e) => sum + (e.guests?.length || 0), 0),
    totalBudget: events.reduce((sum, e) => sum + (parseFloat(e.budget) || 0), 0)
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.dashboard}
    >
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user?.email?.split('@')[0]}! 👋</h1>
          <p>Manage your events with advanced features</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.notificationBtn}>
            <Bell size={20} />
            <span className={styles.badge}>3</span>
          </button>
          <button className={styles.settingsBtn}>
            <Settings size={20} />
          </button>
          <button className={styles.logoutBtn} onClick={onLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {showStats && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={styles.statsGrid}
        >
          <motion.div variants={cardVariants} className={`${styles.statCard} ${styles.events}`}>
            <div className={styles.statIcon}>
              <Calendar size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Events</p>
              <h3 className={styles.statValue}>{stats.totalEvents}</h3>
              <p className={styles.statMeta}>
                {stats.upcomingEvents} upcoming
              </p>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className={`${styles.statCard} ${styles.guests}`}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Guests</p>
              <h3 className={styles.statValue}>{stats.totalGuests}</h3>
              <p className={styles.statMeta}>Across all events</p>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className={`${styles.statCard} ${styles.budget}`}>
            <div className={styles.statIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Budget</p>
              <h3 className={styles.statValue}>${stats.totalBudget.toFixed(0)}</h3>
              <p className={styles.statMeta}>Overall spending</p>
            </div>
          </motion.div>

          <motion.div variants={cardVariants} className={`${styles.statCard} ${styles.completed}`}>
            <div className={styles.statIcon}>
              <CheckCircle2 size={24} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Completion</p>
              <h3 className={styles.statValue}>85%</h3>
              <p className={styles.statMeta}>
                <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px' }} />
                +12% this week
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={styles.actionsGrid}
      >
        <button className={styles.actionCard}>
          <Calendar size={32} />
          <h4>Create Event</h4>
          <p>Plan a new celebration</p>
        </button>
        <button className={styles.actionCard}>
          <Users size={32} />
          <h4>Manage Guests</h4>
          <p>RSVP & tracking</p>
        </button>
        <button className={styles.actionCard}>
          <DollarSign size={32} />
          <h4>Budget Tracker</h4>
          <p>Expenses & analytics</p>
        </button>
        <button className={styles.actionCard}>
          <BarChart3 size={32} />
          <h4>Reports</h4>
          <p>View insights</p>
        </button>
      </motion.div>
    </motion.div>
  );
}
