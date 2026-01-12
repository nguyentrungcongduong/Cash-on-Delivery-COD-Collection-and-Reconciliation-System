import apiClient from './api';
import type { ShopProfileResponse } from '../types/index';

export const shopService = {
    getProfile: async (): Promise<ShopProfileResponse> => {
        const response = await apiClient.get('/shop/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<ShopProfileResponse>): Promise<ShopProfileResponse> => {
        const response = await apiClient.put('/shop/profile', data);
        return response.data;
    },

    getRevenue7Days: async (): Promise<{ date: string; revenue: number }[]> => {
        const response = await apiClient.get('/shop/dashboard/revenue-7-days');
        return response.data;
    },

    getOrders7Days: async (): Promise<{ date: string; totalOrders: number }[]> => {
        const response = await apiClient.get('/shop/dashboard/orders-7-days');
        return response.data;
    }
};
