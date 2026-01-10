import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Typography,
    Space,
    Avatar,
    Progress,
    Alert,
} from 'antd';
import {
    ShopOutlined,
    CarOutlined,
    ShoppingOutlined,
    DollarOutlined,
    WarningOutlined,
    RiseOutlined,
    TeamOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import {
    BarChart,
    Bar,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { AdminStats } from '../../types';

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats>({
        totalShops: 0,
        totalShippers: 0,
        totalOrders: 0,
        totalCodVolume: 0,
        activeOrders: 0,
        pendingSettlements: 0,
        systemRevenue: 0,
        fraudAlerts: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/admin/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            }
        };
        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Mock data for charts
    const revenueData = [
        { month: 'T1', revenue: 85000000, orders: 1200 },
        { month: 'T2', revenue: 92000000, orders: 1350 },
        { month: 'T3', revenue: 88000000, orders: 1280 },
        { month: 'T4', revenue: 105000000, orders: 1520 },
        { month: 'T5', revenue: 115000000, orders: 1680 },
        { month: 'T6', revenue: 125000000, orders: 1850 },
    ];

    const statusData = [
        { name: 'Đã giao', value: 8500, color: '#52c41a' },
        { name: 'Đang giao', value: 2340, color: '#1890ff' },
        { name: 'Thất bại', value: 850, color: '#ff4d4f' },
        { name: 'Chờ lấy', value: 760, color: '#faad14' },
    ];

    const topShops = [
        { id: 1, name: 'Shop Thời Trang ABC', orders: 1250, revenue: 450000000, growth: 15.5 },
        { id: 2, name: 'Shop Điện Tử XYZ', orders: 980, revenue: 380000000, growth: 12.3 },
        { id: 3, name: 'Shop Mỹ Phẩm DEF', orders: 856, revenue: 320000000, growth: 18.7 },
        { id: 4, name: 'Shop Giày Dép GHI', orders: 745, revenue: 280000000, growth: 9.2 },
        { id: 5, name: 'Shop Phụ Kiện JKL', orders: 623, revenue: 210000000, growth: 14.1 },
    ];

    const topShippers = [
        { id: 1, name: 'Nguyễn Văn A', deliveries: 450, successRate: 96.5, revenue: 13500000 },
        { id: 2, name: 'Trần Thị B', deliveries: 420, successRate: 95.2, revenue: 12600000 },
        { id: 3, name: 'Lê Văn C', deliveries: 385, successRate: 94.8, revenue: 11550000 },
        { id: 4, name: 'Phạm Thị D', deliveries: 360, successRate: 97.1, revenue: 10800000 },
        { id: 5, name: 'Hoàng Văn E', deliveries: 340, successRate: 93.5, revenue: 10200000 },
    ];

    const shopColumns = [
        {
            title: 'Tên Shop',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Space>
                    <Avatar style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {text.charAt(0)}
                    </Avatar>
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Số đơn',
            dataIndex: 'orders',
            key: 'orders',
            sorter: (a: any, b: any) => a.orders - b.orders,
        },
        {
            title: 'Doanh thu',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (revenue: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {formatCurrency(revenue)}
                </Text>
            ),
            sorter: (a: any, b: any) => a.revenue - b.revenue,
        },
        {
            title: 'Tăng trưởng',
            dataIndex: 'growth',
            key: 'growth',
            render: (growth: number) => (
                <Tag color={growth > 10 ? 'success' : 'default'}>
                    <RiseOutlined /> {growth}%
                </Tag>
            ),
            sorter: (a: any, b: any) => a.growth - b.growth,
        },
    ];

    const shipperColumns = [
        {
            title: 'Tên Shipper',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Space>
                    <Avatar style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        {text.charAt(0)}
                    </Avatar>
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Số đơn giao',
            dataIndex: 'deliveries',
            key: 'deliveries',
            sorter: (a: any, b: any) => a.deliveries - b.deliveries,
        },
        {
            title: 'Tỷ lệ thành công',
            dataIndex: 'successRate',
            key: 'successRate',
            render: (rate: number) => (
                <Progress
                    percent={rate}
                    size="small"
                    strokeColor={rate > 95 ? '#52c41a' : '#faad14'}
                />
            ),
            sorter: (a: any, b: any) => a.successRate - b.successRate,
        },
        {
            title: 'Thu nhập',
            dataIndex: 'revenue',
            key: 'revenue',
            render: (revenue: number) => formatCurrency(revenue),
            sorter: (a: any, b: any) => a.revenue - b.revenue,
        },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
            <div className="page-header">
                <Title level={2} style={{ margin: 0 }}>
                    Dashboard Admin
                </Title>
                <Text type="secondary">Giám sát toàn bộ hệ thống COD</Text>
            </div>

            {/* Fraud Alerts */}
            {stats.fraudAlerts > 0 && (
                <Alert
                    message="Cảnh báo gian lận"
                    description={`Có ${stats.fraudAlerts} cảnh báo gian lận cần xem xét. Vui lòng kiểm tra ngay!`}
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    closable
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Statistics Cards */}
            <div className="dashboard-grid">
                <div className="stat-card clickable" onClick={() => navigate('/admin/shops')}>
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <ShopOutlined />
                    </div>
                    <div className="stat-card-content">
                        <Statistic
                            title="Tổng số Shop"
                            value={stats.totalShops}
                            suffix="shop"
                        />
                        <div className="stat-card-footer">
                            <Text type="secondary">Quản lý <ArrowRightOutlined /></Text>
                        </div>
                    </div>
                </div>

                <div className="stat-card clickable" onClick={() => navigate('/admin/shippers')}>
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        <CarOutlined />
                    </div>
                    <div className="stat-card-content">
                        <Statistic
                            title="Tổng số Shipper"
                            value={stats.totalShippers}
                            suffix="shipper"
                        />
                        <div className="stat-card-footer">
                            <Text type="secondary">Quản lý <ArrowRightOutlined /></Text>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <ShoppingOutlined />
                    </div>
                    <Statistic
                        title="Tổng đơn hàng"
                        value={stats.totalOrders}
                        suffix="đơn"
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Tổng giá trị COD"
                        value={stats.totalCodVolume}
                        formatter={(value) => formatCurrency(Number(value))}
                        styles={{ content: { fontWeight: 'bold' } }}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <TeamOutlined />
                    </div>
                    <Statistic
                        title="Đơn đang hoạt động"
                        value={stats.activeOrders}
                        suffix="đơn"
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Doanh thu hệ thống"
                        value={stats.systemRevenue}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                </div>
            </div>

            {/* Charts */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={16}>
                    <Card title="Doanh thu và đơn hàng 6 tháng qua" variant="borderless">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                                <Legend />
                                <Bar yAxisId="left" dataKey="revenue" fill="#1890ff" name="Doanh thu" />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#52c41a"
                                    strokeWidth={2}
                                    name="Số đơn"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Phân bố trạng thái đơn hàng" variant="borderless">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Top Performers */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="Top 5 Shop hiệu suất cao" variant="borderless">
                        <Table
                            columns={shopColumns}
                            dataSource={topShops}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card title="Top 5 Shipper xuất sắc" variant="borderless">
                        <Table
                            columns={shipperColumns}
                            dataSource={topShippers}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
