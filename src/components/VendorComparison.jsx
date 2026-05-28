import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, DollarSign, Check, X } from 'lucide-react';
import styles from '../styles/vendors.module.css';

const SAMPLE_VENDORS = {
  catering: [
    {
      id: 1,
      name: 'Royal Feast Catering',
      category: 'Catering',
      rating: 4.8,
      reviews: 156,
      price: 750,
      location: 'Downtown',
      phone: '+91-98765-43210',
      email: 'info@royalfeast.com',
      specialties: ['Indian', 'Chinese', 'Continental'],
      capacity: '500-2000 guests',
      features: ['Live cooking', 'Vegetarian options', 'Dietary accommodation']
    },
    {
      id: 2,
      name: 'Taste Buds Kitchen',
      category: 'Catering',
      rating: 4.6,
      reviews: 98,
      price: 650,
      location: 'Midtown',
      phone: '+91-98765-43211',
      email: 'hello@tastebuds.com',
      specialties: ['Indian', 'Fusion'],
      capacity: '300-1500 guests',
      features: ['Budget-friendly', 'Quick service', 'Customizable menu']
    }
  ],
  decoration: [
    {
      id: 3,
      name: 'Elite Decorators',
      category: 'Decoration',
      rating: 4.9,
      reviews: 203,
      price: 5000,
      location: 'All areas',
      phone: '+91-98765-43212',
      email: 'design@elitedecorators.com',
      specialties: ['Modern', 'Rustic', 'Traditional'],
      capacity: 'All event sizes',
      features: ['3D visualization', 'Premium flowers', 'LED setup']
    }
  ],
  photography: [
    {
      id: 4,
      name: 'Moments Studio',
      category: 'Photography',
      rating: 4.7,
      reviews: 142,
      price: 8000,
      location: 'Citywide',
      phone: '+91-98765-43213',
      email: 'book@momentsstudio.com',
      specialties: ['Candid', 'Traditional', 'Cinematic'],
      capacity: '4-12 hours',
      features: ['Drone coverage', 'Same-day highlights', 'Album included']
    }
  ]
};

export function VendorComparison({ eventType = 'general' }) {
  const [selectedCategory, setSelectedCategory] = useState('catering');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [filter, setFilter] = useState({ minRating: 0, maxPrice: Infinity });

  const vendors = SAMPLE_VENDORS[selectedCategory] || [];
  
  const filteredVendors = vendors.filter(v => 
    v.rating >= filter.minRating && v.price <= filter.maxPrice
  );

  const toggleVendorSelection = (vendorId) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const getSelectedVendorData = () => {
    return vendors.filter(v => selectedVendors.includes(v.id));
  };

  const categories = Object.keys(SAMPLE_VENDORS);

  return (
    <div className={styles.vendorContainer}>
      <div className={styles.header}>
        <h2>🎯 Smart Vendor Management</h2>
        <p>Find and compare the best vendors for your event</p>
      </div>

      {/* Category Selection */}
      <div className={styles.categoryTabs}>
        {categories.map(cat => (
          <motion.button
            key={cat}
            className={`${styles.tab} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedVendors([]);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label>Min Rating:</label>
          <select 
            value={filter.minRating}
            onChange={(e) => setFilter({...filter, minRating: parseFloat(e.target.value)})}
            className={styles.filterSelect}
          >
            <option value={0}>All Ratings</option>
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
            <option value={4.7}>4.7+</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Max Price:</label>
          <select 
            value={filter.maxPrice}
            onChange={(e) => setFilter({...filter, maxPrice: parseFloat(e.target.value) || Infinity})}
            className={styles.filterSelect}
          >
            <option value={Infinity}>Any Price</option>
            <option value={1000}>₹1,000</option>
            <option value={5000}>₹5,000</option>
            <option value={10000}>₹10,000+</option>
          </select>
        </div>

        <motion.button
          className={styles.compareBtn}
          onClick={() => setCompareMode(!compareMode)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {compareMode ? '✓ Comparing' : 'Compare'}
        </motion.button>
      </div>

      {/* Vendor Grid */}
      <div className={styles.vendorGrid}>
        {filteredVendors.map((vendor, idx) => (
          <motion.div
            key={vendor.id}
            className={`${styles.vendorCard} ${compareMode && selectedVendors.includes(vendor.id) ? styles.selected : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {compareMode && (
              <div className={styles.selectCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => toggleVendorSelection(vendor.id)}
                />
              </div>
            )}

            <div className={styles.vendorHeader}>
              <h3>{vendor.name}</h3>
              <div className={styles.ratingBadge}>
                <Star size={16} fill="#fbbf24" className={styles.starIcon} />
                <span>{vendor.rating}</span>
                <span className={styles.reviews}>({vendor.reviews})</span>
              </div>
            </div>

            <div className={styles.vendorInfo}>
              <div className={styles.infoItem}>
                <DollarSign size={16} />
                <span>₹{vendor.price}/head</span>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={16} />
                <span>{vendor.location}</span>
              </div>
            </div>

            <div className={styles.specialties}>
              {vendor.specialties.map(spec => (
                <span key={spec} className={styles.tag}>{spec}</span>
              ))}
            </div>

            <div className={styles.features}>
              {vendor.features.map(feature => (
                <div key={feature} className={styles.feature}>
                  <Check size={14} className={styles.checkIcon} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className={styles.contact}>
              <a href={`tel:${vendor.phone}`} className={styles.contactBtn}>
                <Phone size={16} />
                Call
              </a>
              <a href={`mailto:${vendor.email}`} className={styles.contactBtn}>
                <Mail size={16} />
                Email
              </a>
            </div>

            <motion.button
              className={styles.selectBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Comparison View */}
      {compareMode && selectedVendors.length > 0 && (
        <motion.div
          className={styles.comparisonView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Vendor Comparison</h3>
          <div className={styles.comparisonTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Feature</div>
              {getSelectedVendorData().map(v => (
                <div key={v.id} className={styles.tableCell}>{v.name}</div>
              ))}
            </div>
            
            {['rating', 'price', 'capacity'].map(feature => (
              <div key={feature} className={styles.tableRow}>
                <div className={styles.tableCell}>{feature.charAt(0).toUpperCase() + feature.slice(1)}</div>
                {getSelectedVendorData().map(v => (
                  <div key={v.id} className={styles.tableCell}>
                    {feature === 'price' ? `₹${v[feature]}` : 
                     feature === 'rating' ? `${v[feature]} ⭐` : v[feature]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {filteredVendors.length === 0 && (
        <div className={styles.emptyState}>
          <p>No vendors found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
