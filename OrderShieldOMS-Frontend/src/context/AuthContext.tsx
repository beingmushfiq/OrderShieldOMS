import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/src/types';
import api from '@/src/lib/api';
import { toast } from 'sonner';
import { useTheme } from '@/src/context/ThemeContext';

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme } = useTheme();

  // On mount: if a token exists, re-hydrate the user from the API
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/user');
          setUser({
            name:   response.data.name,
            email:  response.data.email,
            role:   response.data.role || 'admin',
            phone:  response.data.phone,
            company: response.data.company,
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=7c3aed&fontFamily=Arial&fontSize=40',
          });
          
          if (response.data.theme) {
            setTheme(response.data.theme, false);
          }
        } catch {
          // Token is stale or invalid — clean up
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    // POST /api/login → returns { access_token, token_type, user }
    const response = await api.post('/login', {
      email:    credentials.email,
      password: credentials.password,
    });

    const { access_token, user: apiUser } = response.data;

    localStorage.setItem('token', access_token);

    setUser({
      name:   apiUser.name,
      email:  apiUser.email,
      role:   apiUser.role ?? 'admin',
      phone:  apiUser.phone,
      company: apiUser.company,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=7c3aed&fontFamily=Arial&fontSize=40',
    });

    if (apiUser.theme) {
      setTheme(apiUser.theme, false);
    }

    toast.success('Logged in successfully');
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // Even if the server call fails, we still clear local state
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.info('Logged out successfully');
    }
  };

  const updateUser = (data: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
