// Shared type definitions that match the backend models

export interface User {
    id: string; // UUID as string for frontend
    name: string;
    email: string;
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

// Frontend-specific types
export interface FrontendUser extends Omit<User, 'id'> {
    plan?: 'free' | 'daily' | 'weekly';
}

export interface TodaysPlan {
    date: string;
    coffeeMakerIds: string[]; // Legacy frontend interface
} 