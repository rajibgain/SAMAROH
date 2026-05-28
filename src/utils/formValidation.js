/**
 * Form Validation Utilities
 * Provides reusable validation functions for common form fields
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (basic international format)
const PHONE_REGEX = /^[\d\s\-\+\(\)]{7,}$/;

/**
 * Validate required field (non-empty string)
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value, fieldName, minLength) => {
  if (value && value.toString().trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

/**
 * Validate email format
 */
export const validateEmail = (value, fieldName = 'Email') => {
  if (!value) return null; // Allow empty if optional
  if (!EMAIL_REGEX.test(value)) {
    return `${fieldName} must be a valid email address`;
  }
  return null;
};

/**
 * Validate phone format (basic)
 */
export const validatePhone = (value, fieldName = 'Phone') => {
  if (!value) return null; // Allow empty if optional
  if (!PHONE_REGEX.test(value)) {
    return `${fieldName} must be a valid phone number`;
  }
  return null;
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (value, fieldName) => {
  if (!value) return `${fieldName} is required`;
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be a positive number`;
  }
  return null;
};

/**
 * Validate date is in future
 */
export const validateFutureDate = (value, fieldName = 'Date') => {
  if (!value) return `${fieldName} is required`;
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return `${fieldName} must be in the future`;
  }
  return null;
};

/**
 * Validate password strength
 */
export const validatePassword = (value, fieldName = 'Password') => {
  if (!value) return `${fieldName} is required`;
  if (value.length < 6) {
    return `${fieldName} must be at least 6 characters`;
  }
  return null;
};

/**
 * Validate password match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

/**
 * Event creation form validation
 */
export const validateEventForm = (formData) => {
  const errors = {};

  const eventNameError = validateRequired(formData.eventName, 'Event name');
  if (eventNameError) errors.eventName = eventNameError;

  const dateError = validateFutureDate(formData.eventDate, 'Event date');
  if (dateError) errors.eventDate = dateError;

  return errors;
};

/**
 * Guest form validation
 */
export const validateGuestForm = (formData) => {
  const errors = {};

  const nameError = validateRequired(formData.name, 'Guest name');
  if (nameError) {
    errors.name = nameError;
  } else {
    const minLengthError = validateMinLength(formData.name, 'Guest name', 2);
    if (minLengthError) errors.name = minLengthError;
  }

  if (formData.email) {
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
  }

  if (formData.phone) {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
  }

  return errors;
};

/**
 * Task form validation
 */
export const validateTaskForm = (formData) => {
  const errors = {};

  const titleError = validateRequired(formData.title, 'Task title');
  if (titleError) {
    errors.title = titleError;
  } else {
    const minLengthError = validateMinLength(formData.title, 'Task title', 3);
    if (minLengthError) errors.title = minLengthError;
  }

  return errors;
};

/**
 * Expense form validation
 */
export const validateExpenseForm = (formData) => {
  const errors = {};

  const descError = validateRequired(formData.description, 'Description');
  if (descError) errors.description = descError;

  const amountError = validatePositiveNumber(formData.amount, 'Amount');
  if (amountError) errors.amount = amountError;

  return errors;
};

/**
 * Member form validation
 */
export const validateMemberForm = (formData) => {
  const errors = {};

  const nameError = validateRequired(formData.name, 'Member name');
  if (nameError) {
    errors.name = nameError;
  } else {
    const minLengthError = validateMinLength(formData.name, 'Member name', 2);
    if (minLengthError) errors.name = minLengthError;
  }

  if (formData.phone) {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
  }

  return errors;
};

/**
 * Login form validation
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  const emailError = validateRequired(formData.email, 'Email');
  if (!emailError) {
    const validEmail = validateEmail(formData.email);
    if (validEmail) errors.email = validEmail;
  } else {
    errors.email = emailError;
  }

  const passwordError = validateRequired(formData.password, 'Password');
  if (passwordError) errors.password = passwordError;

  return errors;
};

/**
 * Signup form validation
 */
export const validateSignupForm = (formData) => {
  const errors = {};

  const nameError = validateRequired(formData.name, 'Name');
  if (nameError) {
    errors.name = nameError;
  } else {
    const minLengthError = validateMinLength(formData.name, 'Name', 2);
    if (minLengthError) errors.name = minLengthError;
  }

  const emailError = validateRequired(formData.email, 'Email');
  if (!emailError) {
    const validEmail = validateEmail(formData.email);
    if (validEmail) errors.email = validEmail;
  } else {
    errors.email = emailError;
  }

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const matchError = validatePasswordMatch(formData.password, formData.confirmPassword);
  if (matchError) errors.confirmPassword = matchError;

  return errors;
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
