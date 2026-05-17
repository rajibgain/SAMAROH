import { motion } from 'framer-motion';
import { Clock, MapPin, Users } from 'lucide-react';
import styles from '../styles/timeline.module.css';

export function TimelineView({ events = [] }) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.time || a.date) - new Date(b.time || b.date)
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (events.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
        <Clock size={48} />
        <p>No events scheduled</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.timeline}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={styles.items}
        >
          {sortedEvents.map((event, idx) => (
            <motion.div
              key={event.id || idx}
              variants={item}
              className={styles.item}
            >
              <div className={styles.marker} />
              <div className={styles.content}>
                <div className={styles.header}>
                  <h4>{event.title || event.name}</h4>
                  <span className={styles.time}>
                    {new Date(event.time || event.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {event.description && <p className={styles.description}>{event.description}</p>}

                <div className={styles.meta}>
                  {event.location && (
                    <div className={styles.metaItem}>
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.attendees && (
                    <div className={styles.metaItem}>
                      <Users size={14} />
                      <span>{event.attendees} attending</span>
                    </div>
                  )}
                </div>

                {event.status && <span className={`${styles.badge} ${styles[event.status]}`}>{event.status}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
