import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Heart, Check } from 'lucide-react';
import styles from '../styles/registry.module.css';

export function GiftRegistry({ gifts = [], onAdd, onEdit, onDelete, onMark }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'home',
    price: '',
    link: '',
    priority: 'medium',
    purchaser: ''
  });

  const categories = [
    { value: 'home', label: '🏠 Home & Kitchen' },
    { value: 'electronics', label: '📱 Electronics' },
    { value: 'fashion', label: '👗 Fashion' },
    { value: 'experience', label: '✈️ Experience' },
    { value: 'other', label: '📦 Other' }
  ];

  const handleSubmit = () => {
    if (onAdd) onAdd(formData);
    setFormData({ name: '', category: 'home', price: '', link: '', priority: 'medium', purchaser: '' });
    setShowForm(false);
  };

  const completedCount = gifts.filter(g => g.purchased).length;
  const totalValue = gifts.reduce((sum, g) => sum + (parseFloat(g.price) || 0), 0);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <div>
          <h3>Gift Registry</h3>
          <p className={styles.subtitle}>{completedCount} of {gifts.length} items purchased • ${totalValue.toFixed(2)} total</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          <span>Add Gift</span>
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={styles.form}
        >
          <div className={styles.formGrid}>
            <input
              type="text"
              placeholder="Gift name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={styles.input}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={styles.input}
            />
            <input
              type="url"
              placeholder="Product link (optional)"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className={styles.input}
            />
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className={styles.input}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="text"
              placeholder="Purchaser (optional)"
              value={formData.purchaser}
              onChange={(e) => setFormData({ ...formData, purchaser: e.target.value })}
              className={styles.input}
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={handleSubmit} className={styles.submitBtn}>
              Add Gift
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {gifts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
          <Heart size={48} />
          <p>No gifts in registry yet</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className={styles.list}>
          {gifts.map((gift, idx) => (
            <motion.div
              key={gift.id || idx}
              variants={item}
              className={`${styles.giftCard} ${gift.purchased ? styles.purchased : ''}`}
            >
              <div className={styles.giftContent}>
                <div className={styles.giftHeader}>
                  <h4>{gift.name}</h4>
                  <span className={`${styles.priority} ${styles[gift.priority]}`}>
                    {gift.priority}
                  </span>
                </div>
                <p className={styles.category}>
                  {categories.find(c => c.value === gift.category)?.label}
                </p>
                <div className={styles.giftMeta}>
                  <span className={styles.price}>${parseFloat(gift.price || 0).toFixed(2)}</span>
                  {gift.purchaser && <span className={styles.purchaser}>👤 {gift.purchaser}</span>}
                </div>
                {gift.link && (
                  <a href={gift.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    View product →
                  </a>
                )}
              </div>
              <div className={styles.giftActions}>
                <button
                  onClick={() => onMark?.(gift.id || idx)}
                  className={`${styles.markBtn} ${gift.purchased ? styles.marked : ''}`}
                  title={gift.purchased ? 'Mark as unpurchased' : 'Mark as purchased'}
                >
                  <Check size={18} />
                </button>
                <button onClick={() => onDelete?.(gift.id || idx)} className={styles.deleteBtn}>
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
