import { getTaskTimeBucket } from '../utils/taskStatus';
import styles from '../styles/components.module.css';

function TaskGroup({ title, tone, tasks, onToggle }) {
  if (!tasks.length) return null;

  return (
    <div className={styles.jobGroup} data-tone={tone}>
      <h4>{title} ({tasks.length})</h4>
      <div className={styles.list}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.taskItem} data-status={task.status}>
            <div className={styles.taskContent}>
              <input
                type="checkbox"
                checked={task.status === 'completed'}
                onChange={(e) => onToggle(task, e.target.checked ? 'completed' : 'pending')}
                className={styles.checkbox}
              />
              <div className={styles.taskDetails}>
                <h4 style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                  {task.title}
                </h4>
                <p className={styles.taskCategory}>
                  {task.jobRole || task.category}
                  {task.assignedTo ? ` · ${task.assignedTo}` : ''}
                </p>
                {task.dueDate && (
                  <p>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberJobBoard({ tasks, onToggleTask }) {
  const buckets = {
    overdue: [],
    current: [],
    upcoming: [],
    completed: [],
  };

  tasks.forEach((task) => {
    const bucket = getTaskTimeBucket(task);
    buckets[bucket].push(task);
  });

  if (!tasks.length) {
    return <p className={styles.empty}>No jobs assigned to your role yet.</p>;
  }

  return (
    <div className={styles.jobBoard}>
      <TaskGroup title="⚠️ Overdue" tone="overdue" tasks={buckets.overdue} onToggle={onToggleTask} />
      <TaskGroup title="🔥 Current" tone="current" tasks={buckets.current} onToggle={onToggleTask} />
      <TaskGroup title="📅 Upcoming" tone="upcoming" tasks={buckets.upcoming} onToggle={onToggleTask} />
      <TaskGroup title="✓ Completed" tone="done" tasks={buckets.completed} onToggle={onToggleTask} />
    </div>
  );
}
