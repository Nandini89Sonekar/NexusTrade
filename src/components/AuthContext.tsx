import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { storage } from '../lib/storage';

interface SimplifiedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: SimplifiedUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimplifiedUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = storage.getSession();
    if (sessionId) {
      const existingUser = storage.getUser(sessionId);
      if (existingUser) {
        setUser({
          uid: existingUser.uid,
          email: existingUser.email,
          displayName: existingUser.displayName || 'Trader'
        });
        setProfile(existingUser);
      }
    }
    setLoading(false);
  }, []);

  // Poll for profile changes (since we don't have onSnapshot anymore)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const currentProfile = storage.getUser(user.uid);
      if (JSON.stringify(currentProfile) !== JSON.stringify(profile)) {
        setProfile(currentProfile);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user, profile]);

  const login = async (email: string, _pass: string) => {
    // Simple mock login: assume any user that exists is valid
    const users = Object.values(storage.getUsers());
    const existing = users.find(u => u.email === email);
    
    if (!existing) {
      throw new Error('User not found. Please sign up.');
    }

    setUser({
      uid: existing.uid,
      email: existing.email,
      displayName: existing.displayName || 'Trader'
    });
    setProfile(existing);
    storage.setSession(existing.uid);
  };

  const signup = async (email: string, _pass: string) => {
    const uid = Math.random().toString(36).substr(2, 9);
    const newProfile: UserProfile = {
      uid,
      email,
      balance: 100000,
      createdAt: Date.now(),
      displayName: email.split('@')[0],
    };

    storage.saveUser(newProfile);
    setUser({
      uid: newProfile.uid,
      email: newProfile.email,
      displayName: newProfile.displayName
    });
    setProfile(newProfile);
    storage.setSession(uid);
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    storage.setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

