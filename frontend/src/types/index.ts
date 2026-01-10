export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SHOP' | 'SHIPPER' | 'ADMIN';
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderCode: string;
  shopId: string;
  shopName: string;
  shipperId?: string;
  shipperName?: string;
  shipperPhone?: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  pickupAddress: string;
  productName: string;
  codAmount: number;
  shippingFee: number;
  netAmount: number; // codAmount - shippingFee
  status: OrderStatus;
  note?: string;
  shipperNote?: string;
  allowInspection?: 'YES' | 'NO';
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  failedAt?: string;
  failReason?: string;
}

export type OrderStatus =
  | 'CREATED'        // Đã tạo
  | 'ASSIGNED'       // Đã phân shipper
  | 'PICKED_UP'      // Đã lấy hàng
  | 'DELIVERING'     // Đang giao hàng
  | 'DELIVERED_SUCCESS' // Giao thành công
  | 'DELIVERY_FAILED'   // Giao thất bại
  | 'RETURNED'       // Đã hoàn trả
  | 'CANCELLED';     // Đã hủy

export interface Settlement {
  id: string;
  settlementCode: string;
  shopId: string;
  shopName: string;
  shipperId: string;
  shipperName: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  totalCodCollected: number;
  totalShippingFee: number;
  amountToTransfer: number; // totalCodCollected - totalShippingFee
  status: SettlementStatus;
  settlementDate: string;
  transferredAt?: string;
  confirmedAt?: string;
  note?: string;
  createdAt: string;
}

export type SettlementStatus =
  | 'PENDING'        // Chờ đối soát
  | 'CALCULATED'     // Đã tính toán
  | 'TRANSFERRED'    // Shipper đã chuyển tiền
  | 'CONFIRMED'      // Shop đã xác nhận
  | 'DISPUTED';      // Có tranh chấp

export interface DashboardStats {
  totalOrders: number;
  totalCodAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  failedAmount: number;
  shipperDebt: number;
  successRate: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface ShipperStats extends DashboardStats {
  cashInHand: number;
  pendingSettlement: number;
  todayDeliveries: number;
  shopDebtToShipper?: number;
}

export interface ShopStats extends DashboardStats {
  pendingReceivable: number;
  overdueSettlements: number;
  pendingPayable?: number;
}

export interface AdminStats {
  totalShops: number;
  totalShippers: number;
  totalOrders: number;
  totalCodVolume: number;
  activeOrders: number;
  pendingSettlements: number;
  systemRevenue: number;
  fraudAlerts: number;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChartData {
  date: string;
  orders: number;
  revenue: number;
  successRate: number;
}
