import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import styles from '../styles/seating.module.css';

export function SeatingChart({ tables = [], onAddTable, onUpdateTable, onDeleteTable }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 8,
    guests: []
  });

  const handleAddTable = () => {
    if (onAddTable) {
      onAddTable({ ...formData, id: Date.now() });
      setFormData({ name: '', capacity: 8, guests: [] });
      setShowForm(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const tableVariant = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    show: { opacity: 1, scale: 1, rotate: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h3>Seating Arrangement</h3>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          <span>Add Table</span>
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={styles.form}
        >
          <input
            type="text"
            placeholder="Table name (e.g., Table 1)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            min="1"
            max="20"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            className={styles.input}
            required
          />
          <div className={styles.actions}>
            <button type="button" onClick={handleAddTable} className={styles.submitBtn}>
              Add Table
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {tables.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
          <Users size={48} />
          <p>No tables configured yet</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className={styles.grid}>
          {tables.map((table) => (
            <motion.div
              key={table.id}
              variants={tableVariant}
              onClick={() => setSelectedTable(selectedTable?.id === table.id ? null : table)}
              className={`${styles.table} ${selectedTable?.id === table.id ? styles.selected : ''}`}
            >
              <div className={styles.tableTop}>
                <span className={styles.tableName}>{table.name}</span>
                <span className={styles.capacity}>
                  {table.guests?.length || 0}/{table.capacity}
                </span>
              </div>
              <div className={styles.tableBottom}>
                <div className={styles.guestCount}>
                  {Array.from({ length: table.capacity }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`${styles.seat} ${idx < (table.guests?.length || 0) ? styles.occupied : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.tableActions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTable?.(table.id);
                  }}
                  className={styles.deleteBtn}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedTable && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.details}
        >
          <h4>{selectedTable.name}</h4>
          <p>Capacity: {selectedTable.capacity} people</p>
          <p>Occupied: {selectedTable.guests?.length || 0} seats</p>
          {selectedTable.guests && selectedTable.guests.length > 0 && (
            <div className={styles.guestsList}>
              <p className={styles.guestsLabel}>Guests:</p>
              <ul>
                {selectedTable.guests.map((guest, idx) => (
                  <li key={idx}>{guest}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
