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
    Tooltip,
} from 'antd';
import {
    SearchOutlined,
    StopOutlined,
    CheckCircleOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';

const { Title, Text } = Typography;

const AdminShopManagement: React.FC = () => {
    const { message, modal } = App.useApp();
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const data = await adminService.getShops();
            setShops(data);
        } catch (error) {
            message.error('Không thể tải danh sách cửa hàng!');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = (shop: any) => {
        const newStatus = shop.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        modal.confirm({
            title: `${newStatus === 'ACTIVE' ? 'Mở khóa' : 'Khóa'} tài khoản shop`,
            content: `Bạn có chắc chắn muốn ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'} shop "${shop.name}" không?`,
            onOk: async () => {
                try {
                    await adminService.updateShopStatus(shop.id, newStatus);
                    message.success('Cập nhật trạng thái thành công!');
                    fetchShops();
                } catch (error) {
                    message.error('Không thể cập nhật trạng thái!');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Cửa hàng',
            key: 'shop',
            render: (record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text strong>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                </Space>
            ),
        },
        {
            title: 'Chủ shop / SĐT',
            key: 'owner',
            render: (record: any) => (
                <Space orientation="vertical" size={0}>
                    <Text>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.phone || 'N/A'}</Text>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
                    {status === 'ACTIVE' ? 'ĐANG HOẠT ĐỘNG' : 'BỊ KHÓA'}
                </Tag>
            ),
        },
        {
            title: 'Công nợ hiện tại',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance: number) => (
                <Text strong style={{ color: balance > 0 ? '#ff4d4f' : '#52c41a' }}>
                    {balance > 0 ? '+' : ''}{balance?.toLocaleString()} đ
                </Text>
            ),
            sorter: (a: any, b: any) => a.balance - b.balance,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: any) => (
                <Space size="middle">
                    <Tooltip title={record.status === 'ACTIVE' ? 'Khóa Shop' : 'Mở khóa Shop'}>
                        <Button
                            icon={record.status === 'ACTIVE' ? <StopOutlined /> : <CheckCircleOutlined />}
                            danger={record.status === 'ACTIVE'}
                            type="text"
                            onClick={() => handleToggleStatus(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const filteredShops = shops.filter(shop =>
        shop.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        shop.phone?.includes(searchText) ||
        shop.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>🏪 Quản lý Cửa hàng</Title>
                <Text type="secondary">Giám sát trạng thái hoạt động và công nợ của các Shop trong hệ thống</Text>
            </div>

            <Card style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Input
                    placeholder="Tìm kiếm theo tên shop, email, số điện thoại..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    size="large"
                    style={{ maxWidth: '500px', borderRadius: '8px' }}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                />
            </Card>

            <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={columns}
                    dataSource={filteredShops}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <ShoppingOutlined style={{ fontSize: '48px', color: '#f0f0f0', marginBottom: '16px' }} />
                                <p>Không tìm thấy dữ liệu cửa hàng nào</p>
                            </div>
                        )
                    }}
                />
            </Card>
        </div>
    );
};

export default AdminShopManagement;
