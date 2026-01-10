import React, { useEffect, useState } from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Statistic,
    Table,
    Button,
    App,
} from 'antd';
import {
    WalletOutlined,
    HistoryOutlined,
    CheckCircleOutlined,
    SafetyOutlined,
} from '@ant-design/icons';
import { settlementService } from '../../services/settlementService';
import type { ShipperSettlementSummary } from '../../services/settlementService';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';

const { Title, Text } = Typography;

const ShipperSettlement: React.FC = () => {
    const { message } = App.useApp();
    const [summary, setSummary] = useState<ShipperSettlementSummary | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [summaryData, ordersData] = await Promise.all([
                settlementService.getShipperSummary(),
                orderService.getShipperOrders({ status: 'DELIVERED_SUCCESS' })
            ]);
            setSummary(summaryData);
            setOrders(ordersData.content);
        } catch (error) {
            message.error('Không thể tải dữ liệu đối soát!');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentRequest = async () => {
        try {
            // Mocking payment request for now
            await settlementService.requestSettlement({ amount: summary?.netAmount });
            message.success('Đã gửi thông báo nộp tiền! Vui lòng chờ Admin xác nhận.');
        } catch (error) {
            message.error('Gửi yêu cầu thất bại!');
        }
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            key: 'orderCode',
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Tiền thu (COD)',
            dataIndex: 'codAmount',
            key: 'codAmount',
            render: (val: number) => <Text strong style={{ color: '#10b981' }}>{val.toLocaleString()} đ</Text>,
        },
        {
            title: 'Phí ship',
            dataIndex: 'shippingFee',
            key: 'shippingFee',
            render: (val: number) => <Text type="secondary">-{val.toLocaleString()} đ</Text>,
        },
        {
            title: 'Thực nộp',
            key: 'net',
            render: (record: Order) => <Text strong>{(record.codAmount - record.shippingFee).toLocaleString()} đ</Text>,
        },
    ];

    return (
        <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2}>📊 Đối soát & Nộp tiền</Title>
                <Text type="secondary">Quản lý dòng tiền bạn đang giữ từ các đơn hàng đã giao thành công</Text>
            </div>

            <Row gutter={24} style={{ marginBottom: '32px' }}>
                <Col span={8}>
                    <Card style={{ borderRadius: '16px', background: '#f8fafc' }}>
                        <Statistic
                            title="TỔNG TIỀN COD ĐÃ THU"
                            value={summary?.totalCod || 0}
                            prefix={<WalletOutlined style={{ color: '#10b981' }} />}
                            suffix="đ"
                            styles={{ content: { fontWeight: 800, color: '#10b981' } }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ borderRadius: '16px', background: '#f8fafc' }}>
                        <Statistic
                            title="TỔNG PHÍ VẬN CHUYỂN"
                            value={summary?.totalFees || 0}
                            prefix={<HistoryOutlined style={{ color: '#64748b' }} />}
                            suffix="đ"
                            styles={{ content: { fontWeight: 800, color: '#475569' } }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{ borderRadius: '16px', background: '#1e293b' }}>
                        <Statistic
                            title={<Text style={{ color: 'rgba(255,255,255,0.6)' }}>SỐ TIỀN PHẢI NỘP</Text>}
                            value={summary?.netAmount || 0}
                            prefix={<SafetyOutlined style={{ color: '#3b82f6' }} />}
                            suffix={<span style={{ color: '#fff' }}>đ</span>}
                            styles={{ content: { fontWeight: 800, color: '#fff' } }}
                        />
                        <Button
                            type="primary"
                            block
                            size="large"
                            icon={<CheckCircleOutlined />}
                            style={{ marginTop: '16px', borderRadius: '8px', background: '#3b82f6' }}
                            onClick={handlePaymentRequest}
                            disabled={!summary || summary.netAmount <= 0}
                        >
                            Xác nhận đã nộp tiền
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Card title="Danh sách đơn hàng hoàn thành (Chưa đối soát)" style={{ borderRadius: '16px' }}>
                <Table
                    columns={columns}
                    dataSource={orders}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>
        </div>
    );
};

export default ShipperSettlement;
