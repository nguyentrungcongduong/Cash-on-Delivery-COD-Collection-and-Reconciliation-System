import apiClient from './api';
import type { Notification } from '../types';

export const notificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await apiClient.get('/notifications');
        return response.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await apiClient.get('/notifications/unread-count');
        return response.data.unreadCount;
    },

    markAsRead: async (id: number): Promise<void> => {
        await apiClient.put(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await apiClient.put('/notifications/read-all');
    }
};
