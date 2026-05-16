import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { LoginSignup } from './components/LoginSignup';
import { HomePage } from './components/HomePage';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { MemberDashboard } from './components/MemberDashboard';
import './App.css';

function AppContent() {
  const { user, userRole, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Still loading auth state
  if (loading) {
    return (
      <div className="app-loading">
        <span className="app-loading__mark">S</span>
        <p>Loading Samaroh…</p>
      </div>
    );
  }

  // Not logged in - show homepage and auth panel
  if (!user) {
    return showAuth ? <LoginSignup onBackToHome={() => setShowAuth(false)} /> : <HomePage onGetStarted={() => setShowAuth(true)} />;
  }

  // Logged in - show role-specific dashboard
  if (userRole === 'coordinator') {
    return <CoordinatorDashboard />;
  }

  if (userRole === 'member') {
    return <MemberDashboard />;
  }

  // Fallback
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Loading your dashboard...</h2>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </AuthProvider>
  );
}