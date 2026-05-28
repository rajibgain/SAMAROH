import React, { useState } from 'react';
import { useTasks, useMembers } from '../hooks/useFirebaseEvents';
import { FormError } from './FormError';
import { useNotification } from '../hooks/useNotification';
import { validateTaskForm } from '../utils/formValidation';
import {
  TASK_CATEGORIES,
  TASK_CATEGORY_OPTIONS,
  JOB_ROLES,
  JOB_ROLE_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../constants';
import styles from '../styles/components.module.css';

export function TaskManagement({ eventId }) {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(eventId);
  const { members } = useMembers(eventId);
  const { notify } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: TASK_CATEGORIES.FOOD,
    jobRole: JOB_ROLES.FOOD_SERVICE,
    description: '',
    assignedTo: '',
    assignedMemberUid: '',
    dueDate: '',
    dependsOn: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = TASK_CATEGORY_OPTIONS;
  const jobRoles = JOB_ROLE_OPTIONS;
  const priorities = TASK_PRIORITY_OPTIONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateTaskForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const assignee = members.find((m) => m.memberUid === formData.assignedMemberUid);
      await addTask({
        ...formData,
        assignedTo: assignee?.name || formData.assignedTo,
        jobRole: formData.jobRole || formData.category,
      });
      notify(SUCCESS_MESSAGES.TASK_CREATED, 'success');
      setFormData({
        title: '',
        category: TASK_CATEGORIES.FOOD,
        jobRole: JOB_ROLES.FOOD_SERVICE,
        description: '',
        assignedTo: '',
        assignedMemberUid: '',
        dueDate: '',
        dependsOn: [],
      });
      setShowForm(false);
    } catch (error) {
      notify(error.message || ERROR_MESSAGES.TASK_ADD_FAILED, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    await updateTask(taskId, { priority: newPriority });
  };

  if (loading) return <div className={styles.loading}>Loading tasks...</div>;

  const pendingTasks = tasks.filter(t => t.status === TASK_STATUS.PENDING).length;
  const completedTasks = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>✓ Task Management</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={styles.btn + ' ' + styles.btnPrimary}
        >
          + Add Task
        </button>
      </div>

      {/* Task Stats */}
      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{pendingTasks}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{completedTasks}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{tasks.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Task Title *</label>
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`${styles.input} ${errors.title ? styles.error : ''}`}
              aria-invalid={!!errors.title}
            />
            {errors.title && <FormError error={errors.title} />}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={styles.input}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              placeholder="Task Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={styles.input}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Job Role</label>
            <select
              value={formData.jobRole}
              onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
              className={styles.input}
            >
              {jobRoles.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Assign to Member</label>
            <select
              value={formData.assignedMemberUid}
              onChange={(e) => setFormData({ ...formData, assignedMemberUid: e.target.value })}
              className={styles.input}
            >
              <option value="">Assign to member (job role)</option>
              {members.map((member) => (
                <option key={member.id} value={member.memberUid || ''}>
                  {member.name} {member.memberUid ? `(${member.memberUid})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Dependencies</label>
            <select
              multiple
              value={formData.dependsOn.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
                setFormData({ ...formData, dependsOn: selected });
              }}
              className={styles.input}
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.btn}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {tasks.length === 0 ? (
          <p className={styles.empty}>No tasks created yet</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={styles.taskItem} data-status={task.status}>
              <div className={styles.taskContent}>
                <input 
                  type="checkbox"
                  checked={task.status === TASK_STATUS.COMPLETED}
                  onChange={(e) => handleStatusChange(task.id, e.target.checked ? TASK_STATUS.COMPLETED : TASK_STATUS.PENDING)}
                  className={styles.checkbox}
                />
                <div className={styles.taskDetails}>
                  <h4 className={task.status === TASK_STATUS.COMPLETED ? styles.textStrikethrough : ''}>
                    {task.title}
                  </h4>
                  <p className={styles.taskCategory}>{task.category}</p>
                  {task.description && <p className={styles.taskDesc}>{task.description}</p>}
                  {task.jobRole && <p>🎯 Job role: {task.jobRole}</p>}
                  {task.assignedTo && <p>👤 Assigned: {task.assignedTo}</p>}
                  {task.assignedMemberUid && <p className={styles.uidLine}>UID: {task.assignedMemberUid}</p>}
                  {task.dependsOn?.length > 0 && (
                    <p className={styles.muted}>Depends on {task.dependsOn.length} task(s)</p>
                  )}
                  {task.dueDate && <p>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                </div>
              </div>
              <div className={styles.taskActions}>
                <select 
                  value={task.priority || TASK_PRIORITY.MEDIUM}
                  onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                  className={styles.select}
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                  ))}
                </select>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className={styles.btnClose}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
