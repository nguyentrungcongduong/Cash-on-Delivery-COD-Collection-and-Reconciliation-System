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
    Button,
} from 'antd';
import {
    DollarOutlined,
    WalletOutlined,
    CheckCircleOutlined,
    HistoryOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
} from '@ant-design/icons';
import { adminService } from '../../services/adminService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const AdminCODReport: React.FC = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(30, 'day'),
        dayjs()
    ]);

    useEffect(() => {
        fetchReport();
    }, [dates]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
            const data = await adminService.getCodReport(startDate, endDate);
            setStats(data);
        } catch (error) {
            message.error('Không thể tải báo cáo!');
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await adminService.exportExcel(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `admin-cod-report-${dayjs().format('YYYYMMDD')}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error('Lỗi khi xuất file Excel');
        }
    };

    const handleExportPdf = async () => {
        try {
            const blob = await adminService.exportPdf(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `admin-cod-report-${dayjs().format('YYYYMMDD')}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error('Lỗi khi xuất file PDF');
        }
    };

    const formatCurrency = (val: number) => {
        return (val || 0).toLocaleString() + ' đ';
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>📊 Báo cáo Tài chính ứng COD</Title>
                    <Text type="secondary">Thống kê dòng tiền đối soát dựa trên dữ liệu Sổ cái (Ledger)</Text>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Space>
                        <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>Xuất Excel</Button>
                        <Button icon={<FilePdfOutlined />} onClick={handleExportPdf} danger>Xuất PDF</Button>
                    </Space>
                    <Card size="small" style={{ borderRadius: '8px', margin: 0 }}>
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
                    <Card style={{ borderRadius: '12px', borderLeft: '4px solid #1890ff' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="Tổng COD phát sinh"
                                value={stats?.totalCodCollected}
                                prefix={<DollarOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderLeft: '4px solid #52c41a' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="COD đã thu thành công"
                                value={stats?.totalCodCollected}
                                prefix={<CheckCircleOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                                styles={{ content: { color: '#3f8600' } }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderLeft: '4px solid #faad14' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="COD Shipper đang giữ"
                                value={stats?.codShipperHolding}
                                prefix={<WalletOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                                styles={{ content: { color: stats?.codShipperHolding > 0 ? '#cf1322' : 'inherit' } }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderLeft: '4px solid #ff4d4f' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="Công nợ Shop → Shipper"
                                value={stats?.shopDebtToShipper}
                                prefix={<WalletOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                                styles={{ content: { color: stats?.shopDebtToShipper > 0 ? '#cf1322' : 'inherit' } }}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card style={{ borderRadius: '12px', borderLeft: '4px solid #722ed1' }}>
                        {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : (
                            <Statistic
                                title="COD đã đối soát"
                                value={stats?.settledAmount}
                                prefix={<HistoryOutlined />}
                                formatter={(val) => formatCurrency(Number(val))}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: '24px', borderRadius: '12px' }} title="Thông tin bổ sung">
                <Row gutter={48}>
                    <Col span={8}>
                        <Statistic title="Số lượng bản ghi Sổ cái" value={stats?.ledgerCount} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Tổng phí vận chuyển" value={stats?.totalFees} formatter={(val) => formatCurrency(Number(val))} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Tiền thực thu hệ thống" value={stats?.totalFees} formatter={(val) => formatCurrency(Number(val))} styles={{ content: { color: '#52c41a' } }} />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AdminCODReport;
