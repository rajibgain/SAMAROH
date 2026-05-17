import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  Users, CheckCircle2, AlertCircle, MessageSquare, FileText,
  Clock, User, DollarSign, Calendar
} from 'lucide-react';
import styles from '../styles/activity.module.css';

const activityIcons = {
  member_added: <Users size={18} />,
  task_completed: <CheckCircle2 size={18} />,
  expense_added: <DollarSign size={18} />,
  guest_updated: <User size={18} />,
  comment: <MessageSquare size={18} />,
  event_created: <Calendar size={18} />,
  alert: <AlertCircle size={18} />
};

export function ActivityLog({ activities = [], maxItems = 10 }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (activities.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
        <Clock size={32} />
        <p>No activity yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={styles.container}
    >
      <div className={styles.header}>
        <h3>Recent Activity</h3>
        <span className={styles.count}>{activities.length} items</span>
      </div>

      <div className={styles.list}>
        {activities.slice(0, maxItems).map((activity, idx) => (
          <motion.div
            key={activity.id || idx}
            variants={item}
            className={`${styles.item} ${styles[activity.type]}`}
          >
            <div className={styles.iconWrapper}>
              {activityIcons[activity.type] || <FileText size={18} />}
            </div>
            <div className={styles.content}>
              <p className={styles.message}>{activity.message}</p>
              <span className={styles.time}>
                {activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : 'Just now'}
              </span>
            </div>
            {activity.user && (
              <span className={styles.user}>{activity.user}</span>
            )}
          </motion.div>
        ))}
      </div>

      {activities.length > maxItems && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.more}>
          View all {activities.length} activities
        </motion.div>
      )}
    </motion.div>
  );
}
