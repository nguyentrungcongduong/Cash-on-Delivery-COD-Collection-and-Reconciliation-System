import React, { useEffect, useState } from 'react';
import {
    Table,
    Tag,
    Space,
    Card,
    Typography,
    Input,
    Button,
    App,
    Modal,
    Popconfirm,
    Divider,
    Row,
    Col,
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';

const { Title, Text } = Typography;

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getShopOrders();
            setOrders(data);
        } catch (error) {
            message.error('Không thể tải danh sách đơn hàng!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (orderId: string | number) => {
        try {
            await orderService.deleteOrder(orderId);
            message.success('Đã xóa đơn hàng thành công!');
            setIsModalOpen(false);
            fetchOrders();
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Không thể xóa đơn hàng!');
        }
    };

    const showDetail = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const getStatusTag = (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
            CREATED: { color: 'default', text: 'Mới tạo' },
            ASSIGNED: { color: 'blue', text: 'Đã gán shipper' },
            PICKED_UP: { color: 'cyan', text: 'Đã lấy hàng' },
            DELIVERING: { color: 'orange', text: 'Đang giao' },
            DELIVERED_SUCCESS: { color: 'green', text: 'Thành công' },
            DELIVERY_FAILED: { color: 'red', text: 'Thất bại' },
            CANCELLED: { color: 'magenta', text: 'Đã hủy' },
            RETURNED: { color: 'purple', text: 'Chuyển hoàn' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (_: any, record: Order) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.receiverName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.receiverPhone}</Text>
                </Space>
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Tiền COD',
            dataIndex: 'codAmount',
            key: 'codAmount',
            render: (amount: number) => <Text strong style={{ color: '#52c41a' }}>{amount.toLocaleString()} đ</Text>,
            sorter: (a: Order, b: Order) => a.codAmount - b.codAmount,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusTag(status),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Order) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} type="text" onClick={() => showDetail(record)}>Chi tiết</Button>
                </Space>
            ),
        },
    ];

    const filteredOrders = orders.filter(order => {
        const searchLower = searchText.toLowerCase().trim();
        if (!searchLower) return true;

        return (
            order.orderCode?.toLowerCase().includes(searchLower) ||
            order.receiverName?.toLowerCase().includes(searchLower) ||
            order.receiverPhone?.includes(searchLower) ||
            order.productName?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Quản lý đơn hàng</Title>
                    <Text type="secondary">Danh sách tất cả vận đơn của bạn</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => navigate('/shop/orders/new')}
                    style={{ borderRadius: '8px' }}
                >
                    Tạo đơn mới
                </Button>
            </div>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '16px' }}>
                    <Input
                        placeholder="Tìm kiếm theo mã đơn, tên khách, SĐT, sản phẩm..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        size="large"
                        style={{ maxWidth: '400px', borderRadius: '8px' }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredOrders}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    className="custom-table"
                />
            </Card>

            <Modal
                title={<Title level={4} style={{ margin: 0 }}>Chi tiết đơn hàng</Title>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Popconfirm
                        key="delete"
                        title="Xóa đơn hàng"
                        description="Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác."
                        onConfirm={() => selectedOrder && handleDelete(selectedOrder.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />} style={{ float: 'left' }}>
                            Xóa đơn
                        </Button>
                    </Popconfirm>,
                    <Button key="close" onClick={() => setIsModalOpen(false)}>
                        Đóng
                    </Button>
                ]}
                width={500}
                styles={{
                    body: { padding: '20px 0' },
                    mask: { backdropFilter: 'blur(4px)' }
                }}
            >
                {selectedOrder && (
                    <div style={{ padding: '0 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text type="secondary">Mã đơn:</Text>
                            <Text strong style={{ color: '#1890ff', fontSize: 16 }}>{selectedOrder.orderCode}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text type="secondary">Khách hàng:</Text>
                            <Text strong>{selectedOrder.receiverName}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <Text type="secondary">SĐT:</Text>
                            <Text strong>{selectedOrder.receiverPhone}</Text>
                        </div>

                        {selectedOrder.shipperId ? (
                            <>
                                <Divider dashed style={{ margin: '12px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text type="secondary">Shipper:</Text>
                                    <Text strong>{selectedOrder.shipperName}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text type="secondary">SĐT Shipper:</Text>
                                    <Text strong style={{ color: '#1890ff' }}>{selectedOrder.shipperPhone}</Text>
                                </div>
                            </>
                        ) : (
                            <>
                                <Divider dashed style={{ margin: '12px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <Text type="secondary">Shipper:</Text>
                                    <Text type="secondary" italic>Chưa gán shipper</Text>
                                </div>
                            </>
                        )}

                        <Divider dashed style={{ margin: '16px 0' }} />

                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Sản phẩm:</Text>
                            <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: 15 }}>{selectedOrder.productName}</Text>
                                {selectedOrder.allowInspection === 'YES' ? (
                                    <Tag color="green">Cho xem hàng</Tag>
                                ) : (
                                    <Tag color="red">Không cho xem</Tag>
                                )}
                            </div>
                        </div>

                        <Row gutter={16} style={{ marginTop: 24 }}>
                            <Col span={12}>
                                <div style={{
                                    padding: '16px',
                                    background: 'rgba(24, 144, 255, 0.05)',
                                    borderRadius: 12,
                                    border: '1px solid rgba(24, 144, 255, 0.1)',
                                    textAlign: 'center'
                                }}>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' }}>Tiền COD</Text>
                                    <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{selectedOrder.codAmount.toLocaleString()} đ</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{
                                    padding: '16px',
                                    background: '#f8fafc',
                                    borderRadius: 12,
                                    border: '1px solid #e2e8f0',
                                    textAlign: 'center'
                                }}>
                                    <Text type="secondary" style={{ display: 'block', fontSize: 12, marginBottom: 4, textTransform: 'uppercase' }}>Phí Ship</Text>
                                    <Text strong style={{ fontSize: 18, color: '#475569' }}>{selectedOrder.shippingFee.toLocaleString()} đ</Text>
                                </div>
                            </Col>
                        </Row>

                        <div style={{
                            marginTop: 16,
                            padding: '16px',
                            background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
                            borderRadius: 12,
                            textAlign: 'center',
                            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.2)'
                        }}>
                            <Text style={{ display: 'block', fontSize: 12, marginBottom: 4, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop thực nhận</Text>
                            <Text strong style={{ fontSize: 24, color: '#fff' }}>
                                {(selectedOrder.codAmount - selectedOrder.shippingFee).toLocaleString()} đ
                            </Text>
                        </div>

                        <div style={{ marginTop: 24, padding: '12px 16px', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                            <Space orientation="vertical" size={4} style={{ width: '100%' }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>ĐỊA CHỈ NHẬN VÀ TRẠNG THÁI</Text>
                                <Space align="start">
                                    <EnvironmentOutlined style={{ color: '#8c8c8c', marginTop: 4 }} />
                                    <Text style={{ fontSize: 13 }}>{selectedOrder.receiverAddress}</Text>
                                </Space>
                                <div style={{ marginTop: 8 }}>
                                    {getStatusTag(selectedOrder.status)}
                                </div>
                            </Space>
                        </div>
                    </div>
                )}
            </Modal>

            <style>{`
                .custom-table .ant-table-thead > tr > th {
                    background: #f8fafc;
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default OrderManagement;
