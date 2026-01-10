import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography, App } from 'antd';
import apiClient from '../../services/api';

const { Title } = Typography;

const AdminSettlement: React.FC = () => {
    const { message } = App.useApp();
    const [settlements, setSettlements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSettlements = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/admin/settlements');
            setSettlements(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Fetch admin settlements error:', error);
            setSettlements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettlements();
    }, []);

    const handleConfirm = async (id: number) => {
        try {
            await apiClient.post(`/admin/settlements/${id}/confirm`);
            message.success('Đã xác nhận thanh toán!');
            fetchSettlements();
        } catch (error) {
            message.error('Xác nhận thất bại!');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Shipper', dataIndex: 'shipperName', key: 'shipperName' },
        { title: 'Cửa hàng', dataIndex: 'shopName', key: 'shopName' },
        { title: 'Số tiền', dataIndex: 'totalAmount', key: 'totalAmount', render: (val: number) => <b>{val.toLocaleString()} đ</b> },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'PENDING' ? 'orange' : 'green'}>{s}</Tag> },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: any) => (
                <Button type="primary" onClick={() => handleConfirm(record.id)} disabled={record.status !== 'PENDING'}>
                    Xác nhận đã nhận tiền
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Quản lý Đối soát (Admin)</Title>
            <Card>
                <Table dataSource={settlements} columns={columns} loading={loading} rowKey="id" />
            </Card>
        </div>
    );
};

export default AdminSettlement;
