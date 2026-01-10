import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Typography, App } from 'antd';
import apiClient from '../../services/api';

const { Title } = Typography;

const ShopSettlement: React.FC = () => {
    const { message } = App.useApp();
    const [settlements, setSettlements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSettlements = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/shop/settlements');
            setSettlements(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Fetch settlements error:', error);
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
            await apiClient.post(`/shop/settlements/${id}/confirm`);
            message.success('Đã xác nhận nhận tiền thành công!');
            fetchSettlements();
        } catch (error) {
            message.error('Xác nhận thất bại!');
        }
    };

    const columns = [
        { title: 'Mã đối soát', dataIndex: 'id', key: 'id' },
        { title: 'Shipper giao', dataIndex: 'shipperName', key: 'shipperName' },
        { title: 'Số tiền nhận', dataIndex: 'totalAmount', key: 'totalAmount', render: (val: number) => <b>{val.toLocaleString()} đ</b> },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => (
                <Tag color={s === 'CONFIRMED' ? 'green' : s === 'PAID' ? 'blue' : 'orange'}>
                    {s === 'CONFIRMED' ? 'ĐÃ NHẬN' : s === 'PAID' ? 'CHỜ SHOP CÁC NHẬN' : 'ĐANG XỬ LÝ'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: any) => (
                <Button type="primary" onClick={() => handleConfirm(record.id)} disabled={record.status !== 'PAID'}>
                    Xác nhận đã nhận tiền
                </Button>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Đối soát tiền COD (Shop)</Title>
            <Card>
                <Table dataSource={settlements} columns={columns} loading={loading} rowKey="id" />
            </Card>
        </div>
    );
};

export default ShopSettlement;
