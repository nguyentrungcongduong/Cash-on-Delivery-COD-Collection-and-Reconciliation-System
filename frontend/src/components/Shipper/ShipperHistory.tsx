import React, { useEffect, useState } from 'react';
import {
    Card,
    Table,
    Tag,
    Typography,
    Input,
    Select,
    Space,
    App,
} from 'antd';
import {
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const ShipperHistory: React.FC = () => {
    const { message } = App.useApp();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Lấy cả đơn thành công và thất bại
            const data = await orderService.getShipperOrders({
                status: 'DELIVERED_SUCCESS,DELIVERY_FAILED'
            });
            setOrders(data.content);
        } catch (error) {
            message.error('Không thể tải lịch sử giao hàng!');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Cửa hàng',
            dataIndex: 'shopName',
            key: 'shopName',
            render: (text: string, record: any) => record.shop?.name || text || 'N/A',
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            render: (record: Order) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.receiverName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.receiverPhone}</Text>
                </Space>
            ),
        },
        {
            title: 'Tiền COD',
            dataIndex: 'codAmount',
            key: 'codAmount',
            render: (val: number) => <Text strong>{val?.toLocaleString()} đ</Text>,
        },
        {
            title: 'Kết quả',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: Order) => (
                <Space direction="vertical" size={0}>
                    {status === 'DELIVERED_SUCCESS' ? (
                        <Tag color="green" icon={<CheckCircleOutlined />}>Thành công</Tag>
                    ) : (
                        <Tag color="red" icon={<CloseCircleOutlined />}>Thất bại</Tag>
                    )}
                    {record.failReason && <Text type="danger" style={{ fontSize: '11px' }}>{record.failReason}</Text>}
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (record: Order) => {
                const time = record.status === 'DELIVERED_SUCCESS' ? record.deliveredAt : record.failedAt;
                return time ? dayjs(time).format('DD/MM/YYYY HH:mm') : 'N/A';
            },
        },
    ];

    const filteredData = orders.filter(order => {
        const matchesStatus = filterStatus === 'ALL' ||
            (filterStatus === 'SUCCESS' && order.status === 'DELIVERED_SUCCESS') ||
            (filterStatus === 'FAILED' && order.status === 'DELIVERY_FAILED');

        const matchesSearch = !searchText ||
            order.orderCode?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.receiverName?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.receiverPhone?.includes(searchText);

        return matchesStatus && matchesSearch;
    });

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>📜 Lịch sử giao hàng</Title>
                <Text type="secondary">Xem lại các đơn hàng đã xử lý xong</Text>
            </div>

            <Card style={{ borderRadius: '12px', marginBottom: '24px' }}>
                <Space size="large" wrap>
                    <div style={{ minWidth: '250px' }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Tìm kiếm</Text>
                        <Input
                            placeholder="Mã đơn, tên khách, SĐT..."
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                        />
                    </div>
                    <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Trạng thái</Text>
                        <Select
                            value={filterStatus}
                            onChange={setFilterStatus}
                            style={{ width: '180px' }}
                        >
                            <Option value="ALL">Tất cả</Option>
                            <Option value="SUCCESS">✅ Thành công</Option>
                            <Option value="FAILED">❌ Thất bại</Option>
                        </Select>
                    </div>
                </Space>
            </Card>

            <Card style={{ borderRadius: '12px' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <ShoppingOutlined style={{ fontSize: '48px', color: '#f0f0f0', marginBottom: '16px' }} />
                                <p>Không tìm thấy dữ liệu lịch sử nào</p>
                            </div>
                        )
                    }}
                />
            </Card>
        </div>
    );
};

export default ShipperHistory;
