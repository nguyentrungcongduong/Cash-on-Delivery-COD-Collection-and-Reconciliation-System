import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Login from './components/Auth/Login';
import MainLayout from './components/Layout/MainLayout';
import ShopDashboard from './components/Shop/ShopDashboard';
import CreateOrder from './components/Shop/CreateOrder';
import OrderManagement from './components/Shop/OrderManagement';
import ShopSettlement from './components/Shop/ShopSettlement';
import ShopReport from './components/Shop/ShopReport';
import ShipperDashboard from './components/Shipper/ShipperDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminSettlement from './components/Admin/AdminSettlement';
import AdminShopManagement from './components/Admin/AdminShopManagement';
import AdminShipperManagement from './components/Admin/AdminShipperManagement';
import AdminOrderManagement from './components/Admin/AdminOrderManagement';
import AdminReport from './components/Admin/AdminReport';
import ShipperDeliveries from './components/Shipper/ShipperDeliveries';
import ShipperSettlement from './components/Shipper/ShipperSettlement';
import ShipperHistory from './components/Shipper/ShipperHistory';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  /* Protected Route */
  const userStr = localStorage.getItem('user');
  let user: any = {};

  try {
    user = userStr ? JSON.parse(userStr) : {};
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    localStorage.removeItem('user'); // Clean bad data
  }

  const token = localStorage.getItem('accessToken');

  if (!token || !user?.role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }}
    >
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Shop Routes */}
          <Route
            path="/shop/*"
            element={
              <ProtectedRoute allowedRoles={['SHOP']}>
                <MainLayout role="SHOP">
                  <Routes>
                    <Route path="dashboard" element={<ShopDashboard />} />
                    <Route path="orders/new" element={<CreateOrder />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="settlements" element={<ShopSettlement />} />
                    <Route path="reports" element={<ShopReport />} />
                    <Route path="*" element={<Navigate to="/shop/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Shipper Routes */}
          <Route
            path="/shipper/*"
            element={
              <ProtectedRoute allowedRoles={['SHIPPER']}>
                <MainLayout role="SHIPPER">
                  <Routes>
                    <Route path="dashboard" element={<ShipperDashboard />} />
                    <Route path="deliveries" element={<ShipperDeliveries />} />
                    <Route path="settlements" element={<ShipperSettlement />} />
                    <Route path="history" element={<ShipperHistory />} />
                    <Route path="*" element={<Navigate to="/shipper/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <MainLayout role="ADMIN">
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="shops" element={<AdminShopManagement />} />
                    <Route path="shippers" element={<AdminShipperManagement />} />
                    <Route path="orders" element={<AdminOrderManagement />} />
                    <Route path="settlements" element={<AdminSettlement />} />
                    <Route path="reports" element={<AdminReport />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route
            path="/unauthorized"
            element={
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <h1>403 - Unauthorized</h1>
                <p>Bạn không có quyền truy cập trang này.</p>
                <a href="/login">Quay lại đăng nhập</a>
              </div>
            }
          />

          <Route
            path="*"
            element={
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <h1>404 - Not Found</h1>
                <p>Trang bạn tìm kiếm không tồn tại.</p>
                <a href="/login">Quay lại trang chủ</a>
              </div>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
