import React, { useState } from 'react';
import { useTasks, useMembers } from '../hooks/useFirebaseEvents';
import styles from '../styles/components.module.css';

export function TaskManagement({ eventId }) {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(eventId);
  const { members } = useMembers(eventId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'food',
    jobRole: 'food-service',
    description: '',
    assignedTo: '',
    assignedMemberUid: '',
    dueDate: '',
    dependsOn: [],
  });

  const categories = ['food', 'decoration', 'venue', 'entertainment', 'invitation', 'other'];
  const jobRoles = [
    'food-service',
    'decoration',
    'venue-setup',
    'guest-relations',
    'photography',
    'logistics',
    'ceremony',
    'other',
  ];
  const priorities = ['low', 'medium', 'high'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter task title');
      return;
    }
    const assignee = members.find((m) => m.memberUid === formData.assignedMemberUid);
    await addTask({
      ...formData,
      assignedTo: assignee?.name || formData.assignedTo,
      jobRole: formData.jobRole || formData.category,
    });
    setFormData({
      title: '',
      category: 'food',
      jobRole: 'food-service',
      description: '',
      assignedTo: '',
      assignedMemberUid: '',
      dueDate: '',
      dependsOn: [],
    });
    setShowForm(false);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(taskId, { status: newStatus });
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    await updateTask(taskId, { priority: newPriority });
  };

  if (loading) return <div className={styles.loading}>Loading tasks...</div>;

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

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
          <input
            type="text"
            placeholder="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={styles.input}
          />
          <select 
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={styles.input}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>
          <textarea
            placeholder="Task Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.input}
            rows="3"
          />
          <select
            value={formData.jobRole}
            onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
            className={styles.input}
          >
            {jobRoles.map((role) => (
              <option key={role} value={role}>{role.replace('-', ' ').toUpperCase()}</option>
            ))}
          </select>
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
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className={styles.input}
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess}>Create Task</button>
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
                  checked={task.status === 'completed'}
                  onChange={(e) => handleStatusChange(task.id, e.target.checked ? 'completed' : 'pending')}
                  className={styles.checkbox}
                />
                <div className={styles.taskDetails}>
                  <h4 style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
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
                  value={task.priority || 'medium'}
                  onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                  className={styles.select}
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p.toUpperCase()}</option>
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
