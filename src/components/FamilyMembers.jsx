import React, { useState } from 'react';
import { useMembers } from '../hooks/useFirebaseEvents';
import { FormError } from './FormError';
import { useNotification } from '../hooks/useNotification';
import { validateMemberForm } from '../utils/formValidation';
import { MEMBER_ROLE_OPTIONS, JOB_ROLE_OPTIONS, MEMBER_ROLES, JOB_ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
import styles from '../styles/components.module.css';

export function FamilyMembers({ eventId }) {
  const { members, loading, addMember, updateMember, deleteMember, setMemberDependencies } = useMembers(eventId);
  const { notify } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [lastUid, setLastUid] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', role: MEMBER_ROLES.COORDINATOR, jobRole: JOB_ROLES.FOOD_SERVICE });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = MEMBER_ROLE_OPTIONS;
  const jobRoles = JOB_ROLE_OPTIONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateMemberForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await addMember({
        ...formData,
        jobRole: formData.jobRole,
      });
      if (created?.memberUid) {
        setLastUid(created.memberUid);
        notify(SUCCESS_MESSAGES.MEMBER_ADDED, 'success');
      }
      setFormData({ name: '', phone: '', role: MEMBER_ROLES.COORDINATOR, jobRole: JOB_ROLES.FOOD_SERVICE });
      setShowForm(false);
    } catch (error) {
      notify(error.message || ERROR_MESSAGES.MEMBER_ADD_FAILED, 'error');
    } finally {
      setIsSubmitting(false);
    }
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
    notify(`Copied UID: ${uid}`, 'success');
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
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Member Name *</label>
            <input
              type="text"
              placeholder="Member Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`${styles.input} ${errors.name ? styles.error : ''}`}
              aria-invalid={!!errors.name}
            />
            {errors.name && <FormError error={errors.name} />}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone (optional)</label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`${styles.input} ${errors.phone ? styles.error : ''}`}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <FormError error={errors.phone} />}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={styles.input}
            >
              {roles.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>{roleOption.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Job Role</label>
            <select
              value={formData.jobRole}
              onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
              className={styles.input}
            >
              {jobRoles.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>{roleOption.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.btn + ' ' + styles.btnSuccess} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Generate UID'}
            </button>
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
                {roles.map((roleOption) => (
                  <option key={roleOption.value} value={roleOption.value}>{roleOption.label}</option>
                ))}
              </select>
              <label className={styles.muted}>Job role (tasks)</label>
              <select
                value={member.jobRole || JOB_ROLES.OTHER}
                onChange={(e) => handleJobRoleChange(member.id, e.target.value)}
                className={styles.input}
              >
                {jobRoles.map((roleOption) => (
                  <option key={roleOption.value} value={roleOption.value}>{roleOption.label}</option>
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
                      <label key={other.id} className={styles.marginTop6}>
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
