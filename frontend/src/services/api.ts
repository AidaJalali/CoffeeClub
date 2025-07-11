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
    timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: {
                method: error.config?.method?.toUpperCase(),
                url: error.config?.url,
                data: error.config?.data
            }
        });
        
        // Handle specific error types
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - server might be down');
        } else if (error.code === 'ERR_NETWORK') {
            console.error('Network error - check if backend is running and CORS is configured');
        } else if (error.response?.status === 0) {
            console.error('CORS error - check backend CORS configuration');
        }
        
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