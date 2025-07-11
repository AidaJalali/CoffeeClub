import axios from 'axios';
import type { 
    User, 
    DailyPlan, 
    WeeklyPlan, 
    CreateUserRequest, 
    LoginRequest, 
    UpdateUserStatusRequest 
} from '@/types/api';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const api = {
    // Authentication Endpoints
    registerUser: (userData: CreateUserRequest) => 
        apiClient.post<User>('/users/register', userData),
    
    loginUser: (loginData: LoginRequest) => 
        apiClient.post<User>('/users/login', loginData),

    // Plan Endpoints
    getTodaysPlan: () => apiClient.get<DailyPlan>('/plans/today'),
    getCurrentWeeklyPlan: () => apiClient.get<WeeklyPlan>('/plans/weekly/current'),
    generateNewWeeklyPlan: () => apiClient.post<WeeklyPlan>('/plans/weekly'),
    getPlanById: (id: string) => apiClient.get<DailyPlan>(`/plans/${id}`),

    // Duty Endpoint
    getNextBuyer: () => apiClient.get<User>('/duty/buyer'),

    // User Endpoints
    updateUserStatus: (userId: string, isActive: boolean) => 
        apiClient.put(`/users/${userId}/status`, { isActive } as UpdateUserStatusRequest),
};