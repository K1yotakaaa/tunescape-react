import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import AppShell from './components/AppShell';
import { LoadingState } from './components/States';

function Inner() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <LoadingState label="Loading Tunescape…" />
      </div>
    );
  }
  return isAuthenticated ? <AppShell /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}