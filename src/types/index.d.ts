

export type UserRole = 'manager' | 'employee';

export interface RecurringAvailabilityPreference {
  id: string; // For list key and managing CRUD operations
  dayOfWeek: string; // e.g., "Monday", "Tuesday"
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  notes?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrg?: string;
  issueDate?: string; // ISO date string
  expiryDate?: string; // ISO date string
}

export interface WageHistoryEntry {
  id: string;
  date: string; // ISO date string
  newWage?: number;
  newTitle?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  recurringPreferences?: RecurringAvailabilityPreference[];
  // New fields for detailed profile
  skills?: string[];
  certifications?: Certification[];
  startDate?: string; // ISO date string
  currentWage?: number;
  wageHistory?: WageHistoryEntry[];
  // Could add more employment details like position/title here if not covered by wageHistory
}

export interface Shift {
  id: string;
  userId: string; // Employee assigned to the shift
  userName?: string; // For display
  startTime: Date;
  endTime: Date;
  role?: string; // e.g., Barista, Cashier
  notes?: string;
  isFinalized?: boolean;
}

export interface AvailabilityRecord {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  isUnavailable: boolean; // True if unavailable, false if it's a vacation request (or use a type field)
  reason?: string;
  status: 'pending' | 'approved' | 'declined'; // For vacation requests
}

export interface DayWithShifts {
  date: Date;
  shifts: Shift[];
  availability: AvailabilityRecord[];
}

export interface SpecialOperatingHours {
  id: string; // For list key or database ID
  date: Date;
  openingTime?: string; // HH:MM, overrides default if present
  closingTime?: string; // HH:MM, overrides default if present
  isClosed?: boolean; // If true, cafe is closed on this date
  reason?: string; // Optional reason for the override
}

export interface CafeSettings {
  openingTime: string; // HH:MM format e.g., "09:00"
  closingTime: string; // HH:MM format e.g., "17:00"
  holidayCountry?: string;
  holidayState?: string;
  specialOverrides?: SpecialOperatingHours[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string; // Can be a userId or a group ID like 'managers'
  recipientName: string; 
  content: string;
  timestamp: number; // Unix timestamp
  isRead: boolean;
  threadId?: string; // Optional: for grouping messages into threads/conversations
}

// Mock user type for recipient selection by managers (used in MessagesPage)
export interface MockSimpleUser {
  id: string;
  name: string;
  role: UserRole;
}
