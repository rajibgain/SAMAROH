import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertCircle, CheckCircle, Info, Clock, X } from 'lucide-react';
import { GUEST_STATUS } from '../constants';
import styles from '../styles/notifications.module.css';

export function SmartNotificationHub({ tasks = [], guests = [], expenses = [], event = {} }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Generate smart notifications based on event data
  useEffect(() => {
    const generatedNotifications = generateSmartNotifications({ tasks, guests, expenses, event });
    setNotifications(generatedNotifications);
    setUnreadCount(generatedNotifications.filter(n => !n.read).length);
  }, [tasks, guests, expenses, event]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertCircle size={20} className={styles.warningIcon} />;
      case 'success':
        return <CheckCircle size={20} className={styles.successIcon} />;
      case 'info':
        return <Info size={20} className={styles.infoIcon} />;
      case 'deadline':
        return <Clock size={20} className={styles.deadlineIcon} />;
      default:
        return <Bell size={20} className={styles.defaultIcon} />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <>
      {/* Notification Bell Icon */}
      <motion.button
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <motion.span 
            className={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              className={styles.notificationPanel}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className={styles.panelHeader}>
                <h3>Notifications</h3>
                <button 
                  className={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Notifications List */}
              <div className={styles.notificationsList}>
                <AnimatePresence mode="popLayout">
                  {notifications.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Bell size={40} />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif, idx) => (
                      <motion.div
                        key={notif.id}
                        className={`${styles.notification} ${styles[notif.type]} ${notif.read ? styles.read : ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.05 }}
                        layout
                      >
                        <div className={styles.iconWrapper}>
                          {getNotificationIcon(notif.type)}
                        </div>

                        <div className={styles.content}>
                          <h4>{notif.title}</h4>
                          <p>{notif.message}</p>
                          <span className={styles.timestamp}>
                            {formatTime(notif.timestamp)}
                          </span>
                        </div>

                        <div className={styles.actions}>
                          {!notif.read && (
                            <button
                              className={styles.actionBtn}
                              onClick={() => dismissNotification(notif.id)}
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeNotification(notif.id)}
                            title="Dismiss"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className={styles.panelFooter}>
                  <button 
                    className={styles.clearAll}
                    onClick={() => {
                      setNotifications([]);
                      setUnreadCount(0);
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notifications (for new alerts) */}
      <div className={styles.toastContainer}>
        <AnimatePresence>
          {unreadNotifications.slice(0, 3).map(notif => (
            <motion.div
              key={`toast-${notif.id}`}
              className={`${styles.toast} ${styles[notif.type]}`}
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.toastIcon}>
                {getNotificationIcon(notif.type)}
              </div>
              <div className={styles.toastContent}>
                <p className={styles.toastTitle}>{notif.title}</p>
                <p className={styles.toastMessage}>{notif.message}</p>
              </div>
              <button
                className={styles.toastClose}
                onClick={() => dismissNotification(notif.id)}
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

// Helper function to generate smart notifications
function generateSmartNotifications({ tasks = [], guests = [], expenses = [], event = {} }) {
  const notifs = [];
  let id = 1;

  // Task-related notifications
  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && !t.completed;
  });

  if (overdueTasks.length > 0) {
    notifs.push({
      id: id++,
      type: 'warning',
      title: `${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? 's' : ''}`,
      message: `${overdueTasks.map(t => t.taskName).join(', ')} need immediate attention.`,
      timestamp: new Date(),
      read: false
    });
  }

  const dueSoonTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    const daysUntil = (dueDate - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntil > 0 && daysUntil <= 3 && !t.completed;
  });

  if (dueSoonTasks.length > 0) {
    notifs.push({
      id: id++,
      type: 'deadline',
      title: 'Tasks Due Soon',
      message: `${dueSoonTasks.length} task(s) due in the next 3 days. Plan accordingly!`,
      timestamp: new Date(),
      read: false
    });
  }

  // Guest-related notifications
  const pendingRsvp = guests.filter(g => g.status === GUEST_STATUS.PENDING);
  
  if (pendingRsvp.length > 10) {
    notifs.push({
      id: id++,
      type: 'warning',
      title: 'Low RSVP Response',
      message: `${pendingRsvp.length} guests haven't confirmed yet. Send reminders to boost response.`,
      timestamp: new Date(),
      read: false
    });
  }

  if (guests.length === 0) {
    notifs.push({
      id: id++,
      type: 'info',
      title: 'No Guests Added',
      message: 'Start building your guest list to get organized!',
      timestamp: new Date(),
      read: true
    });
  }

  // Expense notifications
  if (expenses.length > 0) {
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    notifs.push({
      id: id++,
      type: 'info',
      title: 'Budget Update',
      message: `Total expenses: ₹${totalExpenses.toFixed(2)}. Track spending carefully!`,
      timestamp: new Date(),
      read: true
    });
  }

  // Event-related notifications
  if (event.date) {
    const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil === 7) {
      notifs.push({
        id: id++,
        type: 'deadline',
        title: 'One Week to Go! 🎉',
        message: 'Final preparations countdown begins. Review your checklist!',
        timestamp: new Date(),
        read: false
      });
    }

    if (daysUntil === 1) {
      notifs.push({
        id: id++,
        type: 'deadline',
        title: 'Event Tomorrow! 🚀',
        message: 'Last-minute checks and final confirmations needed.',
        timestamp: new Date(),
        read: false
      });
    }

    if (daysUntil === 0) {
      notifs.push({
        id: id++,
        type: 'success',
        title: 'Event Day is Here! 🎊',
        message: 'Wishing you a wonderful celebration! Enjoy every moment!',
        timestamp: new Date(),
        read: false
      });
    }
  }

  // Task completion milestone
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  if (totalTasks > 0 && completedTasks === totalTasks) {
    notifs.push({
      id: id++,
      type: 'success',
      title: 'All Tasks Completed! 🎯',
      message: 'Excellent work! You\'ve completed all event tasks.',
      timestamp: new Date(),
      read: false
    });
  } else if (totalTasks > 0 && completedTasks > 0 && (completedTasks / totalTasks) >= 0.75) {
    notifs.push({
      id: id++,
      type: 'success',
      title: 'Great Progress! 💪',
      message: `${completedTasks}/${totalTasks} tasks completed. Keep it up!`,
      timestamp: new Date(),
      read: true
    });
  }

  return notifs.sort((a, b) => b.timestamp - a.timestamp);
}

// Helper function to format time
function formatTime(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}
