import React, { useEffect, useState } from 'react';
import {
    Table,
    Tag,
    Space,
    Card,
    Typography,
    Input,
    Select,
    Button,
    App,
    Tooltip,
    Divider,
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    ShoppingOutlined,
    FilterOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminOrderManagement: React.FC = () => {
    const { message } = App.useApp();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await adminService.getOrders();
            setOrders(data);
        } catch (error) {
            message.error('Không thể tải danh sách đơn hàng!');
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status: string) => {
        switch (status) {
            case 'CREATED': return <Tag color="default">MỚI TẠO</Tag>;
            case 'ASSIGNED': return <Tag color="blue">ĐÃ GÁN</Tag>;
            case 'PICKED_UP': return <Tag color="cyan">ĐÃ LẤY HÀNG</Tag>;
            case 'DELIVERING': return <Tag color="processing" icon={<SyncOutlined spin />}>ĐANG GIAO</Tag>;
            case 'DELIVERED_SUCCESS': return <Tag color="success">THÀNH CÔNG</Tag>;
            case 'DELIVERY_FAILED': return <Tag color="error">THẤT BẠI</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (text: string) => <Text strong style={{ color: '#1890ff' }}>{text}</Text>,
        },
        {
            title: 'Shop',
            dataIndex: 'shopName',
            key: 'shopName',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Shipper',
            dataIndex: 'shipperName',
            key: 'shipperName',
            render: (text: string) => (
                <Text style={{ fontStyle: text === 'Chưa gán' ? 'italic' : 'normal', color: text === 'Chưa gán' ? '#bfbfbf' : 'inherit' }}>
                    {text}
                </Text>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'receiver',
            render: (record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text>{record.receiverName}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.receiverPhone}</Text>
                </Space>
            ),
        },
        {
            title: 'Tiền COD',
            dataIndex: 'codAmount',
            key: 'codAmount',
            render: (val: number) => <Text strong>{val?.toLocaleString()} đ</Text>,
            sorter: (a: any, b: any) => a.codAmount - b.codAmount,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusTag(status),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a: any, b: any) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_record: any) => (
                <Tooltip title="Xem chi tiết (Tính năng đang phát triển)">
                    <Button icon={<EyeOutlined />} type="text" />
                </Tooltip>
            ),
        },
    ];

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderCode?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.shopName?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.shipperName?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.receiverName?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.receiverPhone?.includes(searchText);

        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>📦 Quản lý Đơn hàng Toàn hệ thống</Title>
                <Text type="secondary">Giám sát, theo dõi và truy vết trạng thái đơn hàng của tất cả Shop và Shipper</Text>
            </div>

            <Card style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Space separator={<Divider orientation="vertical" />} size="large" wrap>
                    <div style={{ minWidth: '350px' }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                            <SearchOutlined /> Tìm kiếm
                        </Text>
                        <Input
                            placeholder="Mã đơn, Shop, Shipper, Khách hàng..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            allowClear
                            style={{ borderRadius: '6px' }}
                        />
                    </div>
                    <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                            <FilterOutlined /> Trạng thái
                        </Text>
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: '200px' }}
                        >
                            <Option value="ALL">Tất cả trạng thái</Option>
                            <Option value="CREATED">Mới tạo</Option>
                            <Option value="ASSIGNED">Đã gán Shipper</Option>
                            <Option value="PICKED_UP">Đã lấy hàng</Option>
                            <Option value="DELIVERING">Đang giao hàng</Option>
                            <Option value="DELIVERED_SUCCESS">Giao thành công</Option>
                            <Option value="DELIVERY_FAILED">Giao thất bại</Option>
                        </Select>
                    </div>
                    <Button
                        type="link"
                        onClick={() => { setSearchText(''); setStatusFilter('ALL'); }}
                        style={{ marginTop: '24px' }}
                    >
                        Xóa bộ lọc
                    </Button>
                </Space>
            </Card>

            <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={columns}
                    dataSource={filteredOrders}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 15 }}
                    size="middle"
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <ShoppingOutlined style={{ fontSize: '48px', color: '#f0f0f0', marginBottom: '16px' }} />
                                <p>Không tìm thấy dữ liệu đơn hàng nào</p>
                            </div>
                        )
                    }}
                />
            </Card>
        </div>
    );
};

export default AdminOrderManagement;
