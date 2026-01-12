# 🚀 COD Management System - Hệ thống Quản lý và Đối soát Thu hộ COD

## 📖 Giới thiệu

Hệ thống quản lý và đối soát thu hộ COD (Cash on Delivery) là giải pháp toàn diện giúp các Shop, Shipper và đơn vị vận chuyển quản lý dòng tiền COD một cách hiệu quả, chính xác và minh bạch.

### 🎯 Vấn đề giải quyết

- **Shop**: Khó khăn trong việc đối soát tiền COD với nhiều shipper, mất 2-3 giờ/ngày với Excel
- **Shipper**: Phải quản lý tiền mặt từ hàng chục shop, tính toán phức tạp
- **Đơn vị vận chuyển**: Giám sát hàng trăm shipper, phát hiện gian lận, quản lý nợ

## ✨ Tính năng chính

### 🏪 Dành cho Shop (Chủ cửa hàng)
- ✅ Dashboard tổng quan doanh thu và đơn hàng
- ✅ Tạo và quản lý đơn hàng COD
- ✅ Theo dõi tiền đã thu / chưa thu
- ✅ Đối soát tự động với shipper
- ✅ Xuất báo cáo Excel
- ✅ Cảnh báo đơn quá hạn thanh toán
- ✅ Biểu đồ doanh thu theo thời gian

### 🚚 Dành cho Shipper (Người giao hàng)
- ✅ Danh sách đơn cần giao hôm nay
- ✅ Cập nhật trạng thái đơn hàng realtime
- ✅ Quét mã QR đơn hàng
- ✅ Theo dõi tiền mặt đang cầm
- ✅ Lịch sử đối soát
- ✅ Thống kê hiệu suất giao hàng
- ✅ Tiến độ giao hàng trực quan

### 👨‍💼 Dành cho Admin (Quản trị viên)
- ✅ Giám sát toàn bộ hệ thống
- ✅ Quản lý Shop và Shipper
- ✅ Theo dõi dòng tiền COD
- ✅ Phát hiện gian lận
- ✅ Báo cáo tổng hợp
- ✅ Top performers (Shop/Shipper xuất sắc)
- ✅ Phân tích xu hướng

## 🛠️ Công nghệ sử dụng

### Backend
- **Java 17+** + **Spring Boot 3.x**
- **PostgreSQL** - Database chính (ACID compliance)
- **Redis** - Cache và session management
- **Spring Security** - Authentication & Authorization (JWT)
- **Spring Data JPA** - ORM
- **Spring Scheduler** - Đối soát định kỳ

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Ant Design** - UI Component Library
- **React Router** - Routing
- **Axios** - HTTP Client
- **Recharts** - Charts & Visualization
- **Day.js** - Date handling

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD

## 📁 Cấu trúc dự án

```
Cash-on-Delivery-COD-Collection-and-Reconciliation-System/
├── backend/                    # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/cod/
│   │   │   │       ├── config/         # Configuration
│   │   │   │       ├── controller/     # REST Controllers
│   │   │   │       ├── dto/            # Data Transfer Objects
│   │   │   │       ├── entity/         # JPA Entities
│   │   │   │       ├── repository/     # Data Access Layer
│   │   │   │       ├── service/        # Business Logic
│   │   │   │       └── security/       # Security Config
│   │   │   └── resources/
│   │   │       └── application.yml     # App Configuration
│   │   └── test/                       # Unit & Integration Tests
│   ├── pom.xml                         # Maven Dependencies
│   └── Dockerfile
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── Admin/          # Admin Dashboard
│   │   │   ├── Auth/           # Login/Register
│   │   │   ├── Layout/         # Layout Components
│   │   │   ├── Shop/           # Shop Dashboard
│   │   │   └── Shipper/        # Shipper Dashboard
│   │   ├── services/           # API Services
│   │   ├── types/              # TypeScript Types
│   │   ├── App.tsx             # Main App
│   │   ├── main.tsx            # Entry Point
│   │   └── index.css           # Global Styles
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml          # Docker Compose Config
└── README.md                   # This file
```

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- **Java 17+**
- **Node.js 18+**
- **PostgreSQL 14+**
- **Redis 7+**
- **Docker** (optional)

### Cài đặt Backend

```bash
cd backend

# Cấu hình database trong application.yml
# spring.datasource.url=jdbc:postgresql://localhost:5432/cod_db
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Build và chạy
./mvnw clean install
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### Cài đặt Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Chỉnh sửa .env
# VITE_API_BASE_URL=http://localhost:8080/api/v1

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### Chạy với Docker Compose

```bash
# Build và chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

## 📊 Database Schema

### Core Tables

**users**
- id, email, password, name, phone, role (SHOP/SHIPPER/ADMIN)

**orders**
- id, order_code, shop_id, shipper_id, customer_info, cod_amount, shipping_fee, status, timestamps

**settlements**
- id, settlement_code, shop_id, shipper_id, total_orders, total_cod, total_fee, status, timestamps

**ledger_entries** (Double-entry bookkeeping)
- id, order_id, debit_account, credit_account, amount, timestamp

## 🔐 Authentication & Authorization

### JWT Token Flow
1. User login → Receive access_token + refresh_token
2. Access token (15 minutes expiry)
3. Refresh token (7 days expiry)
4. Role-based access control (RBAC)

### Roles & Permissions

| Role | Permissions |
|------|-------------|
| **SHOP** | Create orders, View own orders, Confirm settlements |
| **SHIPPER** | View assigned orders, Update order status, Request settlement |
| **ADMIN** | Full system access, Manage users, View all data |

## 📈 Quy trình nghiệp vụ

### 1. Tạo đơn hàng (Shop)
```
Shop tạo đơn → Hệ thống ghi nhận → Chờ phân shipper
```

### 2. Giao hàng (Shipper)
```
Shipper nhận đơn → Giao hàng → Thu tiền COD → Cập nhật trạng thái
```

### 3. Đối soát (Auto)
```
Hệ thống tính toán:
- Tổng tiền COD đã thu
- Trừ phí ship
- = Số tiền shipper phải chuyển cho shop
```

### 4. Thanh toán
```
Shipper chuyển tiền → Shop xác nhận → Hoàn tất đối soát
```

## 🎨 UI/UX Design

- **Modern Glassmorphism** - Hiệu ứng kính mờ hiện đại
- **Gradient Backgrounds** - Nền gradient động
- **Smooth Animations** - Chuyển động mượt mà
- **Responsive Design** - Tương thích mọi thiết bị
- **Dark Sidebar** - Giao diện chuyên nghiệp
- **Interactive Charts** - Biểu đồ tương tác

## 📱 Screenshots

*(Sẽ được cập nhật sau khi hoàn thiện)*

## 🧪 Phân tích & Giải pháp cho các Case khó (Advanced Scenarios)

Dưới đây là các kịch bản nâng cao (Edge Cases) thường gặp trong hệ thống COD và giải pháp đề xuất (đang trong lộ trình phát triển):

### 1. Trả hàng một phần (Partial Returns)
- **Tình huống**: Khách đặt 3 món, shipper giao đến nơi nhưng khách chỉ lấy 1 món, trả lại 2 món.
- **Hiện tại (MVP)**: Shipper đánh dấu "Giao thất bại" (Lý do: Khách đổi ý), sau đó tạo đơn mới cho món khách lấy.
- **Giải pháp đề xuất**: Nâng cấp Mobile App cho phép Shipper sửa đơn hàng tại chỗ -> Tự động tính lại COD -> Cập nhật kho hàng real-time.

### 2. Đối soát đồng thời (Concurrent Settlement)
- **Tình huống**: Admin bấm "Xác nhận đối soát" đúng lúc Shop đang cập nhật số tài khoản ngân hàng mới.
- **Rủi ro**: Tiền có thể bị chuyển vào STK cũ hoặc gây lỗi giao dịch.
- **Giải pháp đề xuất**:
  - **Optimistic Locking**: Sử dụng `@Version` trong database để phát hiện thay đổi.
  - **Snapshot**: Khi tạo phiên đối soát, hệ thống lưu cứng (snapshot) thông tin ngân hàng tại thời điểm đó, mọi thay đổi sau đó chỉ áp dụng cho phiên sau.

### 3. Mất mạng khi cập nhật (Network Failure)
- **Tình huống**: Shipper bấm "Đã giao hàng" nhưng mạng 4G bị mất, server chưa nhận được tín hiệu nhưng App đã hiện thành công.
- **Rủi ro**: Lệch trạng thái giữa Shipper (đã giao) và Admin (chưa giao).
- **Giải pháp đề xuất**:
  - **Offline First**: App lưu trạng thái vào local database (SQLite/Realm).
  - **Background Sync**: Khi có mạng, App tự động đẩy queue các request lên server (sử dụng WorkManager/Queue).
  - **Idempotency**: Server đảm bảo xử lý request trùng lặp an toàn.

### 4. Vượt hạn mức nợ (Shipper Max Debt)
- **Tình huống**: Shipper thu giữ quá nhiều tiền mặt (ví dụ: > 10 triệu) nhưng chưa nộp về công ty.
- **Rủi ro**: Shipper có thể bỏ trốn hoặc làm mất tiền.
- **Giải pháp đề xuất**:
  - **Hard Limit**: Hệ thống tự động khóa không cho Shipper nhận đơn mới khi ví tiền mặt > Hạn mức cho phép.
  - **Real-time Alert**: Gửi cảnh báo SMS/Zalo cho Admin vận hành.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Production Build

**Backend:**
```bash
./mvnw clean package
java -jar target/cod-backend-1.0.0.jar
```

**Frontend:**
```bash
npm run build
# Deploy dist/ folder to CDN or static hosting
```

## 📊 Revenue Model

1. **Subscription**:
   - Shop nhỏ (<100 đơn/tháng): 200k/tháng
   - Shop vừa (100-1000 đơn): 500k/tháng
   - Shop lớn (>1000 đơn): 1-2 triệu/tháng

2. **Transaction Fee**: 0.3-0.5% trên mỗi giao dịch COD

3. **Enterprise License**: 20-50 triệu/năm

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **UI/UX Designer**: [Your Name]

## 📞 Contact

- Email: support@codmanagement.com
- Website: https://codmanagement.com
- Phone: +84 xxx xxx xxx

## 🙏 Acknowledgments

- Spring Boot Team
- React Team
- Ant Design Team
- All contributors

---

**Made with ❤️ in Vietnam**


Do backend chưa chạy, tôi đã kích hoạt chế độ **Demo Offline (Mock Login)** để bạn test ngay lập tức! 🚀

Bạn có thể đăng nhập bằng các tài khoản sau (Mật khẩu nhập bất kỳ, ví dụ `123456`):

1.  🏪 **Shop Chủ Hàng** (Xem đơn hàng, doanh thu):
    *   Email: `shop@test.com`
    *   Mật khẩu: `123456`

2.  🚚 **Shipper** (Xem đơn cần giao, ví tiền):
    *   Email: `shipper@test.com`
    *   Mật khẩu: `123456`

3.  🛡️ **Admin** (Quản lý toàn bộ hệ thống):
    *   Email: `admin@test.com`
    *   Mật khẩu: `123456`

👉 **Lưu ý:** Vì đang chạy chế độ Demo không có Backend, mọi dữ liệu bạn thấy trên Dashboard (biểu đồ, số liệu) cũng là dữ liệu mẫu để bạn hình dung giao diện.