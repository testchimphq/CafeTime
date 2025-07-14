
"use client";

import type { User, UserRole, RecurringAvailabilityPreference, Certification, WageHistoryEntry } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Routes } from '@/lib/constants';
import { MOCK_DETAILED_EMPLOYEES } from '@/lib/mock-data'; // Import MOCK_DETAILED_EMPLOYEES

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  register: (name: string, email: string, role: UserRole, cafeName?: string) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updatedUserFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get a user from MOCK_DETAILED_EMPLOYEES by email for login simulation
async function findMockUserByEmail(email: string): Promise<User | undefined> {
  // Simulate async behavior if needed in a real scenario, e.g., backend call
  // await new Promise(resolve => setTimeout(resolve, 100)); // Keep it fast for mock
  
  const found = MOCK_DETAILED_EMPLOYEES.find(emp => emp.email.toLowerCase() === email.toLowerCase());
  return found;
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cafeTimeUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        // Ensure all new fields have default values if not present in older localStorage data
        setUser({
          ...parsedUser,
          skills: parsedUser.skills || [],
          certifications: parsedUser.certifications || [],
          wageHistory: parsedUser.wageHistory || [],
          recurringPreferences: parsedUser.recurringPreferences || [],
        });
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('cafeTimeUser');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole) => {
    let foundUser = await findMockUserByEmail(email);

    if (foundUser && foundUser.role === role) {
       const fullUser: User = {
        ...foundUser, 
        skills: foundUser.skills || [],
        certifications: foundUser.certifications || [],
        wageHistory: foundUser.wageHistory || [],
        recurringPreferences: foundUser.recurringPreferences || [],
      };
      setUser(fullUser);
      localStorage.setItem('cafeTimeUser', JSON.stringify(fullUser));
    } else {
      // Fallback to generic mock user if not found or role mismatch
      // This user will NOT have a detailed profile accessible via "My Profile" unless their generated ID matches one (unlikely)
      const genericUserName = email.split('@')[0] || 'User';
      const genericAvatar = `https://placehold.co/100x100.png?text=${email.charAt(0).toUpperCase()}`;
      const mockUser: User = {
        id: Date.now().toString(), // This ID will likely not match any in MOCK_DETAILED_EMPLOYEES
        name: genericUserName,
        email: email,
        role: role,
        avatarUrl: genericAvatar,
        phoneNumber: '', // Default empty
        recurringPreferences: [],
        skills: [],
        certifications: [],
        startDate: new Date().toISOString(),
        currentWage: 0,
        wageHistory: [],
      };
      setUser(mockUser);
      localStorage.setItem('cafeTimeUser', JSON.stringify(mockUser));
    }
    router.push(Routes.DASHBOARD);
  };

  const register = (name: string, email: string, role: UserRole, cafeName?: string) => {
    console.log(`Mock Registration: Name: ${name}, Email: ${email}, Role: ${role}, Cafe: ${cafeName || 'N/A'}`);
    // In a real app, this would create the user in the backend.
    // For now, we just log it. The user will then use the login form.
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cafeTimeUser');
    router.push(Routes.LOGIN);
  };

  const updateUser = (updatedUserFields: Partial<User>) => {
    if (user) {
      const newUser: User = {
        ...user,
        ...updatedUserFields,
        skills: updatedUserFields.skills || user.skills || [],
        certifications: updatedUserFields.certifications || user.certifications || [],
        wageHistory: updatedUserFields.wageHistory || user.wageHistory || [],
        recurringPreferences: updatedUserFields.recurringPreferences || user.recurringPreferences || [],
      };
      setUser(newUser);
      localStorage.setItem('cafeTimeUser', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUser }}>
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
