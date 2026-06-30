import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import api from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from a stored JWT
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('devnotes_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch {
        localStorage.removeItem('devnotes_token');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const { data } = await api.post('/auth/google', { idToken });
    localStorage.setItem('devnotes_token', data.token);
    setUser(data.user);
    // Firebase session no longer needed; we use our own JWT
    await signOut(auth).catch(() => {});
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('devnotes_token');
    setUser(null);
    await signOut(auth).catch(() => {});
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
