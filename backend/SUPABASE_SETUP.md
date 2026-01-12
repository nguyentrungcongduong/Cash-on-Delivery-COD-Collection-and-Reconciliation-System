# 🚀 Hướng dẫn Setup Supabase (Miễn phí)

## Tại sao chọn Supabase?

- ✅ **Hoàn toàn miễn phí** - không cần thẻ tín dụng
- ✅ **Không sleep** - database luôn sẵn sàng
- ✅ **500MB storage** - đủ cho project nhỏ
- ✅ **PostgreSQL 15** - đầy đủ tính năng
- ✅ **Dashboard đẹp** - dễ quản lý

---

## 📋 Các bước setup

### Bước 1: Tạo tài khoản Supabase

1. Vào https://supabase.com
2. Click **Start your project**
3. Sign up với **GitHub** (khuyến nghị) hoặc Email

### Bước 2: Tạo Project mới

1. Click **New Project**
2. Điền thông tin:
   - **Name**: `cod-system` (hoặc tên bạn muốn)
   - **Database Password**: Tạo password mạnh (lưu lại!)
   - **Region**: Chọn **Southeast Asia (Singapore)** - gần Việt Nam nhất
   - **Pricing Plan**: Chọn **Free**
3. Click **Create new project**
4. Đợi 2-3 phút để Supabase setup database

### Bước 3: Lấy Connection Info

1. Vào **Settings** (icon bánh răng ở sidebar trái)
2. Click **Database**
3. Scroll xuống phần **Connection string**
4. Chọn tab **URI** hoặc **JDBC**

**Bạn sẽ thấy:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Hoặc lấy từng thông tin:**
- **Host**: `aws-0-ap-southeast-1.pooler.supabase.com`
- **Port**: `6543` (pooler) hoặc `5432` (direct)
- **Database**: `postgres`
- **User**: `postgres.xxxxx` (có prefix)
- **Password**: `<password bạn đã set khi tạo project>`

---

## 🔧 Cấu hình trên Render

### Bước 1: Vào Web Service trên Render

1. Vào Web Service bạn đã tạo
2. Click tab **Environment**

### Bước 2: Thêm Environment Variables

Click **"+ Add Environment Variable"** và thêm:

**Biến 1:**
- **NAME**: `DB_USERNAME`
- **VALUE**: `postgres.xxxxx` (copy từ Supabase)

**Biến 2:**
- **NAME**: `DB_PASSWORD`
- **VALUE**: `<password bạn đã set>`

**Biến 3:**
- **NAME**: `DATABASE_URL`
- **VALUE**: `jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`
  - Hoặc dùng port `5432` nếu muốn direct connection

**Ví dụ đầy đủ:**
```
DB_USERNAME=postgres.abcdefghijklmnop
DB_PASSWORD=MySecurePassword123!
DATABASE_URL=jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Bước 3: Optional - Tắt SQL logging (cho production)

```
SHOW_SQL=false
FORMAT_SQL=false
```

---

## ✅ Test kết nối

1. **Deploy lại service** trên Render (hoặc đợi auto-deploy)
2. Vào tab **Logs** trên Render
3. Tìm dòng: `Started BackendApplication` → ✅ Thành công!
4. Nếu thấy lỗi connection → kiểm tra lại Environment Variables

---

## 🔍 Troubleshooting

### Lỗi: "Connection refused"
- Kiểm tra Host và Port đúng chưa
- Thử dùng port `5432` thay vì `6543`

### Lỗi: "Authentication failed"
- Kiểm tra DB_USERNAME có prefix `postgres.` chưa
- Kiểm tra DB_PASSWORD đúng chưa

### Lỗi: "Database does not exist"
- Database name phải là `postgres` (mặc định của Supabase)

---

## 📊 Xem Database trên Supabase

1. Vào Supabase Dashboard
2. Click **Table Editor** ở sidebar trái
3. Bạn sẽ thấy các tables được Spring Boot tự động tạo
4. Có thể query SQL trong **SQL Editor**

---

## 🎯 Next Steps

Sau khi setup xong database:
1. ✅ Backend đã kết nối database thành công
2. ✅ Spring Boot tự động tạo tables (vì `ddl-auto=update`)
3. ✅ Có thể test API endpoints
4. ✅ Tiếp tục deploy Frontend lên Vercel

---

## 💡 Tips

- **Pooler connection** (port 6543): Tốt cho serverless, có connection pooling
- **Direct connection** (port 5432): Tốt cho long-running services
- **Backup**: Supabase tự động backup, có thể restore trong Settings
- **Monitoring**: Xem metrics trong Supabase Dashboard

