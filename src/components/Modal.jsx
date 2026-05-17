import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import styles from '../styles/modal.module.css';

export function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={styles.backdrop}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`${styles.modal} ${styles[size]}`}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              <button
                onClick={onClose}
                className={styles.close}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.content}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
