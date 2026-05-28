/**
 * Global Constants for SAMAROH Application
 * Centralized source for all magic strings and hardcoded values
 */

// ============================================================
// EVENT TYPES
// ============================================================
export const EVENT_TYPES = {
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  CORPORATE: 'corporate',
  FESTIVAL: 'festival',
};

export const EVENT_TYPE_LABELS = {
  wedding: '💒 Wedding',
  birthday: '🎂 Birthday',
  anniversary: '💕 Anniversary',
  corporate: '🏢 Corporate Event',
  festival: '🎉 Festival / Puja',
};

export const EVENT_TYPE_OPTIONS = [
  { value: EVENT_TYPES.WEDDING, label: EVENT_TYPE_LABELS.wedding },
  { value: EVENT_TYPES.BIRTHDAY, label: EVENT_TYPE_LABELS.birthday },
  { value: EVENT_TYPES.ANNIVERSARY, label: EVENT_TYPE_LABELS.anniversary },
  { value: EVENT_TYPES.CORPORATE, label: EVENT_TYPE_LABELS.corporate },
  { value: EVENT_TYPES.FESTIVAL, label: EVENT_TYPE_LABELS.festival },
];

// ============================================================
// EVENT STATUS
// ============================================================
export const EVENT_STATUS = {
  PLANNING: 'planning',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const EVENT_STATUS_LABELS = {
  planning: '📋 Planning',
  ongoing: '🔄 Ongoing',
  completed: '✅ Completed',
  cancelled: '❌ Cancelled',
};

// ============================================================
// GUEST STATUS
// ============================================================
export const GUEST_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
};

export const GUEST_STATUS_LABELS = {
  pending: '⏳ Pending',
  confirmed: '✅ Confirmed',
  declined: '❌ Declined',
};

export const GUEST_STATUS_OPTIONS = [
  { value: GUEST_STATUS.PENDING, label: GUEST_STATUS_LABELS.pending },
  { value: GUEST_STATUS.CONFIRMED, label: GUEST_STATUS_LABELS.confirmed },
  { value: GUEST_STATUS.DECLINED, label: GUEST_STATUS_LABELS.declined },
];

// ============================================================
// TASK CATEGORIES
// ============================================================
export const TASK_CATEGORIES = {
  FOOD: 'food',
  DECORATION: 'decoration',
  VENUE: 'venue',
  ENTERTAINMENT: 'entertainment',
  PHOTOGRAPHY: 'photography',
  INVITATION: 'invitation',
  LOGISTICS: 'logistics',
  OTHER: 'other',
};

export const TASK_CATEGORY_LABELS = {
  food: '🍽️ Food & Catering',
  decoration: '✨ Decoration',
  venue: '🏛️ Venue',
  entertainment: '🎵 Entertainment',
  photography: '📷 Photography',
  invitation: '📬 Invitations',
  logistics: '🚚 Logistics',
  other: '📌 Other',
};

export const TASK_CATEGORY_OPTIONS = Object.entries(TASK_CATEGORIES).map(([key, value]) => ({
  value,
  label: TASK_CATEGORY_LABELS[value],
}));

// ============================================================
// TASK STATUS
// ============================================================
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const TASK_STATUS_LABELS = {
  pending: '📌 Pending',
  in_progress: '⏳ In Progress',
  completed: '✅ Completed',
};

export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.PENDING, label: TASK_STATUS_LABELS.pending },
  { value: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS.in_progress },
  { value: TASK_STATUS.COMPLETED, label: TASK_STATUS_LABELS.completed },
];

// ============================================================
// TASK PRIORITY
// ============================================================
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const TASK_PRIORITY_LABELS = {
  low: '🟢 Low',
  medium: '🟡 Medium',
  high: '🔴 High',
};

export const TASK_PRIORITY_OPTIONS = [
  { value: TASK_PRIORITY.LOW, label: TASK_PRIORITY_LABELS.low },
  { value: TASK_PRIORITY.MEDIUM, label: TASK_PRIORITY_LABELS.medium },
  { value: TASK_PRIORITY.HIGH, label: TASK_PRIORITY_LABELS.high },
];

// ============================================================
// JOB ROLES (For Family Members)
// ============================================================
export const JOB_ROLES = {
  FOOD_SERVICE: 'food-service',
  DECORATION: 'decoration',
  VENUE_SETUP: 'venue-setup',
  GUEST_RELATIONS: 'guest-relations',
  PHOTOGRAPHY: 'photography',
  LOGISTICS: 'logistics',
  CEREMONY: 'ceremony',
  OTHER: 'other',
};

export const JOB_ROLE_LABELS = {
  'food-service': '🍽️ Food Service',
  'decoration': '✨ Decoration',
  'venue-setup': '🏛️ Venue Setup',
  'guest-relations': '🤝 Guest Relations',
  'photography': '📷 Photography',
  'logistics': '🚚 Logistics',
  'ceremony': '🎙️ Ceremony',
  'other': '📌 Other',
};

export const JOB_ROLE_OPTIONS = Object.entries(JOB_ROLES).map(([key, value]) => ({
  value,
  label: JOB_ROLE_LABELS[value],
}));

// ============================================================
// USER ROLES
// ============================================================
export const USER_ROLES = {
  COORDINATOR: 'coordinator',
  MEMBER: 'member',
};

export const USER_ROLE_LABELS = {
  coordinator: '👑 Coordinator',
  member: '👤 Family Member',
};

export const MEMBER_ROLES = {
  ORGANIZER: 'organizer',
  COORDINATOR: 'coordinator',
  VENDOR_MANAGER: 'vendor-manager',
  GUEST_MANAGER: 'guest-manager',
  BUDGET_MANAGER: 'budget-manager',
};

export const MEMBER_ROLE_LABELS = {
  organizer: 'Organizer',
  coordinator: 'Coordinator',
  'vendor-manager': 'Vendor Manager',
  'guest-manager': 'Guest Manager',
  'budget-manager': 'Budget Manager',
};

export const MEMBER_ROLE_OPTIONS = Object.entries(MEMBER_ROLES).map(([key, value]) => ({
  value,
  label: MEMBER_ROLE_LABELS[value],
}));

// ============================================================
// EXPENSE CATEGORIES
// ============================================================
export const EXPENSE_CATEGORIES = {
  FOOD: 'food',
  DECORATION: 'decoration',
  VENUE: 'venue',
  ENTERTAINMENT: 'entertainment',
  GUEST_GIFTS: 'guest-gifts',
  TRANSPORT: 'transport',
  OTHER: 'other',
};

export const EXPENSE_CATEGORY_LABELS = {
  food: '🍽️ Food',
  decoration: '✨ Decoration',
  venue: '🏛️ Venue',
  entertainment: '🎵 Entertainment',
  'guest-gifts': '🎁 Guest Gifts',
  transport: '🚗 Transportation',
  other: '📌 Other',
};

export const EXPENSE_CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORIES).map(([key, value]) => ({
  value,
  label: EXPENSE_CATEGORY_LABELS[value],
}));

// ============================================================
// COLORS - SAMAROH BRAND PALETTE
// ============================================================
export const COLORS = {
  // Primary Colors
  PRIMARY: '#8e70c1',
  PRIMARY_DARK: '#6f52a8',
  PRIMARY_LIGHT: '#ede4f7',

  // Secondary Colors
  SECONDARY: '#f8bbd0',
  SECONDARY_LIGHT: '#fce4ec',

  // Status Colors
  SUCCESS: '#4caf50',
  SUCCESS_LIGHT: '#dcfce7',
  WARNING: '#ff9800',
  WARNING_LIGHT: '#fef3c7',
  DANGER: '#f44336',
  DANGER_LIGHT: '#fef2f2',
  INFO: '#2196f3',
  INFO_LIGHT: '#dbeafe',

  // Semantic Colors (from Tailwind palette)
  INDIGO: '#6366f1',
  INDIGO_LIGHT: '#e0e7ff',
  EMERALD: '#10b981',
  EMERALD_LIGHT: '#d1fae5',
  AMBER: '#f59e0b',
  AMBER_LIGHT: '#fef3c7',
  PINK: '#ec4899',
  CYAN: '#06b6d4',
  VIOLET: '#8b5cf6',

  // Neutral Colors
  GRAY_50: '#f9fafb',
  GRAY_100: '#f3f4f6',
  GRAY_200: '#e5e7eb',
  GRAY_300: '#d1d5db',
  GRAY_400: '#9ca3af',
  GRAY_500: '#6b7280',
  GRAY_600: '#4b5563',
  GRAY_700: '#374151',
  GRAY_800: '#1f2937',
  GRAY_900: '#111827',

  // Utility Colors
  WHITE: '#ffffff',
  BLACK: '#000000',
};

// ============================================================
// CHART COLORS
// ============================================================
export const CHART_COLORS = {
  CATERING: '#6366f1',
  VENUE: '#ec4899',
  DECORATION: '#10b981',
  ENTERTAINMENT: '#f59e0b',
  PHOTOGRAPHY: '#ef4444',
  GIFTS: '#8b5cf6',
  TRANSPORTATION: '#06b6d4',
  OTHER: '#6b7280',
};

export const CHART_COLOR_ARRAY = [
  '#8e70c1',
  '#f8bbd0',
  '#ffab91',
  '#ffd54f',
  '#81c784',
  '#64b5f6',
];

// ============================================================
// VALIDATION MESSAGES
// ============================================================
export const VALIDATION_MESSAGES = {
  // Generic
  REQUIRED: 'This field is required',
  INVALID: 'This field is invalid',

  // Field-specific
  EVENT_NAME_REQUIRED: 'Event name is required',
  EVENT_DATE_REQUIRED: 'Event date is required',
  EVENT_DATE_FUTURE: 'Event date must be in the future',
  
  GUEST_NAME_REQUIRED: 'Guest name is required',
  GUEST_NAME_MIN_LENGTH: 'Guest name must be at least 2 characters',
  GUEST_EMAIL_INVALID: 'Please enter a valid email address',
  GUEST_PHONE_INVALID: 'Please enter a valid phone number',
  
  TASK_TITLE_REQUIRED: 'Task title is required',
  TASK_TITLE_MIN_LENGTH: 'Task title must be at least 3 characters',
  
  EXPENSE_DESCRIPTION_REQUIRED: 'Description is required',
  EXPENSE_AMOUNT_REQUIRED: 'Amount is required',
  EXPENSE_AMOUNT_POSITIVE: 'Amount must be a positive number',
  
  MEMBER_NAME_REQUIRED: 'Member name is required',
  MEMBER_NAME_MIN_LENGTH: 'Member name must be at least 2 characters',
  MEMBER_PHONE_INVALID: 'Please enter a valid phone number',
  
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  
  MEMBER_UID_REQUIRED: 'Member UID is required',
};

// ============================================================
// SUCCESS MESSAGES
// ============================================================
export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Event created successfully!',
  EVENT_DELETED: 'Event deleted successfully!',
  EVENT_UPDATED: 'Event updated successfully!',
  
  GUEST_INVITED: 'Guest invited successfully!',
  GUEST_ADDED: 'Guest added successfully!',
  GUEST_UPDATED: 'Guest updated successfully!',
  GUEST_DELETED: 'Guest deleted successfully!',
  
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  
  EXPENSE_RECORDED: 'Expense recorded successfully!',
  EXPENSE_UPDATED: 'Expense updated successfully!',
  EXPENSE_DELETED: 'Expense deleted successfully!',
  
  MEMBER_ADDED: 'Member added successfully!',
  MEMBER_UPDATED: 'Member updated successfully!',
  MEMBER_DELETED: 'Member deleted successfully!',
  
  SAVED: 'Saved successfully!',
  DELETED: 'Deleted successfully!',
  UPDATED: 'Updated successfully!',
};

// ============================================================
// ERROR MESSAGES
// ============================================================
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  
  EVENT_CREATION_FAILED: 'Failed to create event',
  EVENT_DELETE_FAILED: 'Failed to delete event',
  EVENT_UPDATE_FAILED: 'Failed to update event',
  EVENT_NOT_FOUND: 'Event not found',
  
  GUEST_ADD_FAILED: 'Failed to add guest',
  GUEST_UPDATE_FAILED: 'Failed to update guest',
  GUEST_DELETE_FAILED: 'Failed to delete guest',
  
  TASK_ADD_FAILED: 'Failed to add task',
  TASK_UPDATE_FAILED: 'Failed to update task',
  TASK_DELETE_FAILED: 'Failed to delete task',
  
  EXPENSE_ADD_FAILED: 'Failed to add expense',
  EXPENSE_UPDATE_FAILED: 'Failed to update expense',
  EXPENSE_DELETE_FAILED: 'Failed to delete expense',
  
  MEMBER_ADD_FAILED: 'Failed to add member',
  MEMBER_UPDATE_FAILED: 'Failed to update member',
  MEMBER_DELETE_FAILED: 'Failed to delete member',
  
  LOGOUT_FAILED: 'Failed to logout',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
};

// ============================================================
// UI LABELS & PLACEHOLDERS
// ============================================================
export const UI_LABELS = {
  // Buttons
  CREATE: 'Create',
  ADD: 'Add',
  EDIT: 'Edit',
  DELETE: 'Delete',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  LOGOUT: 'Logout',
  SUBMIT: 'Submit',
  CLOSE: 'Close',
  BACK: 'Back',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  
  // Forms
  EVENT_NAME: 'Event Name',
  EVENT_TYPE: 'Event Type',
  EVENT_DATE: 'Event Date',
  GUEST_NAME: 'Guest Name',
  GUEST_EMAIL: 'Email Address',
  GUEST_PHONE: 'Phone Number',
  TASK_TITLE: 'Task Title',
  TASK_CATEGORY: 'Category',
  TASK_DESCRIPTION: 'Description',
  TASK_DUE_DATE: 'Due Date',
  EXPENSE_DESCRIPTION: 'Description',
  EXPENSE_CATEGORY: 'Category',
  EXPENSE_AMOUNT: 'Amount (₹)',
  MEMBER_NAME: 'Member Name',
  MEMBER_PHONE: 'Phone Number',
  MEMBER_ROLE: 'Role',
  MEMBER_JOB_ROLE: 'Job Role',
  
  // States
  LOADING: 'Loading...',
  NO_DATA: 'No data available',
  EMPTY_STATE: 'No items yet',
  
  // Confirmations
  CONFIRM_DELETE: 'Are you sure you want to delete this?',
  CONFIRM_LOGOUT: 'Are you sure you want to logout?',
};

// ============================================================
// PAGINATION & LIMITS
// ============================================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  ACTIVITY_LOG_MAX_ITEMS: 10,
  ITEMS_PER_ROW: 3,
};

// ============================================================
// TIME & DATE FORMATS
// ============================================================
export const DATE_FORMATS = {
  DISPLAY: 'en-IN',
  DISPLAY_FULL: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  DISPLAY_SHORT: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
};

// ============================================================
// API & FIREBASE CONFIGURATION
// ============================================================
export const API_CONFIG = {
  COLLECTION_EVENTS: 'events',
  COLLECTION_USERS: 'users',
  COLLECTION_EXPENSES: 'expenses',
};

// ============================================================
// UTILITY FUNCTIONS FOR CONSTANTS
// ============================================================

/**
 * Get label for a given status/type/value
 * @param {string} value - The value to look up
 * @param {object} labelMap - The label mapping object
 * @returns {string} The corresponding label or the value itself
 */
export const getLabel = (value, labelMap) => {
  return labelMap[value] || value;
};

/**
 * Get color for a given category
 * @param {string} category - The category to get color for
 * @returns {string} The hex color code
 */
export const getCategoryColor = (category) => {
  const upperCategory = category.toUpperCase().replace('-', '');
  return CHART_COLORS[upperCategory] || CHART_COLORS.OTHER;
};

/**
 * Format currency value
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Check if a task is overdue
 * @param {Date} dueDate - The due date
 * @returns {boolean} True if overdue
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};
