import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Define types for our data
interface User {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
}

// You can expand these types as needed
interface DailyPlan {
    id: string;
    date: string;
    coffeeMakerIds: string[];
}

interface WeeklyPlan {
    id: string;
    users: Record<string, User>;
    dailyPlans: DailyPlan[];
}


export const api = {
    // Plan Endpoints
    getTodaysPlan: () => apiClient.get<DailyPlan>('/plans/today'),
    getCurrentWeeklyPlan: () => apiClient.get<WeeklyPlan>('/plans/weekly/current'),
    generateNewWeeklyPlan: () => apiClient.post<WeeklyPlan>('/plans/weekly'),

    // Duty Endpoint
    getNextBuyer: () => apiClient.get<User>('/duty/buyer'),

    // User Endpoints
    updateUserStatus: (userId: string, isActive: boolean) => apiClient.put(`/users/${userId}/status`, { isActive }),
};