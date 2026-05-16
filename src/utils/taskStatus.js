export function getTaskTimeBucket(task) {
  if (task.status === 'completed') return 'completed';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!task.dueDate) return 'current';

  const due = new Date(task.dueDate);
  if (Number.isNaN(due.getTime())) return 'current';
  due.setHours(0, 0, 0, 0);

  if (due < today) return 'overdue';
  if (due.getTime() === today.getTime()) return 'current';
  return 'upcoming';
}

export function filterTasksForMember(tasks, { memberUid, memberName, email }) {
  return (tasks || []).filter((task) => {
    if (memberUid && task.assignedMemberUid === memberUid) return true;
    if (memberName && task.assignedTo === memberName) return true;
    if (email && task.assignedTo === email) return true;
    return false;
  });
}
