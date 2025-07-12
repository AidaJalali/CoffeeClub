import axios from 'axios';
import type { 
    User, 
    DailyPlan, 
    WeeklyPlan, 
    Session,
    CreateUserRequest, 
    LoginRequest, 
    UpdateUserStatusRequest,
    CreateSessionRequest,
    JoinSessionRequest,
    LeaveSessionRequest,
    UpdateWalletRequest,
    UpdateEmailRequest,
    UpdateLocationRequest,
    UpdateTimeRequest
} from '@/types/api';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
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
    getTodaysPlan: () => apiClient.get<DailyPlan>('/plans/today/ensure'),
    getCurrentWeeklyPlan: () => apiClient.get<WeeklyPlan>('/plans/weekly/current'),
    generateNewWeeklyPlan: () => apiClient.post<WeeklyPlan>('/plans/weekly'),
    getPlanById: (id: string) => apiClient.get<DailyPlan>(`/plans/${id}`),

    // Session Endpoints
    getActiveSessions: () => apiClient.get<Session[]>('/sessions'),
    getUpcomingSessions: () => apiClient.get<Session[]>('/sessions/upcoming'),
    getSessionById: (id: string) => apiClient.get<Session>(`/sessions/${id}`),
    joinSession: (sessionId: string, userId: string) => 
        apiClient.post<Session>(`/sessions/${sessionId}/join`, { userId } as JoinSessionRequest),
    leaveSession: (sessionId: string, userId: string) => 
        apiClient.post<Session>(`/sessions/${sessionId}/leave`, { userId } as LeaveSessionRequest),
    completeSession: (sessionId: string) => 
        apiClient.post<Session>(`/sessions/${sessionId}/complete`),

    // Admin Endpoints
    createSession: (sessionData: CreateSessionRequest) => 
        apiClient.post<Session>('/admin/sessions', sessionData),
    createAdminUser: (userData: CreateUserRequest) => 
        apiClient.post<User>('/admin/users/admin', userData),
    updateSessionLocation: (sessionId: string, location: string) => 
        apiClient.put(`/admin/sessions/${sessionId}/location`, { location } as UpdateLocationRequest),
    updateSessionTime: (sessionId: string, dateTime: string) => 
        apiClient.put(`/admin/sessions/${sessionId}/time`, { dateTime } as UpdateTimeRequest),
    updateUserWallet: (userId: string, balance: number) => 
        apiClient.put(`/admin/users/${userId}/wallet`, { balance } as UpdateWalletRequest),
    getAllSessions: () => apiClient.get<Session[]>('/admin/sessions'),

    // Duty Endpoint
    getNextBuyer: () => apiClient.get<User>('/duty/buyer'),

    // User Endpoints
    getActiveUsers: () => apiClient.get<User[]>('/users/active'),
    updateUserStatus: (userId: string, isActive: boolean) => 
        apiClient.put(`/users/${userId}/status`, { isActive } as UpdateUserStatusRequest),
    updateUserWallet: (userId: string, balance: number) => 
        apiClient.put(`/users/${userId}/wallet`, { balance } as UpdateWalletRequest),
    updateUserEmail: (userId: string, email: string) => 
        apiClient.put(`/users/${userId}/email`, { email } as UpdateEmailRequest),
};