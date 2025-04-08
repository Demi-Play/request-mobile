import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { auth, users } from '../services/api';
import { logger } from '../utils/logger';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    password: string;
    email: string;
    company: string;
    phone: string;
  }) => Promise<void>;
  updateUser: (userData: User) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const userData = await users.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await auth.login(username, password);
      if (!response.token || !response.user) {
        throw new Error('Invalid response data');
      }
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    password: string;
    email: string;
    company: string;
    phone: string;
  }) => {
    try {
      logger.info('Attempting registration', { username: userData.username, email: userData.email });
      const response = await auth.register(userData);
      
      if (!response.user) {
        throw new Error('Invalid response data');
      }
      
      // Сохраняем данные пользователя
      setUser(response.user);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      logger.info('Registration successful', { username: userData.username });
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateUser,
        theme,
        setTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 