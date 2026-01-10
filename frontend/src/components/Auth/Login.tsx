import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, App, Tabs, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Login.css';

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();

    const handleLogin = async (values: any) => {
        console.log('Attempting Login with values:', values);
        setLoading(true);
        try {
            const response = await authService.login(values);
            console.log('Login Response:', response);

            if (!response.accessToken) {
                console.error('Login Failed: No accessToken received in response');
                message.error('Lỗi hệ thống: Không nhận được token');
                return;
            }

            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            console.log('Token saved to localStorage. Navigating...');

            message.success('Đăng nhập thành công!');

            // Redirect based on role
            const role = response.user.role;
            console.log('User Role:', role);

            if (role === 'SHOP') {
                navigate('/shop/dashboard');
            } else if (role === 'SHIPPER') {
                navigate('/shipper/dashboard');
            } else if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (values: any) => {
        setLoading(true);
        try {
            await authService.register(values);

            const roleName = values.role === 'SHOP' ? 'Chủ cửa hàng (Shop)' : 'Nhân viên giao hàng (Shipper)';
            message.success(`Đăng ký tài khoản ${roleName} thành công! Đang chuyển trang...`, 2.5);

            setTimeout(() => {
                setActiveTab('login');
            }, 2500);
        } catch (error: any) {
            console.error('Register Error:', error);
            message.error(error.response?.data?.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const loginForm = (
        <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
        >
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    autoComplete="username"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                    autoComplete="current-password"
                />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                        className="login-button"
                    >
                        Đăng nhập
                    </Button>
                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                        Chưa có tài khoản?{' '}
                        <Link onClick={() => setActiveTab('register')}>Đăng ký ngay</Link>
                    </Text>
                </div>
            </Form.Item>
        </Form>
    );

    const registerForm = (
        <Form
            name="register"
            onFinish={handleRegister}
            layout="vertical"
            size="large"
        >
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Họ và tên"
                    autoComplete="name"
                />
            </Form.Item>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    autoComplete="email"
                />
            </Form.Item>

            <Form.Item
                name="phone"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
                ]}
            >
                <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Số điện thoại"
                    autoComplete="tel"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                    autoComplete="new-password"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu"
                    autoComplete="new-password"
                />
            </Form.Item>

            <Form.Item
                name="role"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
                <Select placeholder="Chọn vai trò" size="large">
                    <Select.Option value="SHOP">Shop (Chủ cửa hàng)</Select.Option>
                    <Select.Option value="SHIPPER">Shipper (Người giao hàng)</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                        className="login-button"
                    >
                        Đăng ký
                    </Button>
                    <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                        Đã có tài khoản?{' '}
                        <Link onClick={() => setActiveTab('login')}>Đăng nhập ngay</Link>
                    </Text>
                </div>
            </Form.Item>
        </Form>
    );

    const items = [
        {
            key: 'login',
            label: 'Đăng nhập',
            children: loginForm,
        },
        {
            key: 'register',
            label: 'Đăng ký',
            children: registerForm,
        },
    ];

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-circle circle-1"></div>
                <div className="gradient-circle circle-2"></div>
                <div className="gradient-circle circle-3"></div>
            </div>

            <Card className="login-card glass-effect">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <DollarOutlined style={{ fontSize: 48, color: '#fff' }} />
                        </div>
                    </div>
                    <Title level={2} className="text-gradient" style={{ marginTop: 16, marginBottom: 8 }}>
                        COD Management
                    </Title>
                    <Text type="secondary">Hệ thống quản lý và đối soát thu hộ COD</Text>
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={items} />
            </Card>
        </div>
    );
};

export default Login;
