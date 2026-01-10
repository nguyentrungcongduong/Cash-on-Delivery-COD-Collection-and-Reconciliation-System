import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Tag,
    Button,
    Space,
    Typography,
    Avatar,
    Progress,
    Modal,
    Form,
    Input,
    Select,
    App,
    Empty,
} from 'antd';
import {
    DollarOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ScanOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Order, ShipperStats } from '../../types';
import { orderService } from '../../services/orderService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ShipperDashboard: React.FC = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<ShipperStats>({
        totalOrders: 0,
        totalCodAmount: 0,
        collectedAmount: 0,
        pendingAmount: 0,
        failedAmount: 0,
        shipperDebt: 0,
        successRate: 0,
        todayOrders: 0,
        todayRevenue: 0,
        cashInHand: 0,
        pendingSettlement: 0,
        todayDeliveries: 0,
    });
    const [todayOrders, setTodayOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsData = await orderService.getShipperStats();
            setStats(statsData);

            const ordersData = await orderService.getShipperOrders({
                status: 'DELIVERING',
                page: 0,
                size: 20,
            });
            setTodayOrders(ordersData.content);
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

    const handleUpdateStatus = (order: Order) => {
        setSelectedOrder(order);
        setUpdateModalVisible(true);
    };

    const handleSubmitUpdate = async (values: any) => {
        try {
            if (values.status === 'DELIVERED_SUCCESS') {
                await orderService.deliverOrder(selectedOrder!.id, 'SUCCESS');
            } else if (values.status === 'DELIVERY_FAILED') {
                await orderService.deliverOrder(selectedOrder!.id, 'FAILED');
            } else {
                await orderService.updateOrderStatus(selectedOrder!.id, values.status);
            }

            message.success('Cập nhật trạng thái thành công!');
            setUpdateModalVisible(false);
            form.resetFields();
            fetchDashboardData();
        } catch (error) {
            message.error('Cập nhật thất bại!');
        }
    };

    const pieData = [
        { name: 'Đã giao', value: stats.todayDeliveries, color: '#52c41a' },
        { name: 'Đang giao', value: stats.todayOrders - stats.todayDeliveries, color: '#1890ff' },
    ];

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

    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
            <div className="page-header">
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            Dashboard Shipper
                        </Title>
                        <Text type="secondary">Quản lý giao hàng và thu tiền COD</Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<ScanOutlined />} size="large">
                            Quét mã đơn hàng
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Statistics Cards */}
            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <CarOutlined />
                    </div>
                    <Statistic
                        title="Đơn hàng hôm nay"
                        value={stats.todayOrders}
                        suffix="đơn"
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        <CheckCircleOutlined />
                    </div>
                    <Statistic
                        title="Đã giao thành công"
                        value={stats.todayDeliveries}
                        suffix="đơn"
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Tiền mặt đang cầm"
                        value={stats.cashInHand}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Shop nợ phí ship"
                        value={stats.shopDebtToShipper || 0}
                        formatter={(value) => formatCurrency(Number(value))}
                        styles={{ content: { color: stats.shopDebtToShipper ? '#cf1322' : 'inherit' } }}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <ClockCircleOutlined />
                    </div>
                    <Statistic
                        title="Chờ đối soát"
                        value={stats.pendingSettlement}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Tỷ lệ giao thành công"
                        value={stats.successRate}
                        suffix="%"
                        precision={1}
                    />
                </div>

                <div className="stat-card">
                    <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                        <DollarOutlined />
                    </div>
                    <Statistic
                        title="Thu nhập hôm nay"
                        value={stats.todayRevenue}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Delivery Progress */}
                <Col xs={24} lg={8}>
                    <Card title="Tiến độ giao hàng hôm nay" variant="borderless">
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Progress
                                type="circle"
                                percent={Math.round((stats.todayDeliveries / stats.todayOrders) * 100)}
                                format={(percent) => `${percent}%`}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                size={150}
                            />
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Today's Deliveries */}
                <Col xs={24} lg={16}>
                    <Card
                        title="Đơn hàng cần giao hôm nay"
                        variant="borderless"
                        extra={<Text type="secondary">{todayOrders.length} đơn</Text>}
                    >
                        <div style={{ maxHeight: 600, overflow: 'auto' }}>
                            {loading ? (
                                <Text>Đang tải...</Text>
                            ) : todayOrders.length === 0 ? (
                                <Empty description="Không có đơn hàng nào hôm nay" />
                            ) : (
                                todayOrders.map((order) => (
                                    <div key={order.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <Avatar
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    flexShrink: 0
                                                }}
                                                icon={<EnvironmentOutlined />}
                                            />
                                            <div>
                                                <div style={{ marginBottom: '4px' }}>
                                                    <Space>
                                                        <Text strong>{order.orderCode}</Text>
                                                        <Tag color={getStatusColor(order.status)}>
                                                            {getStatusText(order.status)}
                                                        </Tag>
                                                    </Space>
                                                </div>
                                                <Space orientation="vertical" size={0}>
                                                    <Text type="secondary" style={{ fontSize: '11px' }}>
                                                        Lấy: {order.pickupAddress}
                                                    </Text>
                                                    <Text>
                                                        <EnvironmentOutlined /> {order.receiverAddress}
                                                    </Text>
                                                    <Text>
                                                        <PhoneOutlined /> {order.receiverPhone}
                                                    </Text>
                                                    <Text strong style={{ color: '#1890ff' }}>
                                                        <ShoppingOutlined /> {order.productName}
                                                    </Text>
                                                    <Text strong style={{ color: '#52c41a' }}>
                                                        Thu: {formatCurrency(order.codAmount)}
                                                    </Text>
                                                </Space>
                                            </div>
                                        </div>
                                        <Button
                                            type="primary"
                                            size="small"
                                            onClick={() => handleUpdateStatus(order)}
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Update Status Modal */}
            <Modal
                title="Cập nhật trạng thái đơn hàng"
                open={updateModalVisible}
                onCancel={() => {
                    setUpdateModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmitUpdate}>
                    <Form.Item label="Mã đơn hàng">
                        <Input value={selectedOrder?.orderCode} disabled />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value="PICKED_UP">Đã lấy hàng</Select.Option>
                            <Select.Option value="IN_TRANSIT">Đang vận chuyển</Select.Option>
                            <Select.Option value="DELIVERING">Đang giao</Select.Option>
                            <Select.Option value="DELIVERED_SUCCESS">Đã giao thành công</Select.Option>
                            <Select.Option value="DELIVERY_FAILED">Giao thất bại</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="note">
                        <TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setUpdateModalVisible(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ShipperDashboard;
