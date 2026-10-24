import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError, clearUserToken, getUserToken, setUserToken } from '../../../api/apiClient';
import { authApi, type AppUser, type AuthResponse } from '../api/authApi';
import { SignInDialog } from '../components/SignInDialog';

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  openSignIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getUserToken()));
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!getUserToken()) {
      return;
    }

    authApi
      .me()
      .then(setUser)
      .catch((error) => {
        // Only a rejected token signs the user out; a backend outage keeps the stored session.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403 || error.status === 404)) {
          clearUserToken();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSignedIn = useCallback((response: AuthResponse) => {
    setUserToken(response.token);
    setUser(response.user);
    setDialogOpen(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      openSignIn: () => setDialogOpen(true),
      signOut: () => {
        clearUserToken();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {dialogOpen && <SignInDialog onClose={() => setDialogOpen(false)} onSignedIn={handleSignedIn} />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
