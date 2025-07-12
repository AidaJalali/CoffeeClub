// Shared type definitions that match the backend models

export interface User {
    id: string; // UUID as string for frontend
    name: string;
    email: string;
    isActive: boolean;
    isAdmin?: boolean;
    walletBalance?: number;
}

export interface Session {
    id: string;
    title: string;
    dateTime: string;
    location: string;
    maxParticipants: number;
    participants: string[];
    coffeeMakers: string[];
    mokaPotCleaner?: string;
    isActive: boolean;
}

export interface DailyPlan {
    id: string; // UUID as string for frontend
    date: string; // ISO date string
    activeUsers: string[]; // Array of user UUIDs as strings
    coffeeMakerIds: string[]; // Array of user UUIDs as strings - matches backend DTO
}

export interface WeeklyPlan {
    id: string; // UUID as string for frontend
    year: number;
    weekOfYear: number;
    users: Record<string, User>; // Map of user UUID to User object
    dailyPlans: DailyPlan[];
}

// DTOs for API requests
export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateUserStatusRequest {
    isActive: boolean;
}

export interface CreateSessionRequest {
    title: string;
    dateTime: string;
    location?: string;
}

export interface JoinSessionRequest {
    userId: string;
}

export interface LeaveSessionRequest {
    userId: string;
}

export interface UpdateWalletRequest {
    balance: number;
}

export interface UpdateEmailRequest {
    email: string;
}

export interface UpdateLocationRequest {
    location: string;
}

export interface UpdateTimeRequest {
    dateTime: string;
}

// Frontend-specific types
export interface FrontendUser extends User {
    plan?: 'free' | 'daily' | 'weekly';
}

export interface TodaysPlan {
    date: string;
    coffeeMakerIds: string[]; // Legacy frontend interface
} 