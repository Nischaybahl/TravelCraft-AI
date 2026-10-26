import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { demoUser } from '@/utils/demoData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    // Check local storage for persistent user session
    const storedUser = localStorage.getItem('travelcraft_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsDemo(true);
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    const loggedUser: User = {
      id: 'demo-user-' + Math.random().toString(36).substring(7),
      email: email || demoUser.email,
      full_name: email.split('@')[0] || demoUser.full_name,
    };
    setUser(loggedUser);
    localStorage.setItem('travelcraft_user', JSON.stringify(loggedUser));
    setLoading(false);
  };

  const signUp = async (email: string, name: string) => {
    setLoading(true);
    const newUser: User = {
      id: 'demo-user-' + Math.random().toString(36).substring(7),
      email,
      full_name: name || email.split('@')[0],
    };
    setUser(newUser);
    localStorage.setItem('travelcraft_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('travelcraft_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
