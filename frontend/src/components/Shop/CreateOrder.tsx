import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    InputNumber,
    Radio,
    Select,
    Divider,
    App,
} from 'antd';
import {
    UserOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ShoppingOutlined,
    CarOutlined,
    RocketOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateOrder: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [shippers, setShippers] = useState<any[]>([]);
    const navigate = useNavigate();
    const { message } = App.useApp();

    useEffect(() => {
        const fetchShippers = async () => {
            try {
                const data = await orderService.getShippers();
                setShippers(data);
            } catch (error) {
                console.error("Failed to fetch shippers", error);
            }
        };
        fetchShippers();
    }, []);

    // Theo dõi giá trị realtime để tính toán summary
    const codAmount = Form.useWatch('codAmount', form) || 0;
    const shippingFee = Form.useWatch('shippingFee', form) || 0;

    // Tính toán tài chính chuẩn MVP
    const shopNetReceive = codAmount - shippingFee;

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            await orderService.createOrder(values);
            message.success('Tạo đơn hàng thành công!');
            navigate('/shop/orders');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Tạo Đơn Hàng Mới</Title>
                <Text type="secondary">Hỗ trợ giao nhanh & đối soát COD minh bạch</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    allowInspection: 'YES',
                    shippingFee: 30000, // Phí ship mặc định cho MVP
                }}
            >
                <Row gutter={32}>
                    <Col xs={24} lg={16}>
                        {/* SECTION 1: THÔNG TIN NGƯỜI NHẬN */}
                        <Card
                            title={<Space><UserOutlined style={{ color: '#2563eb' }} /><span>THÔNG TIN NGƯỜI NHẬN</span></Space>}
                            className="order-section-card"
                            style={{ marginBottom: '24px' }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="receiverPhone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập SĐT khách' }]}
                                    >
                                        <Input prefix={<PhoneOutlined />} placeholder="Ví dụ: 0987xxx..." size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="receiverName"
                                        label="Tên khách hàng"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên khách' }]}
                                    >
                                        <Input prefix={<UserOutlined />} placeholder="Tên người nhận hàng" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="pickupAddress"
                                        label="Địa chỉ lấy hàng (Shop)"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ lấy hàng' }]}
                                        tooltip="Nơi shipper sẽ đến để nhận hàng"
                                    >
                                        <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, tên đường, Phường/Xã... (Nơi shipper đến lấy hàng)" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="receiverAddress"
                                        label="Địa chỉ giao hàng (Người nhận)"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ người nhận' }]}
                                    >
                                        <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, tên đường, Phường/Xã... (Nơi giao hàng cho khách)" size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* SECTION 2: THÔNG TIN HÀNG HÓA & COD */}
                        <Card
                            title={<Space><ShoppingOutlined style={{ color: '#2563eb' }} /><span>CHI TIẾT ĐƠN HÀNG</span></Space>}
                            className="order-section-card"
                            style={{ marginBottom: '24px' }}
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="productName"
                                        label="Tên sản phẩm"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                                    >
                                        <Input placeholder="Ví dụ: Giày thể thao Nike ABC..." size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="codAmount"
                                        label="Tiền thu hộ (COD)"
                                        rules={[{ required: true, message: 'Nhập số tiền cần thu' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            size="large"
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value!.replace(/\D/g, '')}
                                            addonAfter="đ"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="shippingFee"
                                        label="Phí vận chuyển"
                                        rules={[{ required: true, message: 'Vui lòng nhập phí ship' }]}
                                        tooltip="Phí bạn thỏa thuận với Shipper hoặc mặc định"
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            size="large"
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value!.replace(/\D/g, '')}
                                            addonAfter="đ"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="shipperNote" label="Ghi chú cho Shipper">
                                        <TextArea rows={2} placeholder="Ví dụ: Giao sau giờ hành chính, gọi trước khi đến..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* SECTION 3: VẬN CHUYỂN (MVP) */}
                        <Card
                            title={<Space><CarOutlined style={{ color: '#2563eb' }} /><span>VẬN CHUYỂN & DỊCH VỤ</span></Space>}
                            className="order-section-card"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="shipperId"
                                        label="Gán Shipper (Bắt buộc)"
                                        rules={[{ required: true, message: 'Chọn shipper để đẩy đơn' }]}
                                    >
                                        <Select size="large" placeholder="Chọn shipper đảm nhận">
                                            {shippers.map(s => (
                                                <Select.Option key={s.id} value={s.id}>
                                                    {s.name} ({s.phone})
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="allowInspection"
                                        label="Cho xem hàng?"
                                    >
                                        <Radio.Group buttonStyle="solid" size="large">
                                            <Radio.Button value="YES">Cho xem</Radio.Button>
                                            <Radio.Button value="NO">Không</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* SUMMARY PANEL */}
                    <Col xs={24} lg={8}>
                        <Card
                            className="summary-card"
                            style={{
                                background: '#1a2332',
                                borderRadius: '16px',
                                position: 'sticky',
                                top: '24px',
                                color: '#fff'
                            }}
                        >
                            <Title level={4} style={{ color: '#fff', marginBottom: '24px' }}>Tóm tắt tài chính</Title>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Tiền COD (Thu khách):</Text>
                                <Text style={{ color: '#fff', fontWeight: 600 }}>{codAmount.toLocaleString()} đ</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Phí vận chuyển:</Text>
                                <Text style={{ color: '#ff4d4f' }}>- {shippingFee.toLocaleString()} đ</Text>
                            </div>

                            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space orientation="vertical" size={0}>
                                        <Text style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>SHIPPER THU KHÁCH:</Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>(Đây là số tiền COD)</Text>
                                    </Space>
                                    <Text style={{ color: '#52c41a', fontSize: '24px', fontWeight: 800 }}>{codAmount.toLocaleString()} đ</Text>
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px dashed rgba(255,255,255,0.2)',
                                marginBottom: '24px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)' }}>Shop thực nhận:</Text>
                                    <Text style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>{shopNetReceive.toLocaleString()} đ</Text>
                                </div>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                icon={<RocketOutlined />}
                                loading={loading}
                                onClick={() => form.submit()}
                                style={{
                                    height: '54px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                                    border: 'none',
                                    fontWeight: '700',
                                    fontSize: '16px'
                                }}
                            >
                                ĐẨY ĐƠN NGAY
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Form>

            <style>{`
                .order-section-card {
                    border-radius: 12px;
                    border: 1.5px solid #e2e8f0;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
                }
                .order-section-card .ant-card-head {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    font-weight: 800;
                }
                .ant-form-item-label > label {
                    font-weight: 700 !important;
                    color: #1a2332 !important;
                }
                .ant-input, .ant-input-number, .ant-select-selector {
                    border-color: #cbd5e1 !important;
                    border-radius: 8px !important;
                    border-width: 1.5px !important;
                    color: #000 !important;
                    font-weight: 600 !important;
                }
                .ant-input:focus, .ant-select-selector:focus {
                    border-color: #2563eb !important;
                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default CreateOrder;
