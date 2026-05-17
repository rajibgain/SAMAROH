import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Phone, Mail, MapPin, Star } from 'lucide-react';
import styles from '../styles/vendor.module.css';

export function VendorManagement({ vendors = [], onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'catering',
    contact: '',
    email: '',
    address: '',
    rating: 5,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onEdit?.(editingId, formData);
      setEditingId(null);
    } else {
      onAdd?.(formData);
    }
    setFormData({
      name: '',
      category: 'catering',
      contact: '',
      email: '',
      address: '',
      rating: 5,
      notes: ''
    });
    setShowForm(false);
  };

  const categories = [
    { value: 'catering', label: '🍽️ Catering' },
    { value: 'photography', label: '📷 Photography' },
    { value: 'decoration', label: '🎨 Decoration' },
    { value: 'venue', label: '🏛️ Venue' },
    { value: 'entertainment', label: '🎵 Entertainment' },
    { value: 'transport', label: '🚗 Transport' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
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
        <h3>Vendor Management</h3>
        <button
          className={styles.addBtn}
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={20} />
          <span>Add Vendor</span>
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div className={styles.formGrid}>
            <input
              type="text"
              placeholder="Vendor name"
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
              type="tel"
              placeholder="Phone"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={styles.input}
            />
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className={styles.input}
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} ⭐</option>
              ))}
            </select>
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={styles.textarea}
              rows="2"
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn}>
              {editingId ? 'Update Vendor' : 'Add Vendor'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {vendors.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
          <p>No vendors added yet</p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className={styles.list}>
          {vendors.map((vendor) => (
            <motion.div
              key={vendor.id}
              variants={itemVariants}
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h4>{vendor.name}</h4>
                  <span className={styles.category}>
                    {categories.find(c => c.value === vendor.category)?.label}
                  </span>
                </div>
                <div className={styles.rating}>
                  {'⭐'.repeat(vendor.rating || 5)}
                </div>
                <div className={styles.details}>
                  {vendor.contact && (
                    <a href={`tel:${vendor.contact}`} className={styles.detail}>
                      <Phone size={16} /> {vendor.contact}
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} className={styles.detail}>
                      <Mail size={16} /> {vendor.email}
                    </a>
                  )}
                  {vendor.address && (
                    <div className={styles.detail}>
                      <MapPin size={16} /> {vendor.address}
                    </div>
                  )}
                </div>
                {vendor.notes && <p className={styles.notes}>{vendor.notes}</p>}
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => {
                    setFormData(vendor);
                    setEditingId(vendor.id);
                    setShowForm(true);
                  }}
                  className={styles.editBtn}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete?.(vendor.id)}
                  className={styles.deleteBtn}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
