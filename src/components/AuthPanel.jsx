import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthRoleSelect } from './AuthRoleSelect';
import { AuthForm } from './AuthForm';
import { PageLayout } from './PageLayout';
import styles from '../styles/auth.module.css';
import { normalizeMemberUid } from '../utils/memberUid';

export function AuthPanel({ onBackToHome }) {
  const { login, signup, loginWithGoogle, error: authError } = useAuth();
  const [activeTab, setActiveTab] = useState('role-select');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    memberUid: '',
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    memberUid: '',
  });

  const resetAllFields = () => {
    setLoginData({ email: '', password: '', memberUid: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '', memberUid: '' });
  };

  const handleRoleSelect = (role, mode) => {
    setSelectedRole(role);
    setActiveTab(mode);
    setError(null);
    resetAllFields();
  };

  const handleBack = () => {
    setActiveTab('role-select');
    setError(null);
    resetAllFields();
  };

  const validateMemberUidField = () => {
    if (selectedRole !== 'member') return true;
    const raw = activeTab === 'login' ? loginData.memberUid : signupData.memberUid;
    if (!normalizeMemberUid(raw)) {
      setError('Please enter your Member UID from the coordinator.');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (!validateMemberUidField()) return;

    try {
      setIsLoading(true);
      await login(loginData.email, loginData.password, {
        role: selectedRole,
        memberUid: normalizeMemberUid(loginData.memberUid),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!validateMemberUidField()) return;

    try {
      setIsLoading(true);
      await signup(signupData.email, signupData.password, selectedRole, signupData.name, {
        memberUid: normalizeMemberUid(signupData.memberUid),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    if (!validateMemberUidField()) return;

    try {
      setIsLoading(true);
      const memberUid = normalizeMemberUid(
        activeTab === 'login' ? loginData.memberUid : signupData.memberUid
      );
      await loginWithGoogle(selectedRole, { memberUid });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (activeTab === 'role-select') {
    return (
      <PageLayout>
        <AuthRoleSelect onSelectRole={handleRoleSelect} onBackToHome={onBackToHome} />
      </PageLayout>
    );
  }

  return (
    <AuthForm
      activeTab={activeTab}
      selectedRole={selectedRole}
      loginData={loginData}
      signupData={signupData}
      onLoginChange={setLoginData}
      onSignupChange={setSignupData}
      onSubmit={activeTab === 'login' ? handleLoginSubmit : handleSignupSubmit}
      onBack={handleBack}
      onSwitchMode={(mode) => setActiveTab(mode)}
      onGoogleLogin={handleGoogleLogin}
      error={error}
      authError={authError}
      isLoading={isLoading}
      roleLabel={selectedRole === 'coordinator' ? 'Coordinator' : 'Family Member'}
      styles={styles}
    />
  );
}
