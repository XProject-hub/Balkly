import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  twofa_secret: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        // Verify token is still valid
        const response = await authAPI.me();
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // Token invalid, clear storage
        logout();
      }
    }
    setLoading(false);
  };

  const login = (userData: User, token: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...userData };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
  };

  const requireAuth = () => {
    if (!isAuthenticated && !loading) {
      router.push('/auth/login');
      return false;
    }
    return true;
  };

  const requireRole = (role: string) => {
    if (!user || user.role !== role) {
      router.push('/');
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    requireAuth,
    requireRole,
  };
}

