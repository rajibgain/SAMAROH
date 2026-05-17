import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import styles from '../styles/search.module.css';

export function SearchFilter({ items = [], searchFields = ['name', 'title'], onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let result = items;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(term);
        })
      );
    }

    // Advanced filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => item[key] === value);
      }
    });

    return result;
  }, [items, searchTerm, filters, searchFields]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all').length + (searchTerm ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className={styles.clearBtn}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <button
        className={`${styles.filterBtn} ${activeFilterCount > 0 ? styles.active : ''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={18} />
        <span>Filters</span>
        {activeFilterCount > 0 && <span className={styles.badge}>{activeFilterCount}</span>}
      </button>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={styles.filterPanel}
        >
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className={styles.filterItem}>
              <select
                value={value || 'all'}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                className={styles.select}
              >
                <option value="all">All {key}</option>
              </select>
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button onClick={handleClearFilters} className={styles.clearFiltersBtn}>
              Clear All Filters
            </button>
          )}
        </motion.div>
      )}

      <div className={styles.results}>
        <span className={styles.count}>
          {filteredItems.length} of {items.length} items
        </span>
      </div>

      {onFilter && onFilter(filteredItems)}
    </motion.div>
  );
}
