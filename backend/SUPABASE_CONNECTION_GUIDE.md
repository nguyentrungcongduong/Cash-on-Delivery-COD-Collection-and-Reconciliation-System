# 🔍 Hướng dẫn tìm Connection String trên Supabase

## 📍 Vị trí Connection String

Connection string có thể ở một trong các vị trí sau:

### Cách 1: Trong trang Database Settings (Scroll xuống)

1. Bạn đang ở **Settings** → **Database** ✅
2. **Scroll xuống dưới** phần "Connection pooling configuration"
3. Tìm phần **"Connection string"** hoặc **"Connection info"**
4. Sẽ có các tab: **URI**, **JDBC**, **Golang**, v.v.
5. Click tab **JDBC** hoặc **URI**

### Cách 2: Tìm ở phần Connection Info

Trong trang Database Settings, tìm:

- **"Connection info"** section
- **"Connection parameters"** section
- **"Database URL"** section

### Cách 3: Tìm ở tab "Connection string" riêng

Có thể có tab riêng ở trên cùng trang, tìm:

- Tab **"Connection string"**
- Tab **"Connection info"**
- Tab **"Connect"**

---

## 🔧 Nếu không thấy Connection String

### Option A: Lấy từng thông tin riêng

Bạn có thể tự tạo connection string từ các thông tin sau:

1. **Host**: Tìm trong phần **"Connection info"** hoặc **"Network"**

   - Format thường là: `db.xxxxx.supabase.co` hoặc `aws-0-ap-southeast-1.pooler.supabase.com`

2. **Port**:

   - Pooler: `6543`
   - Direct: `5432`

3. **Database**: `postgres` (mặc định)

4. **User**:

   - Format: `postgres.xxxxx` (có prefix `postgres.`)
   - Có thể tìm trong **"Roles"** hoặc **"Connection info"**

5. **Password**:
   - Password bạn đã set khi tạo project
   - Hoặc click **"Reset database password"** để tạo mới

### Option B: Dùng Connection Pooling URL

Supabase thường cung cấp connection string dạng:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 📝 Cách tạo DATABASE_URL cho Render

Từ thông tin trên, tạo connection string cho Spring Boot:

**Format:**

```
jdbc:postgresql://<host>:<port>/<database>
```

**Ví dụ:**

```
jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

Hoặc dùng direct connection:

```
jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
```

---

## 🎯 Quick Fix: Dùng Project URL để suy ra Host

Nếu bạn có **Project URL** từ trang API Settings:

- Project URL: `https://fpqpinwqvawhdvihjcth.supabase.co`
- Database Host có thể là: `db.fpqpinwqvawhdvihjcth.supabase.co`

Thử các format sau:

1. `db.fpqpinwqvawhdvihjcth.supabase.co` (port 5432)
2. `aws-0-ap-southeast-1.pooler.supabase.com` (port 6543)

---

## ✅ Checklist để tìm Connection Info

- [ ] Đã scroll xuống hết trang Database Settings
- [ ] Đã tìm tab "Connection string" hoặc "Connection info"
- [ ] Đã check phần "Connection pooling"
- [ ] Đã check phần "Network" hoặc "Access"
- [ ] Đã thử click vào nút "Connect" ở top bar

---

## 🆘 Nếu vẫn không tìm thấy

1. **Thử cách khác**: Vào **SQL Editor** → chạy query:

   ```sql
   SELECT current_database(), current_user, inet_server_addr(), inet_server_port();
   ```

2. **Hoặc dùng Supabase CLI**:

   ```bash
   supabase status
   ```

3. **Hoặc check email**: Supabase có thể đã gửi connection info qua email khi tạo project

---

## 💡 Tip

Nếu bạn thấy **"Reset database password"** button:

- Click vào đó để reset password
- Sau khi reset, Supabase có thể hiển thị connection string với password mới
