import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';
import styles from '../styles/toast.module.css';

const iconMap = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertCircle size={20} />,
  info: <Info size={20} />
};

export function Toast() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, x: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`${styles.toast} ${styles[notification.type]}`}
          >
            <div className={styles.icon}>{iconMap[notification.type]}</div>
            <span className={styles.message}>{notification.message}</span>
            <button 
              onClick={() => removeNotification(notification.id)}
              className={styles.close}
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
