import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../services/api';

// Функция проверки истечения JWT-токена
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  // Admin methods
  createUser: (userData: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      // Проверка истечения токена

      // Использование кэшированных данных
      const cachedUser = localStorage.getItem('auth_user');
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
          setLoading(false);
          return;
        } catch (e) {
          localStorage.removeItem('auth_user');
        }
      }

      // Запрос данных пользователя
      apiService.getUser()
          .then(userData => {
            setUser(userData);
            localStorage.setItem('auth_user', JSON.stringify(userData));
          })
          .catch(error => {
            console.error('Error getting user:', error);
            localStorage.removeItem('auth_token');
            setUser(null);
          })
          .finally(() => {
            setLoading(false);
          });
    } else {
      setLoading(false);
    }
  }, []);

  // Синхронизация между вкладками
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (!e.newValue) {
          setUser(null);
        } else {
          window.location.reload(); // Обновление данных при изменении токена
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: userData } = await apiService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    setLoading(true);
    try {
      // Note: This is using login as a placeholder since there's no specific register endpoint in the API
      // In a real implementation, this would call a registration endpoint
      const { user: userData } = await apiService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Admin methods
  const createUser = async (userData: any) => {
    setLoading(true);
    try {
      await apiService.createUser(userData);
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await apiService.deleteUser(id);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_user');
    }
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            hasRole,
            createUser,
            deleteUser
          }}
      >
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
