import apiClient from './api';
import type { User } from '../types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'SHOP' | 'SHIPPER';
}

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<LoginResponse> => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });
        return response.data;
    },
};
