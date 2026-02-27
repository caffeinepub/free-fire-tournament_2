import { useState, useCallback } from 'react';

const AUTH_KEY = 'isAuthenticated';
const USER_NAME_KEY = 'userName';
const USER_EMAIL_KEY = 'userEmail';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [userName, setUserNameState] = useState<string>(() => {
    return localStorage.getItem(USER_NAME_KEY) ?? '';
  });

  const [userEmail, setUserEmailState] = useState<string>(() => {
    return localStorage.getItem(USER_EMAIL_KEY) ?? '';
  });

  const setAuth = useCallback((name: string, email: string) => {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(USER_NAME_KEY, name);
    localStorage.setItem(USER_EMAIL_KEY, email);
    setIsAuthenticated(true);
    setUserNameState(name);
    setUserEmailState(email);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    setIsAuthenticated(false);
    setUserNameState('');
    setUserEmailState('');
  }, []);

  return { isAuthenticated, userName, userEmail, setAuth, clearAuth };
}
