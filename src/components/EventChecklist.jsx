import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import styles from '../styles/checklist.module.css';

export function EventChecklist({ items = [], onAdd, onToggle, onDelete, title = 'Event Checklist' }) {
  const [newItem, setNewItem] = useState('');
  const completedCount = items.filter(i => i.completed).length;

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd?.(newItem);
      setNewItem('');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.03 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h3>{title}</h3>
        <div className={styles.progress}>
          {completedCount}/{items.length}
        </div>
      </div>

      <div className={styles.progressBar}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${items.length ? (completedCount / items.length) * 100 : 0}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {items.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={styles.list}
        >
          {items.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              variants={item}
              className={`${styles.item} ${item.completed ? styles.completed : ''}`}
            >
              <button
                onClick={() => onToggle?.(item.id || idx)}
                className={styles.checkbox}
              >
                {item.completed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Circle size={20} />
                )}
              </button>
              <span className={styles.text}>{item.text || item.name}</span>
              {item.dueDate && (
                <span className={styles.date}>
                  {new Date(item.dueDate).toLocaleDateString()}
                </span>
              )}
              <button
                onClick={() => onDelete?.(item.id || idx)}
                className={styles.deleteBtn}
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className={styles.addItem}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className={styles.input}
        />
        <button onClick={handleAdd} className={styles.addBtn}>
          <Plus size={18} />
        </button>
      </div>
    </motion.div>
  );
}
