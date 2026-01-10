import React, { useEffect, useState } from 'react';
import {
    Card,
    Typography,
    Tag,
    Button,
    Space,
    App,
    Empty,
    Row,
    Col,
    Divider,
    Statistic,
    Modal,
    Select,
    Form,
    Input,
} from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    ShoppingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    RocketOutlined,
    WalletOutlined,
    ArrowRightOutlined,
    ClockCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import type { Order } from '../../types';
import { orderService } from '../../services/orderService';

const { Title, Text } = Typography;

const ShipperDeliveries: React.FC = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isFailModalOpen, setIsFailModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [failForm] = Form.useForm();

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        try {
            const data = await orderService.getShipperOrders({
                status: 'CREATED,ASSIGNED,DELIVERING'
            });
            setOrders(data.content);
        } catch (error) {
            message.error('Không thể tải danh sách đơn hàng!');
        } finally {
            setLoading(false);
        }
    };

    const handleDeliver = async (orderId: string, result: 'SUCCESS' | 'FAILED', reason?: string) => {
        try {
            await orderService.deliverOrder(orderId, result, reason);
            message.success(result === 'SUCCESS' ? 'Đã giao hàng thành công!' : 'Đã ghi nhận giao hàng thất bại!');
            setIsFailModalOpen(false);
            failForm.resetFields();
            fetchDeliveries();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Cập nhật trạng thái thất bại!';
            message.error(errorMsg);
            console.error('Delivery Error:', error.response?.data);
        }
    };

    const openFailureModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsFailModalOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { color: string; label: string }> = {
            CREATED: { color: '#2563eb', label: 'MỚI' },
            ASSIGNED: { color: '#7c3aed', label: 'ĐÃ PHÂN' },
            DELIVERING: { color: '#f59e0b', label: 'ĐANG GIAO' },
            DELIVERED_SUCCESS: { color: '#10b981', label: 'THÀNH CÔNG' },
            DELIVERY_FAILED: { color: '#ef4444', label: 'THẤT BẠI' },
        };
        return configs[status] || { color: '#64748b', label: status };
    };

    const totalCod = orders.reduce((sum, order) => sum + order.codAmount, 0);

    return (
        <div style={{
            padding: '32px 24px',
            maxWidth: '1100px',
            margin: '0 auto',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
            {/* Header Section */}
            <div style={{ marginBottom: '40px' }}>
                <Row justify="space-between" align="bottom">
                    <Col>
                        <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>
                            <RocketOutlined style={{ color: '#2563eb', marginRight: '12px' }} />
                            Lộ Trình Giao Hàng
                        </Title>
                        <Text type="secondary" style={{ fontSize: '16px' }}>Tối ưu hóa các điểm giao nhận trong hôm nay</Text>
                    </Col>
                    <Col>
                        <Space size={24}>
                            <Card className="stat-card-mini" styles={{ body: { padding: '12px 24px' } }} variant="borderless">
                                <Statistic
                                    title={<Text type="secondary" style={{ fontSize: '12px' }}>TỔNG ĐƠN</Text>}
                                    value={orders.length}
                                    styles={{ content: { fontWeight: 800, color: '#1e293b' } }}
                                />
                            </Card>
                            <Card className="stat-card-mini" styles={{ body: { padding: '12px 24px' } }} variant="borderless">
                                <Statistic
                                    title={<Text type="secondary" style={{ fontSize: '12px' }}>COD CẦN THU</Text>}
                                    value={totalCod}
                                    formatter={(v) => formatCurrency(v as number)}
                                    styles={{ content: { fontWeight: 800, color: '#10b981' } }}
                                />
                            </Card>
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* Replacement for List (since it warned List is deprecated) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {loading ? (
                    <Text>Đang tải...</Text>
                ) : orders.length === 0 ? (
                    <Card style={{ borderRadius: '20px', textAlign: 'center', padding: '40px' }}>
                        <Empty description={
                            <div>
                                <Text type="secondary" style={{ fontSize: '16px' }}>Hôm nay bạn chưa có đơn hàng nào cần giao.</Text>
                                <br />
                                <Text type="secondary">Hãy nghỉ ngơi hoặc kiểm tra lại sau!</Text>
                            </div>
                        } />
                    </Card>
                ) : orders.map((order) => {
                    const status = getStatusConfig(order.status);
                    return (
                        <Card
                            key={order.id}
                            className="delivery-card"
                            style={{
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                            }}
                            styles={{ body: { padding: 0 } }}
                        >
                            <div style={{ display: 'flex', height: '100%' }}>
                                {/* Left Status Bar */}
                                <div style={{ width: '6px', backgroundColor: status.color }}></div>

                                <div style={{ flex: 1, padding: '24px' }}>
                                    {/* Top Row: Code and Status */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <Space size={16}>
                                            <div style={{
                                                background: '#f1f5f9',
                                                padding: '4px 12px',
                                                borderRadius: '8px',
                                                fontWeight: 700,
                                                color: '#475569',
                                                fontSize: '14px'
                                            }}>
                                                {order.orderCode}
                                            </div>
                                            <Tag color={status.color} style={{
                                                margin: 0,
                                                borderRadius: '6px',
                                                fontWeight: 700,
                                                border: 'none',
                                                padding: '2px 10px'
                                            }}>
                                                {status.label}
                                            </Tag>
                                        </Space>
                                        <Space style={{ color: '#64748b' }}>
                                            <ClockCircleOutlined />
                                            <Text type="secondary" style={{ fontSize: '13px' }}>Cập nhật: 5 phút trước</Text>
                                        </Space>
                                    </div>

                                    <Row gutter={40}>
                                        <Col span={14}>
                                            {/* Journey Visualization */}
                                            <div style={{ position: 'relative', paddingLeft: '32px' }}>
                                                {/* Vertical line connecting dots */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: '11px',
                                                    top: '12px',
                                                    bottom: '12px',
                                                    width: '2px',
                                                    borderLeft: '2px dashed #e2e8f0'
                                                }}></div>

                                                {/* Pickup Point */}
                                                <div style={{ marginBottom: '24px', position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '-26px',
                                                        top: '4px',
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: '#2563eb',
                                                        border: '2px solid #fff',
                                                        boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
                                                        zIndex: 2
                                                    }}></div>
                                                    <Text type="secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                                        Điểm lấy hàng
                                                    </Text>
                                                    <Text strong style={{ fontSize: '15px', color: '#1e293b' }}>
                                                        {order.pickupAddress}
                                                    </Text>
                                                </div>

                                                {/* Delivery Point */}
                                                <div style={{ position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '-28px',
                                                        top: '4px',
                                                        zIndex: 2
                                                    }}>
                                                        <EnvironmentOutlined style={{ color: '#ef4444', fontSize: '16px' }} />
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                                        Điểm giao hàng
                                                    </Text>
                                                    <Text strong style={{ fontSize: '16px', color: '#1e293b', display: 'block' }}>
                                                        {order.receiverAddress}
                                                    </Text>
                                                    <div style={{ marginTop: '4px' }}>
                                                        <Space>
                                                            <PhoneOutlined style={{ color: '#2563eb' }} />
                                                            <Text strong>{order.receiverName}</Text>
                                                            <Divider orientation="vertical" />
                                                            <Text type="secondary">{order.receiverPhone}</Text>
                                                        </Space>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col span={10}>
                                            <div style={{
                                                background: '#f8fafc',
                                                borderRadius: '16px',
                                                padding: '20px',
                                                height: '100%',
                                                border: '1px solid #f1f5f9'
                                            }}>
                                                <Space orientation="vertical" style={{ width: '100%' }} size={16}>
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>SẢN PHẨM</Text>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                            <ShoppingOutlined style={{ color: '#64748b' }} />
                                                            <Text strong style={{ fontSize: '15px' }}>{order.productName}</Text>
                                                            {order.allowInspection === 'YES' ? (
                                                                <Tag color="green" style={{ marginLeft: '8px', borderRadius: '4px', fontWeight: 600 }}>CHO XEM HÀNG</Tag>
                                                            ) : (
                                                                <Tag color="red" style={{ marginLeft: '8px', borderRadius: '4px', fontWeight: 600 }}>KHÔNG CHO XEM</Tag>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>TIỀN CẦN THU (COD)</Text>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                            <WalletOutlined style={{ color: '#10b981' }} />
                                                            <Text style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>
                                                                {formatCurrency(order.codAmount)}
                                                            </Text>
                                                        </div>
                                                    </div>

                                                    {order.shipperNote && (
                                                        <div style={{
                                                            marginTop: '4px',
                                                            padding: '8px 12px',
                                                            background: '#eff6ff',
                                                            borderRadius: '8px',
                                                            border: '1px solid #dbeafe',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}>
                                                            <EyeOutlined style={{ color: '#2563eb' }} />
                                                            <Text strong style={{ color: '#1e40af', fontSize: '13px' }}>
                                                                {order.shipperNote}
                                                            </Text>
                                                        </div>
                                                    )}
                                                </Space>
                                            </div>
                                        </Col>
                                    </Row>

                                    {order.note && (
                                        <div style={{
                                            marginTop: '20px',
                                            padding: '12px 16px',
                                            background: '#fff7ed',
                                            borderRadius: '10px',
                                            borderLeft: '4px solid #f59e0b',
                                            fontSize: '13px'
                                        }}>
                                            <Text strong style={{ color: '#9a3412', marginRight: '8px' }}>Ghi chú:</Text>
                                            <Text style={{ color: '#c2410c' }}>{order.note}</Text>
                                        </div>
                                    )}
                                </div>

                                {/* Right Action Bar */}
                                <div style={{
                                    width: '200px',
                                    background: '#f8fafc',
                                    borderLeft: '1px solid #f1f5f9',
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    gap: '12px'
                                }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<CheckCircleOutlined />}
                                        style={{
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: '#10b981',
                                            borderColor: '#10b981',
                                            fontWeight: 700,
                                            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                                        }}
                                        onClick={() => handleDeliver(order.id, 'SUCCESS')}
                                    >
                                        Thành công
                                    </Button>
                                    <Button
                                        size="large"
                                        block
                                        icon={<CloseCircleOutlined />}
                                        style={{
                                            height: '50px',
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            color: '#ef4444',
                                            borderColor: '#fecaca',
                                            background: '#fff'
                                        }}
                                        onClick={() => openFailureModal(order.id)}
                                    >
                                        Thất bại
                                    </Button>
                                    <Button
                                        type="link"
                                        icon={<ArrowRightOutlined />}
                                        style={{ color: '#6366f1', fontWeight: 600 }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Modal
                title={null}
                open={isFailModalOpen}
                onCancel={() => {
                    setIsFailModalOpen(false);
                    failForm.resetFields();
                }}
                footer={null}
                centered
                closable={false}
                width={450}
                style={{ borderRadius: '24px', overflow: 'hidden' }}
                styles={{ body: { padding: '32px' } }}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Title level={2} style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>Báo cáo thất bại</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>Vui lòng chọn lý do:</Text>
                </div>

                <Form
                    form={failForm}
                    layout="vertical"
                    onFinish={(values) => {
                        const finalReason = values.customReason
                            ? `${values.reason}: ${values.customReason}`
                            : values.reason;
                        handleDeliver(selectedOrderId!, 'FAILED', finalReason);
                    }}
                >
                    <Form.Item
                        name="reason"
                        rules={[{ required: true, message: 'Vui lòng chọn lý do!' }]}
                    >
                        <Select
                            size="large"
                            placeholder="Chọn lý do giao hàng thất bại"
                            style={{ width: '100%' }}
                            dropdownStyle={{ borderRadius: '12px' }}
                            options={[
                                { value: 'Khách không nghe máy', label: '📞 Khách không nghe máy' },
                                { value: 'Khách từ chối nhận', label: '✋ Khách từ chối nhận' },
                                { value: 'Sai địa chỉ/SĐT', label: '📍 Sai địa chỉ/SĐT' },
                                { value: 'Khách hẹn ngày khác', label: '⏰ Khách hẹn ngày khác' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="customReason"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Ghi chú thêm (không bắt buộc)..."
                            style={{ borderRadius: '12px', padding: '12px' }}
                        />
                    </Form.Item>

                    <Row gutter={16} style={{ marginTop: '32px' }}>
                        <Col span={12}>
                            <Button
                                size="large"
                                block
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    border: 'none',
                                    background: '#f1f5f9',
                                    color: '#475569'
                                }}
                                onClick={() => {
                                    setIsFailModalOpen(false);
                                    failForm.resetFields();
                                }}
                            >
                                Đóng
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                type="primary"
                                size="large"
                                block
                                danger
                                style={{
                                    height: '50px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                                }}
                                onClick={() => failForm.submit()}
                            >
                                Gửi báo cáo
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <style>{`
                .delivery-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .delivery-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                }
                .stat-card-mini {
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .ant-statistic-title {
                    margin-bottom: 0px !important;
                }
            `}</style>
        </div>
    );
};

export default ShipperDeliveries;
