# COD Management System - Frontend

Hệ thống quản lý và đối soát thu hộ COD (Cash on Delivery) - Giao diện người dùng

## 🚀 Công nghệ sử dụng

- **React 18** + **TypeScript** - Framework và ngôn ngữ
- **Vite** - Build tool siêu nhanh
- **Ant Design** - UI Component Library
- **React Router** - Routing
- **Axios** - HTTP Client
- **Recharts** - Biểu đồ và thống kê
- **Day.js** - Xử lý thời gian

## 📋 Tính năng

### Dashboard cho 3 vai trò:

#### 1. **Shop (Chủ cửa hàng)**
- ✅ Xem tổng quan doanh thu và đơn hàng
- ✅ Quản lý đơn hàng COD
- ✅ Theo dõi tiền đã thu và chưa thu
- ✅ Đối soát với shipper
- ✅ Xuất báo cáo Excel
- ✅ Cảnh báo đơn quá hạn thanh toán

#### 2. **Shipper (Người giao hàng)**
- ✅ Xem danh sách đơn cần giao hôm nay
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Quét mã QR đơn hàng
- ✅ Theo dõi tiền mặt đang cầm
- ✅ Xem lịch sử đối soát
- ✅ Thống kê hiệu suất giao hàng

#### 3. **Admin (Quản trị viên)**
- ✅ Giám sát toàn bộ hệ thống
- ✅ Quản lý Shop và Shipper
- ✅ Theo dõi dòng tiền COD
- ✅ Phát hiện gian lận
- ✅ Báo cáo tổng hợp
- ✅ Top performers

## 🎨 Thiết kế

- **Modern UI/UX** với Ant Design
- **Gradient backgrounds** và glassmorphism effects
- **Responsive design** - Tương thích mọi thiết bị
- **Smooth animations** - Chuyển động mượt mà
- **Dark sidebar** - Giao diện chuyên nghiệp
- **Interactive charts** - Biểu đồ tương tác

## 📦 Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd frontend

# Cài đặt dependencies
npm install

# Copy file .env
cp .env.example .env

# Chỉnh sửa .env với API URL của bạn
# VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## 🔧 Cấu hình

Tạo file `.env` với nội dung:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## 🚀 Chạy ứng dụng

### Development mode
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Admin/          # Admin dashboard
│   │   ├── Auth/           # Login/Register
│   │   ├── Layout/         # Layout components
│   │   ├── Shop/           # Shop dashboard
│   │   └── Shipper/        # Shipper dashboard
│   ├── services/           # API services
│   │   ├── api.ts          # Axios instance
│   │   ├── authService.ts  # Authentication
│   │   ├── orderService.ts # Order management
│   │   └── settlementService.ts # Settlement
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static files
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite config
```

## 🔐 Authentication

Hệ thống sử dụng JWT (JSON Web Token) cho authentication:

1. **Login** - Nhận access token và refresh token
2. **Protected Routes** - Kiểm tra token và role
3. **Auto Redirect** - Chuyển hướng dựa trên role
4. **Token Refresh** - Tự động làm mới token

### Roles:
- `SHOP` - Chủ cửa hàng
- `SHIPPER` - Người giao hàng
- `ADMIN` - Quản trị viên

## 🎯 API Integration

Tất cả API calls được quản lý trong thư mục `services/`:

- `authService.ts` - Login, Register, Logout
- `orderService.ts` - CRUD đơn hàng, cập nhật trạng thái
- `settlementService.ts` - Đối soát, xác nhận thanh toán

## 🎨 Customization

### Thay đổi màu sắc chính:
Chỉnh sửa trong `App.tsx`:

```typescript
theme={{
  token: {
    colorPrimary: '#1890ff', // Màu chính
    borderRadius: 8,         // Bo góc
  },
}}
```

### Thay đổi gradient:
Chỉnh sửa CSS variables trong `index.css`:

```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  /* ... */
}
```

## 📊 Charts & Statistics

Sử dụng **Recharts** cho visualization:
- Line Chart - Doanh thu theo thời gian
- Bar Chart - Số đơn hàng
- Pie Chart - Phân bố trạng thái
- Progress - Tiến độ giao hàng

## 🔒 Security

- ✅ Protected routes với role-based access
- ✅ JWT token trong localStorage
- ✅ Auto logout khi token hết hạn
- ✅ HTTPS trong production
- ✅ Input validation

## 📱 Responsive Design

- **Desktop** - Full layout với sidebar
- **Tablet** - Collapsible sidebar
- **Mobile** - Hamburger menu, optimized UI

## 🚧 Roadmap

- [ ] Real-time notifications với WebSocket
- [ ] QR Code scanner cho shipper
- [ ] Export PDF reports
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Ant Design team
- React team
- Vite team
