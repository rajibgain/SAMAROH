import React, { useState } from 'react';
import { useMembers } from '../hooks/useFirebaseEvents';
import styles from '../styles/components.module.css';

export function FamilyMembers({ eventId }) {
  const { members, loading, addMember, updateMember, deleteMember, setMemberDependencies } = useMembers(eventId);
  const [showForm, setShowForm] = useState(false);
  const [lastUid, setLastUid] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', role: 'coordinator', jobRole: 'food-service' });

  const roles = ['organizer', 'coordinator', 'vendor-manager', 'guest-manager', 'budget-manager'];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter member name');
      return;
    }
    const created = await addMember({
      ...formData,
      jobRole: formData.jobRole,
    });
    if (created?.memberUid) {
      setLastUid(created.memberUid);
    }
    setFormData({ name: '', phone: '', role: 'coordinator', jobRole: 'food-service' });
    setShowForm(false);
  };

  const handleRoleChange = async (memberId, newRole) => {
    await updateMember(memberId, { role: newRole });
  };

  const handleJobRoleChange = async (memberId, jobRole) => {
    await updateMember(memberId, { jobRole });
  };

  const handleDependsChange = async (memberId, dependsOnMemberId, checked) => {
    const member = members.find((m) => m.id === memberId);
    const current = member?.dependsOn || [];
    const next = checked
      ? [...new Set([...current, dependsOnMemberId])]
      : current.filter((id) => id !== dependsOnMemberId);
    await setMemberDependencies(memberId, next);
  };

  const copyUid = (uid) => {
    navigator.clipboard?.writeText(uid);
    alert(`Copied UID: ${uid}`);
  };

  if (loading) return <div className={styles.loading}>Loading members...</div>;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>👥 Family Members & Job Roles</h3>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className={styles.btn + ' ' + styles.btnPrimary}
        >
          + Assign Member
        </button>
      </div>

      {lastUid && (
        <p className={styles.uidLine}>
          New member UID (share privately): <strong>{lastUid}</strong>
          <button type="button" className={styles.copyUidBtn + ' ' + styles.btn} onClick={() => copyUid(lastUid)}>
            Copy UID
          </button>
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Member Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={styles.input}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className={styles.input}
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role.replace('-', ' ').toUpperCase()}</option>
            ))}
          </select>
          <select
            value={formData.jobRole}
            onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
            className={styles.input}
          >
            {jobRoles.map((role) => (
              <option key={role} value={role}>{role.replace('-', ' ').toUpperCase()}</option>
            ))}
          </select>
          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess}>Save & Generate UID</button>
            <button type="button" onClick={() => setShowForm(false)} className={styles.btn}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.grid}>
        {members.length === 0 ? (
          <p className={styles.empty}>No family members added yet</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>
                  {member.name}
                  {member.isPresent && (
                    <span className={styles.badgePresent}>Present</span>
                  )}
                </h4>
                <button
                  type="button"
                  onClick={() => deleteMember(member.id)}
                  className={styles.btnClose}
                >
                  ✕
                </button>
              </div>
              {member.phone && <p className={styles.cardInfo}>📱 {member.phone}</p>}
              {member.memberUid && (
                <p className={styles.uidLine}>
                  Member UID: {member.memberUid}
                  <button type="button" className={styles.copyUidBtn + ' ' + styles.btn} onClick={() => copyUid(member.memberUid)}>
                    Copy
                  </button>
                </p>
              )}
              <label className={styles.muted}>Event role</label>
              <select
                value={member.role}
                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                className={styles.input}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role.replace('-', ' ').toUpperCase()}</option>
                ))}
              </select>
              <label className={styles.muted}>Job role (tasks)</label>
              <select
                value={member.jobRole || 'other'}
                onChange={(e) => handleJobRoleChange(member.id, e.target.value)}
                className={styles.input}
              >
                {jobRoles.map((role) => (
                  <option key={role} value={role}>{role.replace('-', ' ').toUpperCase()}</option>
                ))}
              </select>
              <div className={styles.dependsList}>
                <strong>Depends on:</strong>
                {members.filter((m) => m.id !== member.id).length === 0 ? (
                  <p className={styles.muted}>Add more members to set dependencies.</p>
                ) : (
                  members
                    .filter((m) => m.id !== member.id)
                    .map((other) => (
                      <label key={other.id} style={{ display: 'block', marginTop: 6 }}>
                        <input
                          type="checkbox"
                          checked={(member.dependsOn || []).includes(other.id)}
                          onChange={(e) => handleDependsChange(member.id, other.id, e.target.checked)}
                        />{' '}
                        {other.name}
                      </label>
                    ))
                )}
              </div>
              <p className={styles.tasks}>
                Assigned tasks: {member.assignedTasks?.length || 0}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
