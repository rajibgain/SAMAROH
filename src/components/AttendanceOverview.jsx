import { useGuests, useMembers } from '../hooks/useFirebaseEvents';
import styles from '../styles/components.module.css';

export function AttendanceOverview({ eventId }) {
  const { guests, markGuestAttended } = useGuests(eventId);
  const { members, markMemberPresent } = useMembers(eventId);

  const presentMembers = members.filter((m) => m.isPresent);
  const attendedGuests = guests.filter((g) => g.attended);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>✅ Attendance & Presence</h3>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{presentMembers.length}</span>
          <span className={styles.statLabel}>Members Present</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{members.length}</span>
          <span className={styles.statLabel}>Team Size</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{attendedGuests.length}</span>
          <span className={styles.statLabel}>Guests Checked In</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNumber}>{guests.length}</span>
          <span className={styles.statLabel}>Total Guests</span>
        </div>
      </div>

      <h4 className={styles.subSectionTitle}>Team presence (supervisor view)</h4>
      <p className={styles.hint}>
        Updates automatically when a member signs in with their UID.
      </p>
      <div className={styles.list}>
        {members.length === 0 ? (
          <p className={styles.empty}>No team members yet.</p>
        ) : (
          members.map((member) => (
            <div key={member.id} className={styles.listItem}>
              <div className={styles.itemContent}>
                <h4>
                  {member.name}
                  <span className={member.isPresent ? styles.badgePresent : styles.badgeAway}>
                    {member.isPresent ? '● Present' : '○ Away'}
                  </span>
                </h4>
                <p>Job role: <strong>{member.jobRole || member.role}</strong></p>
                {member.memberUid && <p className={styles.uidLine}>UID: {member.memberUid}</p>}
                {member.lastSeenAt && (
                  <p className={styles.muted}>Last seen: {new Date(member.lastSeenAt).toLocaleString()}</p>
                )}
              </div>
              <div className={styles.itemActions}>
                <button
                  type="button"
                  className={styles.btn + ' ' + styles.btnSuccess}
                  onClick={() => markMemberPresent(member.id)}
                >
                  Mark present
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h4 className={styles.subSectionTitle}>Guest attendance</h4>
      <div className={styles.list}>
        {guests.length === 0 ? (
          <p className={styles.empty}>No guests yet.</p>
        ) : (
          guests.map((guest) => (
            <div key={guest.id} className={styles.listItem}>
              <div className={styles.itemContent}>
                <h4>
                  {guest.name}
                  <span className={guest.attended ? styles.badgePresent : styles.badgePending}>
                    {guest.attended ? '✓ Attended' : 'Not checked in'}
                  </span>
                </h4>
                <p>RSVP: {guest.status}</p>
              </div>
              <div className={styles.itemActions}>
                <button
                  type="button"
                  className={styles.btn + ' ' + styles.btnPrimary}
                  onClick={() => markGuestAttended(guest.id, !guest.attended)}
                >
                  {guest.attended ? 'Undo check-in' : 'Check in guest'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
