import { useState } from 'react';

const AUTH_KEY = 'ff_auth';

interface AuthState {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  userUid: string;
}

function getStoredAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        isAuthenticated: true,
        userName: parsed.name || '',
        userEmail: parsed.email || '',
        userUid: parsed.uid || '',
      };
    }
  } catch {
    // ignore
  }
  return { isAuthenticated: false, userName: '', userEmail: '', userUid: '' };
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(getStoredAuth);

  const setAuth = (name: string, email: string, uid: string = '') => {
    const data = { name, email, uid };
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setAuthState({ isAuthenticated: true, userName: name, userEmail: email, userUid: uid });
  };

  const clearAuth = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthState({ isAuthenticated: false, userName: '', userEmail: '', userUid: '' });
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    userName: authState.userName,
    userEmail: authState.userEmail,
    userUid: authState.userUid,
    setAuth,
    clearAuth,
  };
}
