import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Button,
    Space,
    Typography,
    DatePicker,
    Select,
} from 'antd';
import {
    DollarOutlined,
    ShoppingOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    WarningOutlined,
    DownloadOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Order, ShopStats } from '../../types';
import { orderService } from '../../services/orderService';
import { shopService } from '../../services/shopService';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ShopDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<ShopStats>({
        totalOrders: 0,
        totalCodAmount: 0,
        collectedAmount: 0,
        pendingAmount: 0,
        failedAmount: 0,
        shipperDebt: 0,
        successRate: 0,
        todayOrders: 0,
        todayRevenue: 0,
        pendingReceivable: 0,
        overdueSettlements: 0,
    });
    const [orders, setOrders] = useState<Order[]>([]);
    const [revenueChartData, setRevenueChartData] = useState<any[]>([]);
    const [ordersChartData, setOrdersChartData] = useState<any[]>([]);

    // ... logic ...

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch stats and charts in parallel
            const [statsData, ordersResp, revenue7Days, orders7Days] = await Promise.all([
                orderService.getOrderStats(),
                orderService.getOrders({ page: 0, size: 10 }),
                shopService.getRevenue7Days(),
                shopService.getOrders7Days()
            ]);

            setStats(statsData);
            setOrders(ordersResp.content);
            setRevenueChartData(revenue7Days);
            setOrdersChartData(orders7Days);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'default',
            PICKED_UP: 'processing',
            IN_TRANSIT: 'processing',
            DELIVERING: 'warning',
            DELIVERED_SUCCESS: 'success',
            DELIVERY_FAILED: 'error',
            RETURNED: 'default',
            CANCELLED: 'error',
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            PENDING: 'Chờ lấy hàng',
            PICKED_UP: 'Đã lấy hàng',
            IN_TRANSIT: 'Đang vận chuyển',
            DELIVERING: 'Đang giao',
            DELIVERED_SUCCESS: 'Đã giao',
            DELIVERY_FAILED: 'Thất bại',
            RETURNED: 'Đã hoàn',
            CANCELLED: 'Đã hủy',
        };
        return texts[status] || status;
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'receiverName',
            key: 'receiverName',
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Số tiền COD',
            dataIndex: 'codAmount',
            key: 'codAmount',
            render: (amount: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {formatCurrency(amount)}
                </Text>
            ),
        },
        {
            title: 'Phí ship',
            dataIndex: 'shippingFee',
            key: 'shippingFee',
            render: (fee: number) => formatCurrency(fee),
        },
        {
            title: 'Shipper',
            dataIndex: 'shipperName',
            key: 'shipperName',
            render: (name: string) => name || <Text type="secondary">Chưa phân</Text>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
            <div className="page-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            Dashboard Shop
                        </Title>
                        <Text type="secondary">Quản lý đơn hàng và đối soát COD</Text>
                    </Col>
                    <Col>
                        <Space>
                            <RangePicker />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => navigate('/shop/orders/new')}
                            >
                                Tạo đơn hàng
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* Statistics Cards */}
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <ShoppingOutlined />
                    </div>
                    <Statistic
                        title="Tổng đơn hàng hôm nay"
                        value={stats.todayOrders}
                        suffix="đơn"
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Doanh thu hôm nay"
                        value={stats.todayRevenue}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <CheckCircleOutlined />
                    </div>
                    <Statistic
                        title="Đã thu được"
                        value={stats.collectedAmount}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <ClockCircleOutlined />
                    </div>
                    <Statistic
                        title="Chờ đối soát"
                        value={stats.pendingReceivable}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Phí ship phải trả"
                        value={stats.pendingPayable || 0}
                        formatter={(value) => formatCurrency(Number(value))}
                        styles={{ content: { color: stats.pendingPayable ? '#cf1322' : 'inherit' } }}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <WarningOutlined />
                    </div>
                    <Statistic
                        title="Quá hạn thanh toán"
                        value={stats.overdueSettlements}
                        suffix="đơn"
                        styles={{ content: { fontWeight: 'bold' } }}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Tỷ lệ thành công"
                        value={stats.successRate}
                        suffix="%"
                        precision={1}
                    />
                </div>
            </div>

            {/* Charts */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Doanh thu 7 ngày qua" variant="borderless">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    name="Doanh thu"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Số đơn hàng 7 ngày qua" variant="borderless">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ordersChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="totalOrders" fill="#52c41a" name="Số đơn" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Recent Orders Table */}
            <Card
                title="Đơn hàng gần đây"
                variant="borderless"
                extra={
                    <Button icon={<DownloadOutlined />}>
                        Xuất Excel
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} đơn hàng`,
                    }}
                />
            </Card>
        </div>
    );
};

export default ShopDashboard;
