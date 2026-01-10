import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Space,
    Typography,
    DatePicker,
    App,
    Skeleton,
    Table,
    Tag,
    Button,
} from 'antd';
import {
    DollarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ShoppingOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
} from '@ant-design/icons';
import { orderService } from '../../services/orderService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ShopReport: React.FC = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(30, 'day'),
        dayjs()
    ]);

    useEffect(() => {
        fetchReport();
        fetchOrders();
    }, [dates]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
            const data = await orderService.getShopCodReport(startDate, endDate);
            setStats(data);
        } catch (error) {
            message.error('Không thể tải báo cáo tài chính!');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const data = await orderService.getShopOrders();
            const filteredByDate = data.filter(o => {
                if (!o.deliveredAt) return false;
                const deliveryDate = dayjs(o.deliveredAt);
                return !deliveryDate.isBefore(dates[0], 'day') && !deliveryDate.isAfter(dates[1], 'day');
            });
            setOrders(filteredByDate);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await orderService.exportExcel(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shop-cod-report-${dayjs().format('YYYYMMDD')}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error('Lỗi khi xuất file Excel');
        }
    };

    const handleExportPdf = async () => {
        try {
            const blob = await orderService.exportPdf(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shop-cod-report-${dayjs().format('YYYYMMDD')}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error('Lỗi khi xuất file PDF');
        }
    };

    const formatCurrency = (val: number) => {
        return (val || 0).toLocaleString() + ' đ';
    };

    const columns = [
        {
            title: 'Ngày giao',
            dataIndex: 'deliveredAt',
            key: 'deliveredAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            key: 'orderCode',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Tiền COD',
            dataIndex: 'codAmount',
            key: 'codAmount',
            render: (val: number) => formatCurrency(val),
        },
        {
            title: 'Trạng thái tiền',
            key: 'paymentStatus',
            render: (record: any) => {
                if (record.status === 'DELIVERED_SUCCESS') {
                    return <Tag color="success">ĐÃ THU COD</Tag>;
                }
                return <Tag>CHƯA THU</Tag>;
            }
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>💰 Báo cáo Doanh thu COD</Title>
                    <Text type="secondary">Theo dõi tiền thu hộ và trạng thái đối soát của cửa hàng</Text>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Space>
                        <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>Xuất Excel</Button>
                        <Button icon={<FilePdfOutlined />} onClick={handleExportPdf} danger>Xuất PDF</Button>
                    </Space>
                    <Card size="small" style={{ borderRadius: '8px' }}>
                        <Space>
                            <Text strong>Khoảng thời gian:</Text>
                            <RangePicker
                                value={dates}
                                onChange={(vals: any) => vals && setDates(vals)}
                                allowClear={false}
                            />
                        </Space>
                    </Card>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderTop: '4px solid #1890ff' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="Tổng COD tích lũy"
                                value={stats?.totalCod}
                                prefix={<DollarOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderTop: '4px solid #52c41a' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="COD đã nhận"
                                value={stats?.received}
                                prefix={<CheckCircleOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                                styles={{ content: { color: '#3f8600' } }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderTop: '4px solid #faad14' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="COD đang chờ"
                                value={stats?.pending}
                                prefix={<ClockCircleOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                                styles={{ content: { color: stats?.pending > 0 ? '#cf1322' : 'inherit' } }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderTop: '4px solid #ff4d4f' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="Phí ship phải trả"
                                value={stats?.pendingPayable}
                                prefix={<DollarOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                                styles={{ content: { color: stats?.pendingPayable > 0 ? '#cf1322' : 'inherit' } }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderTop: '4px solid #722ed1' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="Đơn giao thành công"
                                value={stats?.successfulOrders}
                                prefix={<ShoppingOutlined />}
                                suffix="đơn"
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Card
                style={{ marginTop: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                title="Chi tiết đơn hàng trong kỳ"
            >
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Không có dữ liệu trong khoảng thời gian này' }}
                />
            </Card>
        </div>
    );
};

export default ShopReport;
