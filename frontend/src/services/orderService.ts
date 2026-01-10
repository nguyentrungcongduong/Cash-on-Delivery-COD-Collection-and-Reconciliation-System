import apiClient from './api';
import type { Order, ShopStats, ShipperStats, OrderStatus } from '../types';

export interface CreateOrderRequest {
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    pickupAddress: string;
    productName: string;
    weight: number;
    codAmount: number;
    shippingFee: number;
    shipperNote: string;
    allowInspection: 'YES' | 'NO';
    note?: string;
}

export const orderService = {
    createOrder: async (data: CreateOrderRequest): Promise<Order> => {
        const response = await apiClient.post('/shop/orders', data);
        return response.data;
    },

    getShopOrders: async (): Promise<Order[]> => {
        const response = await apiClient.get('/shop/orders');
        return response.data;
    },

    getOrders: async (params: any): Promise<{ content: Order[] }> => {
        const response = await apiClient.get('/shop/orders', { params });
        if (Array.isArray(response.data)) {
            return { content: response.data };
        }
        return response.data;
    },

    getOrderStats: async (): Promise<ShopStats> => {
        const response = await apiClient.get('/shop/dashboard');
        return response.data;
    },

    // Shipper methods
    getShipperStats: async (): Promise<ShipperStats> => {
        const response = await apiClient.get('/shipper/dashboard');
        return response.data;
    },

    getShipperOrders: async (params: any): Promise<{ content: Order[] }> => {
        const response = await apiClient.get('/shipper/orders', { params });
        if (Array.isArray(response.data)) {
            return { content: response.data };
        }
        return response.data;
    },

    updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
        const response = await apiClient.patch(`/shipper/orders/${orderId}/status`, { status });
        return response.data;
    },

    deliverOrder: async (orderId: string, result: 'SUCCESS' | 'FAILED', reason?: string): Promise<Order> => {
        const response = await apiClient.post(`/shipper/orders/${orderId}/deliver`, { result, reason });
        return response.data;
    },

    getShippers: async (): Promise<any[]> => {
        const response = await apiClient.get('/shop/shippers');
        return response.data;
    },

    deleteOrder: async (orderId: string | number): Promise<void> => {
        await apiClient.delete(`/shop/orders/${orderId}`);
    },

    getShopCodReport: async (startDate?: string, endDate?: string): Promise<any> => {
        const response = await apiClient.get('/shop/reports/cod', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    exportExcel: async (startDate?: string, endDate?: string): Promise<Blob> => {
        const response = await apiClient.get('/shop/reports/cod/export/excel', {
            params: { startDate, endDate },
            responseType: 'blob'
        });
        return response.data;
    },

    exportPdf: async (startDate?: string, endDate?: string): Promise<Blob> => {
        const response = await apiClient.get('/shop/reports/cod/export/pdf', {
            params: { startDate, endDate },
            responseType: 'blob'
        });
        return response.data;
    },
};
