import apiClient from './api';

export const adminService = {
    getShops: async (): Promise<any[]> => {
        const response = await apiClient.get('/admin/shops');
        return response.data;
    },

    updateShopStatus: async (shopId: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<void> => {
        await apiClient.patch(`/admin/shops/${shopId}/status`, { status });
    },

    getShippers: async (): Promise<any[]> => {
        const response = await apiClient.get('/admin/shippers');
        return response.data;
    },

    updateShipperStatus: async (shipperId: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<void> => {
        await apiClient.patch(`/admin/shippers/${shipperId}/status`, { status });
    },

    getSettlements: async (): Promise<any[]> => {
        const response = await apiClient.get('/admin/settlements');
        return response.data;
    },

    confirmSettlement: async (id: number): Promise<void> => {
        await apiClient.post(`/admin/settlements/${id}/confirm`);
    },

    getDashboardStats: async (): Promise<any> => {
        const response = await apiClient.get('/admin/dashboard');
        return response.data;
    },

    getOrders: async (): Promise<any[]> => {
        const response = await apiClient.get('/admin/orders');
        return response.data;
    },

    getCodReport: async (startDate?: string, endDate?: string): Promise<any> => {
        const response = await apiClient.get('/admin/reports/cod', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    exportExcel: async (startDate?: string, endDate?: string): Promise<Blob> => {
        const response = await apiClient.get('/admin/reports/cod/export/excel', {
            params: { startDate, endDate },
            responseType: 'blob'
        });
        return response.data;
    },

    exportPdf: async (startDate?: string, endDate?: string): Promise<Blob> => {
        const response = await apiClient.get('/admin/reports/cod/export/pdf', {
            params: { startDate, endDate },
            responseType: 'blob'
        });
        return response.data;
    }
};
