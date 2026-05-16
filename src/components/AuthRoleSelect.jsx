import styles from '../styles/auth.module.css';

export function AuthRoleSelect({ onSelectRole, onBackToHome }) {
  return (
    <div className={styles.container} style={{ position: 'relative', zIndex: 1 }}>
      <div className={styles.authCard}>
        <button className={styles.backBtn} onClick={onBackToHome}>
          ← Back to homepage
        </button>
        <div className={styles.header}>
          <h1>🎉 SAMAROH</h1>
          <p>Event Coordination Platform</p>
        </div>

        <div className={styles.roleContainer}>
          <h2>Select Your Role</h2>
          <p className={styles.subtitle}>Choose how you'll participate in event coordination</p>

          <div className={styles.roleGrid}>
            <div className={styles.roleCard}>
              <div className={styles.roleIcon}>👑</div>
              <h3>Coordinator</h3>
              <p>Manage events, guests, tasks, and budgets. Full control over planning.</p>
              <button
                className={styles.roleBtn}
                onClick={() => onSelectRole('coordinator', 'login')}
              >
                Login as Coordinator
              </button>
              <button
                className={styles.roleBtnSecondary}
                onClick={() => onSelectRole('coordinator', 'signup')}
              >
                Sign up as Coordinator
              </button>
            </div>

            <div className={styles.roleCard}>
              <div className={styles.roleIcon}>👤</div>
              <h3>Family Member</h3>
              <p>View assignments, update task status, and collaborate with team.</p>
              <button
                className={styles.roleBtn}
                onClick={() => onSelectRole('member', 'login')}
              >
                Login as Member
              </button>
              <button
                className={styles.roleBtnSecondary}
                onClick={() => onSelectRole('member', 'signup')}
              >
                Sign up as Member
              </button>
            </div>
          </div>

          <div className={styles.signupPrompt}>
            <p>Choose a role to continue with SAMAROH.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
