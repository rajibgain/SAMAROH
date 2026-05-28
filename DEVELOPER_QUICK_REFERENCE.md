# SAMAROH Code Quality - Developer Quick Reference

## 🎯 Quick Access Guide

### Constants Reference

```javascript
// Import all constants needed
import {
  EVENT_TYPES,
  EVENT_STATUS,
  GUEST_STATUS,
  TASK_CATEGORIES,
  TASK_STATUS,
  TASK_PRIORITY,
  USER_ROLES,
  JOB_ROLES,
  EXPENSE_CATEGORIES,
  COLORS,
  CHART_COLORS,
  VALIDATION_MESSAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  UI_LABELS,
} from '../constants';
```

---

## 📋 Event Management Constants

```javascript
// Event Types
EVENT_TYPES.WEDDING       // 'wedding'
EVENT_TYPES.BIRTHDAY      // 'birthday'
EVENT_TYPES.ANNIVERSARY   // 'anniversary'
EVENT_TYPES.CORPORATE     // 'corporate'
EVENT_TYPES.FESTIVAL      // 'festival'

// Event Status
EVENT_STATUS.PLANNING     // 'planning'
EVENT_STATUS.ONGOING      // 'ongoing'
EVENT_STATUS.COMPLETED    // 'completed'
EVENT_STATUS.CANCELLED    // 'cancelled'

// Display Labels (with emojis)
EVENT_TYPE_LABELS[event.eventType]      // '💒 Wedding', '🎂 Birthday', etc.
EVENT_STATUS_LABELS[event.status]       // '📋 Planning', '✅ Completed', etc.
```

---

## 👥 Guest Management Constants

```javascript
// Guest Status
GUEST_STATUS.PENDING      // 'pending'
GUEST_STATUS.CONFIRMED    // 'confirmed'
GUEST_STATUS.DECLINED     // 'declined'

// Display Labels (with emojis)
GUEST_STATUS_LABELS.pending    // '⏳ Pending'
GUEST_STATUS_LABELS.confirmed  // '✅ Confirmed'
GUEST_STATUS_LABELS.declined   // '❌ Declined'

// Example Usage
const pendingGuests = guests.filter(g => g.status === GUEST_STATUS.PENDING);
const label = GUEST_STATUS_LABELS[guest.status];
```

---

## ✅ Task Management Constants

```javascript
// Task Status
TASK_STATUS.PENDING       // 'pending'
TASK_STATUS.IN_PROGRESS   // 'in_progress'
TASK_STATUS.COMPLETED     // 'completed'

// Task Categories
TASK_CATEGORIES.FOOD      // 'food'
TASK_CATEGORIES.DECORATION
TASK_CATEGORIES.VENUE
TASK_CATEGORIES.ENTERTAINMENT
TASK_CATEGORIES.PHOTOGRAPHY
TASK_CATEGORIES.INVITATION
TASK_CATEGORIES.LOGISTICS
TASK_CATEGORIES.OTHER

// Task Priority
TASK_PRIORITY.LOW         // 'low'
TASK_PRIORITY.MEDIUM      // 'medium'
TASK_PRIORITY.HIGH        // 'high'

// Display Labels (with icons)
TASK_STATUS_LABELS.completed      // '✅ Completed'
TASK_CATEGORY_LABELS.decoration   // '✨ Decoration'
TASK_PRIORITY_LABELS.high         // '🔴 High'

// Example Usage
const completedTasks = tasks.filter(t => t.status === TASK_STATUS.COMPLETED);
const icon = TASK_CATEGORY_LABELS[task.category];
```

---

## 💰 Expense Management Constants

```javascript
// Expense Categories
EXPENSE_CATEGORIES.FOOD
EXPENSE_CATEGORIES.DECORATION
EXPENSE_CATEGORIES.VENUE
EXPENSE_CATEGORIES.ENTERTAINMENT
EXPENSE_CATEGORIES.GUEST_GIFTS
EXPENSE_CATEGORIES.TRANSPORT
EXPENSE_CATEGORIES.OTHER

// Display Labels (with emojis)
EXPENSE_CATEGORY_LABELS.food        // '🍽️ Food'
EXPENSE_CATEGORY_LABELS.decoration  // '✨ Decoration'

// Chart Colors for Categories
CHART_COLORS.CATERING       // '#6366f1'
CHART_COLORS.DECORATION     // '#10b981'
CHART_COLORS.PHOTOGRAPHY    // '#ef4444'

// Example Usage
const foodExpenses = expenses.filter(e => e.category === EXPENSE_CATEGORIES.FOOD);
const total = expenses.reduce((sum, e) => sum + e.amount, 0);
```

---

## 🎨 Color Constants (Brand Palette)

```javascript
// Primary Colors (SAMAROH Brand)
COLORS.PRIMARY         // '#8e70c1' (Purple)
COLORS.PRIMARY_DARK    // '#6f52a8' (Dark Purple)
COLORS.PRIMARY_LIGHT   // '#ede4f7' (Light Purple)

// Secondary
COLORS.SECONDARY       // '#f8bbd0' (Pink)
COLORS.SECONDARY_LIGHT // '#fce4ec'

// Status Colors
COLORS.SUCCESS         // '#4caf50' (Green)
COLORS.SUCCESS_LIGHT   // '#dcfce7'
COLORS.WARNING         // '#ff9800' (Orange)
COLORS.WARNING_LIGHT   // '#fef3c7'
COLORS.DANGER          // '#f44336' (Red)
COLORS.DANGER_LIGHT    // '#fef2f2'
COLORS.INFO            // '#2196f3' (Blue)
COLORS.INFO_LIGHT      // '#dbeafe'

// Semantic Colors
COLORS.INDIGO, COLORS.EMERALD, COLORS.AMBER, COLORS.PINK, COLORS.CYAN, COLORS.VIOLET

// Neutral Colors
COLORS.GRAY_50, COLORS.GRAY_100, ..., COLORS.GRAY_900
COLORS.WHITE, COLORS.BLACK

// Example Usage
backgroundColor: COLORS.PRIMARY
color: COLORS.GRAY_700
borderColor: COLORS.PRIMARY_LIGHT
```

---

## 🖼️ CSS Module Classes

```javascript
import styles from '../styles/components.module.css';

// Buttons
<button className={styles.btn}>Default</button>
<button className={styles.btnPrimary}>Create</button>
<button className={styles.btnSuccess}>Save</button>
<button className={styles.btnClose}>Close</button>

// Forms
<form className={styles.form}>
  <input className={styles.input} />
  <select className={styles.select} />
  <textarea className={styles.textarea} />
</form>

// Cards & Sections
<div className={styles.section}>
  <h3>Section Title</h3>
</div>

<div className={styles.card}>
  <div className={styles.cardHeader}>
    <h4>Card Title</h4>
  </div>
  <div className={styles.cardInfo}>Card info</div>
</div>

// Lists
<div className={styles.list}>
  <div className={styles.listItem}>
    <div className={styles.itemContent}>
      <h4>Item</h4>
      <p>Description</p>
    </div>
    <div className={styles.itemActions}>
      {/* Actions here */}
    </div>
  </div>
</div>

// Tasks
<div className={styles.taskItem} data-status="completed">
  <input type="checkbox" className={styles.checkbox} />
  <div className={styles.taskContent}>
    <div className={styles.taskDetails}>
      <h4>Task Title</h4>
      <span className={styles.taskCategory}>Category</span>
    </div>
  </div>
</div>

// Status Badges
<span className={styles.badgePresent}>Present</span>
<span className={styles.badgeAway}>Away</span>
<span className={styles.badgePending}>Pending</span>

// Grid Layouts
<div className={styles.grid}>
  {/* Auto-fill responsive grid */}
</div>

// Statistics
<div className={styles.stats}>
  <div className={styles.statBox}>
    <span className={styles.statNumber}>42</span>
    <span className={styles.statLabel}>Label</span>
  </div>
</div>

// Timeline
<div className={styles.timeline}>
  <div className={styles.timelineItem}>
    <div className={styles.timelineContent}>
      <div className={styles.timelineHeader}>
        <h4>Event</h4>
        <span className={styles.time}>10:30 AM</span>
      </div>
      <p>Description</p>
    </div>
  </div>
</div>
```

---

## 📱 Responsive Design Pattern

```css
/* All CSS files follow mobile-first responsive approach */

/* Mobile (default, < 480px) */
.container { grid-template-columns: 1fr; }

/* Tablet (480px+) */
@media (min-width: 480px) {
  .container { grid-template-columns: 1fr; }
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container { grid-template-columns: 1fr 1fr; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container { grid-template-columns: repeat(3, 1fr); }
}

/* Key Features */
/* ✅ Min touch target: 44px x 44px */
/* ✅ Input font-size: 16px (prevents iOS zoom) */
/* ✅ Full-width forms on mobile */
/* ✅ Cards stack vertically */
/* ✅ Modals: Full screen on mobile, centered on desktop */
/* ✅ Tables: Horizontal scroll or card layout on mobile */
```

---

## ✨ Best Practices

### ❌ DON'T Do This:
```javascript
// Hardcoded strings
if (guest.status === 'confirmed') { }
const color = '#8e70c1';
style={{ backgroundColor: 'red' }}

// Inline styles
<button style={{ backgroundColor: '#8e70c1', padding: '10px' }}>
  Click
</button>
```

### ✅ DO This Instead:
```javascript
// Use constants
import { GUEST_STATUS, COLORS } from '../constants';

if (guest.status === GUEST_STATUS.CONFIRMED) { }
const color = COLORS.PRIMARY;

// Use CSS modules
import styles from '../styles/components.module.css';
<button className={styles.btnPrimary}>Click</button>
```

---

## 🔧 Common Patterns

### Pattern 1: Status Filter
```javascript
const confirmedGuests = guests.filter(
  g => g.status === GUEST_STATUS.CONFIRMED
);
```

### Pattern 2: Status Label
```javascript
const statusLabel = GUEST_STATUS_LABELS[guest.status];
// Returns: '✅ Confirmed' or '⏳ Pending', etc.
```

### Pattern 3: Conditional Styling
```javascript
<div 
  className={
    guest.status === GUEST_STATUS.CONFIRMED 
      ? styles.confirmed 
      : styles.pending
  }
>
  {statusLabel}
</div>
```

### Pattern 4: Form Select with Options
```javascript
<select className={styles.select}>
  {GUEST_STATUS_OPTIONS.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

### Pattern 5: Responsive Grid
```javascript
<div className={styles.grid}>
  {items.map(item => (
    <div key={item.id} className={styles.card}>
      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3+ columns */}
    </div>
  ))}
</div>
```

---

## 📚 Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| `src/constants/index.js` | All app constants & enums | 488 |
| `src/styles/components.module.css` | Main component styles | 1251 |
| `src/styles/dashboard.module.css` | Dashboard-specific styles | - |
| `src/styles/auth.module.css` | Auth-specific styles | - |
| `src/styles/notifications.module.css` | Notification styles | - |
| `src/styles/vendors.module.css` | Vendor styling | - |
| `src/styles/modal.module.css` | Modal styling | - |

---

## 🐛 Debugging Tips

### Check What Constants Are Available:
```javascript
import * as Constants from '../constants';
console.log(Constants);
```

### Check CSS Classes:
```javascript
import styles from '../styles/components.module.css';
console.log(styles);
```

### Verify Responsive Breakpoints:
Open DevTools → Device Toolbar → Set viewport widths to:
- 320px (small phone)
- 480px (phone)
- 768px (tablet)
- 1024px (desktop)

---

## 📖 Documentation Files

- `CODE_QUALITY_AUDIT_SUMMARY.md` - Complete audit report
- `/memories/repo/code-quality-overhaul.md` - Progress tracking
- This file - Quick reference guide

---

**Last Updated**: May 27, 2026  
**Status**: ✅ All systems verified and operational
