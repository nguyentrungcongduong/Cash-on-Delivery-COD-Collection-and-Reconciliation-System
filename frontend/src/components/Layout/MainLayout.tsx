import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography, Space, Badge, Card } from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    DollarOutlined,
    FileTextOutlined,
    SettingOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './MainLayout.css';

dayjs.extend(relativeTime);

const { Header, Sider, Content } = Layout;
const { Text, Link } = Typography;

interface MainLayoutProps {
    children: React.ReactNode;
    role: 'SHOP' | 'SHIPPER' | 'ADMIN';
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, role }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const [list, count] = await Promise.all([
                notificationService.getNotifications(),
                notificationService.getUnreadCount()
            ]);
            setNotifications(list);
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    React.useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.isRead) {
            await notificationService.markAsRead(notif.id);
            fetchNotifications();
        }
    };

    let user: any = {};
    try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
        // Safe fallback
    }

    const handleLogout = async () => {
        try {
            // Clear local storage first so user is effectively logged out even if network fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');

            // Optional: call backend logout (might fail if not implemented/session expired)
            await authService.logout().catch(() => { });
        } finally {
            navigate('/login');
        }
    };

    const handleUserMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            handleLogout();
        } else if (key === 'profile') {
            // Navigate based on role
            if (role === 'SHOP') navigate('/shop/profile');
            else if (role === 'SHIPPER') navigate('/shipper/profile');
            else if (role === 'ADMIN') navigate('/admin/profile');
            else navigate('/profile');
        } else if (key === 'settings') {
            navigate('/settings');
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Thông tin cá nhân',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Cài đặt',
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true, // Thêm màu đỏ cho nút đăng xuất
        },
    ];

    const getMenuItems = () => {
        const basePrefix = role === 'SHOP' ? '/shop' : role === 'SHIPPER' ? '/shipper' : '/admin';

        if (role === 'SHOP') {
            return [
                {
                    key: `${basePrefix}/dashboard`,
                    icon: <DashboardOutlined />,
                    label: 'Dashboard',
                },
                {
                    key: `${basePrefix}/orders`,
                    icon: <ShoppingOutlined />,
                    label: 'Quản lý đơn hàng',
                },
                {
                    key: `${basePrefix}/settlements`,
                    icon: <DollarOutlined />,
                    label: 'Đối soát',
                },
                {
                    key: `${basePrefix}/reports`,
                    icon: <FileTextOutlined />,
                    label: 'Báo cáo',
                },
            ];
        } else if (role === 'SHIPPER') {
            return [
                {
                    key: `${basePrefix}/dashboard`,
                    icon: <DashboardOutlined />,
                    label: 'Dashboard',
                },
                {
                    key: `${basePrefix}/deliveries`,
                    icon: <ShoppingOutlined />,
                    label: 'Đơn hàng giao',
                },
                {
                    key: `${basePrefix}/settlements`,
                    icon: <DollarOutlined />,
                    label: 'Đối soát',
                },
                {
                    key: `${basePrefix}/history`,
                    icon: <FileTextOutlined />,
                    label: 'Lịch sử',
                },
            ];
        } else {
            return [
                {
                    key: `${basePrefix}/dashboard`,
                    icon: <DashboardOutlined />,
                    label: 'Dashboard',
                },
                {
                    key: `${basePrefix}/shops`,
                    icon: <ShoppingOutlined />,
                    label: 'Quản lý Shop',
                },
                {
                    key: `${basePrefix}/shippers`,
                    icon: <UserOutlined />,
                    label: 'Quản lý Shipper',
                },
                {
                    key: `${basePrefix}/orders`,
                    icon: <ShoppingOutlined />,
                    label: 'Quản lý đơn hàng',
                },
                {
                    key: `${basePrefix}/settlements`,
                    icon: <DollarOutlined />,
                    label: 'Đối soát',
                },
                {
                    key: `${basePrefix}/reports`,
                    icon: <FileTextOutlined />,
                    label: 'Báo cáo',
                },
            ];
        }
    };

    const getRoleName = () => {
        if (role === 'SHOP') return 'Shop';
        if (role === 'SHIPPER') return 'Shipper';
        return 'Admin';
    };

    const getRoleColor = () => {
        if (role === 'SHOP') return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        if (role === 'SHIPPER') return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="main-sider"
                width={250}
            >
                <div className="logo-section">
                    <div className="logo-icon-small" style={{ background: getRoleColor() }}>
                        <DollarOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                    {!collapsed && (
                        <div className="logo-text">
                            <Text strong style={{ color: '#fff', fontSize: 18 }}>
                                COD System
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>
                                {getRoleName()}
                            </Text>
                        </div>
                    )}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={getMenuItems()}
                    onClick={({ key }) => navigate(key)}
                    className="main-menu"
                />
            </Sider>

            <Layout>
                <Header className="main-header">
                    <div className="header-left">
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </div>

                    <div className="header-right">
                        <Space size="large">
                            <Dropdown
                                dropdownRender={() => (
                                    <Card
                                        title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>Thông báo</span>
                                            {unreadCount > 0 && (
                                                <Link
                                                    style={{ fontSize: 12, cursor: 'pointer' }}
                                                    onClick={async () => {
                                                        await notificationService.markAllAsRead();
                                                        fetchNotifications();
                                                    }}
                                                >
                                                    Đánh dấu đã đọc tất cả
                                                </Link>
                                            )}
                                        </div>}
                                        styles={{ body: { padding: 0 } }}
                                        style={{ width: 350, boxShadow: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)' }}
                                    >
                                        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => handleNotificationClick(n)}
                                                        style={{
                                                            padding: '12px 16px',
                                                            borderBottom: '1px solid #f0f0f0',
                                                            cursor: 'pointer',
                                                            background: n.isRead ? '#fff' : '#f0f7ff',
                                                            transition: 'background 0.3s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = n.isRead ? '#fafafa' : '#e6f4ff'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = n.isRead ? '#fff' : '#f0f7ff'}
                                                    >
                                                        <div style={{ fontWeight: n.isRead ? 500 : 700, marginBottom: 4 }}>
                                                            {n.title}
                                                        </div>
                                                        <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.65)', marginBottom: 4 }}>
                                                            {n.content}
                                                        </div>
                                                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>
                                                            {dayjs(n.createdAt).fromNow()}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                                                    <Space direction="vertical" size="small">
                                                        <BellOutlined style={{ fontSize: 32, color: '#f0f0f0' }} />
                                                        <Text type="secondary">Không có thông báo nào</Text>
                                                    </Space>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                )}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <Badge count={unreadCount} offset={[-5, 5]}>
                                    <BellOutlined className="header-icon" style={{ cursor: 'pointer' }} />
                                </Badge>
                            </Dropdown>

                            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
                                <Space className="user-info" style={{ cursor: 'pointer' }}>
                                    <Avatar
                                        style={{ background: getRoleColor() }}
                                        icon={<UserOutlined />}
                                    />
                                    {!collapsed && (
                                        <div>
                                            <Text strong style={{ display: 'block', lineHeight: 1.2 }}>
                                                {user.name || 'User'}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                {getRoleName()}
                                            </Text>
                                        </div>
                                    )}
                                </Space>
                            </Dropdown>
                        </Space>
                    </div>
                </Header>

                <Content className="main-content">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
