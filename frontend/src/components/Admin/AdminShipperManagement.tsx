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
    UserOutlined,
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';

const { Title, Text } = Typography;

const AdminShipperManagement: React.FC = () => {
    const { message, modal } = App.useApp();
    const [shippers, setShippers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchShippers();
    }, []);

    const fetchShippers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getShippers();
            setShippers(data);
        } catch (error) {
            message.error('Không thể tải danh sách shipper!');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = (shipper: any) => {
        const newStatus = shipper.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        modal.confirm({
            title: `${newStatus === 'ACTIVE' ? 'Mở khóa' : 'Khóa'} tài khoản shipper`,
            content: `Bạn có chắc chắn muốn ${newStatus === 'ACTIVE' ? 'mở khóa' : 'khóa'} shipper "${shipper.name}" không?`,
            onOk: async () => {
                try {
                    await adminService.updateShipperStatus(shipper.id, newStatus);
                    message.success('Cập nhật trạng thái thành công!');
                    fetchShippers();
                } catch (error) {
                    message.error('Không thể cập nhật trạng thái!');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Shipper',
            key: 'shipper',
            render: (record: any) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
                </Space>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string) => text || 'N/A',
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
            title: 'COD đang giữ',
            dataIndex: 'holdingAmount',
            key: 'holdingAmount',
            render: (amount: number) => (
                <Text strong style={{ color: amount > 0 ? '#faad14' : '#52c41a' }}>
                    {amount?.toLocaleString()} đ
                </Text>
            ),
            sorter: (a: any, b: any) => a.holdingAmount - b.holdingAmount,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: any) => (
                <Space size="middle">
                    <Tooltip title={record.status === 'ACTIVE' ? 'Khóa Shipper' : 'Mở khóa Shipper'}>
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

    const filteredShippers = shippers.filter(shipper =>
        shipper.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        shipper.phone?.includes(searchText) ||
        shipper.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={2}>🚴 Quản lý Shipper</Title>
                <Text type="secondary">Giám sát tài khoản và số dư nợ COD của đội ngũ giao hàng</Text>
            </div>

            <Card style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Input
                    placeholder="Tìm kiếm theo tên shipper, email, số điện thoại..."
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
                    dataSource={filteredShippers}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <UserOutlined style={{ fontSize: '48px', color: '#f0f0f0', marginBottom: '16px' }} />
                                <p>Không tìm thấy dữ liệu shipper nào</p>
                            </div>
                        )
                    }}
                />
            </Card>
        </div>
    );
};

export default AdminShipperManagement;
