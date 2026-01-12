# Hướng dẫn Deploy Backend lên Render

## 📋 Yêu cầu

- Tài khoản Render.com
- Repository GitHub/GitLab đã push code
- PostgreSQL database đã tạo trên Render

## 🚀 Các bước deploy

### 1. Chọn Docker trong form Render

Khi tạo Web Service trên Render:
- **Language**: Chọn **Docker** (không phải Java vì Render không có)
- **Root Directory**: `backend`
- **Branch**: `main` hoặc `master` (tùy repo của bạn)

### 2. Build Command (tự động)

Render sẽ tự động build Docker image, không cần build command riêng.

### 3. Start Command (tự động)

Render sẽ tự động chạy `docker run`, không cần start command riêng.

### 4. Cấu hình Environment Variables

Vào **Environment** tab và thêm các biến sau:

#### Database Configuration
```
DATABASE_URL=postgresql://user:password@host:port/dbname
```
**Hoặc** set từng biến riêng (khuyến nghị):
```
DB_USERNAME=<username từ PostgreSQL database>
DB_PASSWORD=<password từ PostgreSQL database>
DATABASE_URL=jdbc:postgresql://<host>:<port>/<database>
```

**Lấy thông tin từ PostgreSQL database trên Render:**
- Vào PostgreSQL service → tab **Info**
- Copy **Internal Database URL** hoặc **External Database URL**
- Format: `postgresql://user:password@host:port/dbname`

#### JWT Configuration (Optional - có thể giữ mặc định)
```
JWT_SECRET=<your-secret-key>
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
```

#### Other (Optional)
```
SHOW_SQL=false
FORMAT_SQL=false
```

### 5. Deploy

- Bấm **Create Web Service**
- Render sẽ tự động:
  1. Pull code từ Git
  2. Build Docker image
  3. Deploy và start service

### 6. Lấy URL

Sau khi deploy thành công:
- URL sẽ có dạng: `https://your-service-name.onrender.com`
- API endpoint: `https://your-service-name.onrender.com/api/v1`

## 🔧 Troubleshooting

### Lỗi build Docker
- Kiểm tra Dockerfile có đúng không
- Xem logs trong Render dashboard

### Lỗi kết nối database
- Kiểm tra DATABASE_URL đúng chưa
- Đảm bảo PostgreSQL service đã chạy
- Kiểm tra region của database và service có cùng nhau không

### Lỗi port
- Render tự động set PORT env variable
- Application đã được config để đọc `${PORT:8080}`

## 📝 Notes

- Free tier trên Render sẽ sleep sau 15 phút không dùng
- Database free tier sẽ sleep sau 90 ngày không dùng
- Để production, nên upgrade lên paid plan

