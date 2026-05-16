import { PageLayout } from './PageLayout';
import styles from '../styles/auth.module.css';

export function AuthForm({
  activeTab,
  selectedRole,
  loginData,
  signupData,
  onLoginChange,
  onSignupChange,
  onSubmit,
  onBack,
  onSwitchMode,
  onGoogleLogin,
  error,
  authError,
  isLoading,
  roleLabel,
  styles: propStyles
}) {
  const style = propStyles || styles;
  const isLogin = activeTab === 'login';
  const isMember = selectedRole === 'member';

  return (
    <PageLayout>
    <div className={style.container}>
      <div className={style.authCard}>
        <button onClick={onBack} className={style.backBtn}>
          ← Back
        </button>

        <div className={style.formHeader}>
          <div className={style.roleIcon}>{selectedRole === 'coordinator' ? '👑' : '👤'}</div>
          <h2>{isLogin ? `Login as ${roleLabel}` : 'Create Account'}</h2>
          {!isLogin && <p className={style.roleLabel}>as {roleLabel}</p>}
        </div>

        {error && <div className={style.error}>{error}</div>}
        {authError && <div className={style.error}>{authError}</div>}

        <form onSubmit={onSubmit} className={style.form}>
          {!isLogin && (
            <div className={style.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={signupData.name}
                onChange={(e) => onSignupChange({ ...signupData, name: e.target.value })}
                placeholder="John Doe"
                className={style.input}
              />
            </div>
          )}

          {isMember && (
            <div className={style.formGroup}>
              <label>Member UID (from coordinator)</label>
              <input
                type="text"
                value={isLogin ? loginData.memberUid : signupData.memberUid}
                onChange={(e) =>
                  isLogin
                    ? onLoginChange({ ...loginData, memberUid: e.target.value.toUpperCase() })
                    : onSignupChange({ ...signupData, memberUid: e.target.value.toUpperCase() })
                }
                placeholder="SMR-XXXXXXXX"
                className={style.input}
              />
            </div>
          )}

          <div className={style.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={isLogin ? loginData.email : signupData.email}
              onChange={(e) =>
                isLogin
                  ? onLoginChange({ ...loginData, email: e.target.value })
                  : onSignupChange({ ...signupData, email: e.target.value })
              }
              placeholder="your@email.com"
              className={style.input}
            />
          </div>

          <div className={style.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={isLogin ? loginData.password : signupData.password}
              onChange={(e) =>
                isLogin
                  ? onLoginChange({ ...loginData, password: e.target.value })
                  : onSignupChange({ ...signupData, password: e.target.value })
              }
              placeholder="••••••••"
              className={style.input}
            />
          </div>

          {!isLogin && (
            <div className={style.formGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => onSignupChange({ ...signupData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className={style.input}
              />
            </div>
          )}

          <button type="submit" className={style.submitBtn} disabled={isLoading}>
            {isLoading ? (isLogin ? 'Logging in...' : 'Creating account...') : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {onGoogleLogin && (
          <button
            type="button"
            className={style.googleBtn}
            disabled={isLoading}
            onClick={onGoogleLogin}
          >
            Continue with Google
          </button>
        )}

        <div className={style.signupPrompt}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => onSwitchMode('signup')} className={style.linkBtn}>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => onSwitchMode('login')} className={style.linkBtn}>
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
    </PageLayout>
  );
}
