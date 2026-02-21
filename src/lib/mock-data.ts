
import type { User } from '@/types';

export const MOCK_DETAILED_EMPLOYEES: User[] = [
  {
    id: 'emp1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'employee',
    avatarUrl: 'https://placehold.co/100x100.png?text=AS',
    phoneNumber: '+15551234567',
    startDate: '2023-01-15T00:00:00.000Z',
    currentWage: 18.50,
    skills: ['Latte Art', 'Customer Service', 'POS Operation'],
    certifications: [
      { id: 'cert1_alice', name: 'Barista Level 1', issuingOrg: 'Coffee Guild', issueDate: '2023-02-20T00:00:00.000Z', expiryDate: '2025-02-20T00:00:00.000Z' },
      { id: 'cert2_alice', name: 'Food Safety Handling', issueDate: '2023-01-30T00:00:00.000Z' },
    ],
    wageHistory: [
      { id: 'wage1_alice', date: '2023-01-15T00:00:00.000Z', newWage: 16.00, newTitle: 'Junior Barista' },
      { id: 'wage2_alice', date: '2023-07-15T00:00:00.000Z', newWage: 17.50, newTitle: 'Barista' },
      { id: 'wage3_alice', date: '2024-01-15T00:00:00.000Z', newWage: 18.50, notes: 'Annual review increase.' },
    ],
    recurringPreferences: [
        { id: 'rp1_alice', dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
        { id: 'rp2_alice', dayOfWeek: 'Wednesday', startTime: '12:00', endTime: '18:00' },
    ]
  },
  {
    id: 'emp2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'employee',
    avatarUrl: 'https://placehold.co/100x100.png?text=BJ',
    phoneNumber: '+15559876543',
    startDate: '2022-11-01T00:00:00.000Z',
    currentWage: 20.00,
    skills: ['Inventory Management', 'Shift Closing', 'Espresso Machine Maintenance'],
    certifications: [
      { id: 'cert1_bob', name: 'Advanced Barista', issuingOrg: 'Specialty Coffee Assoc.', issueDate: '2023-03-10T00:00:00.000Z' },
    ],
    wageHistory: [
      { id: 'wage1_bob', date: '2022-11-01T00:00:00.000Z', newWage: 18.00, newTitle: 'Barista' },
      { id: 'wage2_bob', date: '2023-05-01T00:00:00.000Z', newWage: 20.00, newTitle: 'Senior Barista', notes: 'Promotion to Senior Barista' },
    ],
    recurringPreferences: [
       { id: 'rp1_bob', dayOfWeek: 'Tuesday', startTime: '14:00', endTime: '18:00' },
       { id: 'rp2_bob', dayOfWeek: 'Thursday', startTime: '14:00', endTime: '18:00' },
       { id: 'rp3_bob', dayOfWeek: 'Friday', startTime: '10:00', endTime: '16:00' },
    ]
  },
  {
    id: 'emp3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'employee',
    avatarUrl: 'https://placehold.co/100x100.png?text=CB',
    phoneNumber: '+15551112222',
    startDate: '2024-03-01T00:00:00.000Z',
    currentWage: 17.00,
    skills: ['Cash Handling', 'Friendly Service'],
    certifications: [],
    wageHistory: [
      { id: 'wage1_charlie', date: '2024-03-01T00:00:00.000Z', newWage: 17.00, newTitle: 'Trainee Barista' },
    ],
    recurringPreferences: []
  },
  {
    id: 'manager1', // Mock manager user
    name: 'Manager Mike',
    email: 'manager@example.com',
    role: 'manager',
    avatarUrl: 'https://placehold.co/100x100.png?text=MM',
    phoneNumber: '+15553334444',
    startDate: '2021-01-01T00:00:00.000Z',
    currentWage: 30.00, // Managers might have wages or salaries
    skills: ['Team Leadership', 'Scheduling', 'Conflict Resolution', 'Budgeting'],
    certifications: [
      { id: 'cert1_manager', name: 'Management Essentials', issuingOrg: 'Business Institute', issueDate: '2022-05-10T00:00:00.000Z' },
    ],
    wageHistory: [
      { id: 'wage1_manager', date: '2021-01-01T00:00:00.000Z', newWage: 25.00, newTitle: 'Assistant Manager' },
      { id: 'wage2_manager', date: '2022-01-01T00:00:00.000Z', newWage: 30.00, newTitle: 'Cafe Manager', notes: 'Promotion' },
    ],
    recurringPreferences: [] // Managers typically set their own schedules or have fixed ones
  }
];

// This simple list is used by ManageShiftsPage and MessagesPage for quick employee selection
// It should ideally be derived from MOCK_DETAILED_EMPLOYEES or a user store in a real app.
export const mockSimpleEmployees = MOCK_DETAILED_EMPLOYEES.filter(u => u.role === 'employee').map(user => ({
  id: user.id,
  name: user.name,
  role: user.role,
}));
