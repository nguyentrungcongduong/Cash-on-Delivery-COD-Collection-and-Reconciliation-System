import apiClient from './api';

export interface ShipperSettlementSummary {
    totalCod: number;
    totalFees: number;
    netAmount: number;
}

export const settlementService = {
    getShipperSummary: async (): Promise<ShipperSettlementSummary> => {
        const response = await apiClient.get('/shipper/settlement/summary');
        return response.data;
    },

    requestSettlement: async (data: any): Promise<any> => {
        const response = await apiClient.post('/shipper/settlement/request', data);
        return response.data;
    }
};
