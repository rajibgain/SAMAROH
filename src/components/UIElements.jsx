import { motion } from 'framer-motion';
import styles from '../styles/loader.module.css';

export function LoadingSkeleton({ count = 3, variant = 'card' }) {
  return (
    <motion.div className={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${styles.skeleton} ${styles[variant]}`}
        />
      ))}
    </motion.div>
  );
}

export function ProgressBar({ progress = 0, label, showPercent = true }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.progressContainer}
    >
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.bar}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        />
      </div>
      {showPercent && <span className={styles.percent}>{Math.round(progress)}%</span>}
    </motion.div>
  );
}

export function Card({ children, hover = true, className = '' }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 24px rgba(111, 82, 168, 0.15)' } : {}}
      className={`${styles.card} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Badge({ children, variant = 'default' }) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}

export function Divider() {
  return <div className={styles.divider} />;
}
