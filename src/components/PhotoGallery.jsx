import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import styles from '../styles/gallery.module.css';

export function PhotoGallery({ photos = [], onUpload, eventId }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <h3>Event Gallery</h3>
        {onUpload && (
          <button className={styles.uploadBtn} onClick={onUpload}>
            <Upload size={18} />
            <span>Upload Photos</span>
          </button>
        )}
      </div>

      {photos.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.empty}>
          <Upload size={48} />
          <p>No photos yet</p>
          {onUpload && <p className={styles.hint}>Click "Upload Photos" to get started</p>}
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.grid}
          >
            {photos.map((photo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.photoCard}
                onClick={() => {
                  setSelectedPhoto(photo);
                  setCurrentIndex(idx);
                }}
              >
                <img src={photo.url || photo} alt={`Event photo ${idx + 1}`} />
                <div className={styles.overlay}>
                  <span>View</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.lightbox}
                onClick={() => setSelectedPhoto(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className={styles.lightboxContent}
                >
                  <button
                    className={styles.closeBtn}
                    onClick={() => setSelectedPhoto(null)}
                  >
                    <X size={24} />
                  </button>

                  <motion.img
                    src={selectedPhoto.url || selectedPhoto}
                    alt="Gallery view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={currentIndex}
                  />

                  <button className={styles.prevBtn} onClick={handlePrevious}>
                    <ChevronLeft size={28} />
                  </button>

                  <button className={styles.nextBtn} onClick={handleNext}>
                    <ChevronRight size={28} />
                  </button>

                  <div className={styles.counter}>
                    {currentIndex + 1} / {photos.length}
                  </div>

                  {selectedPhoto.uploadedBy && (
                    <div className={styles.info}>
                      <span>Uploaded by {selectedPhoto.uploadedBy}</span>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}
