# 🗄️ Các lựa chọn Database cho Production

## ⚠️ Vấn đề với PostgreSQL Local

**KHÔNG THỂ** dùng PostgreSQL local khi backend deploy lên Render vì:

- Render server không thể kết nối đến `localhost` của máy bạn
- `localhost` trên Render = chính Render server, không phải máy bạn
- Cần database **publicly accessible** (có thể truy cập từ internet)

---

## ✅ Giải pháp (3 lựa chọn)

### Option 1: PostgreSQL trên Render (Khuyến nghị) ⭐

**Ưu điểm:**

- ✅ Dễ setup, tích hợp tốt với Render
- ✅ Free tier có sẵn (sleep sau 90 ngày không dùng)
- ✅ Cùng network với backend → nhanh, không tốn bandwidth
- ✅ Tự động backup

**Nhược điểm:**

- ⚠️ Free tier sẽ sleep nếu không dùng 90 ngày
- ⚠️ Cần thẻ tín dụng để verify (không charge)

**Cách làm:**

1. Vào Render → **New** → **PostgreSQL**
2. Chọn Free plan hoặc Basic plan
3. Chọn region (khuyến nghị: Singapore)
4. Tạo database
5. Copy connection info để set Environment Variables

---

### Option 2: Supabase (Miễn phí, tốt nhất) 🚀

**Ưu điểm:**

- ✅ **Hoàn toàn miễn phí** (500MB database, 2GB bandwidth)
- ✅ Không cần thẻ tín dụng
- ✅ Không sleep như Render
- ✅ Có dashboard đẹp, dễ quản lý
- ✅ Hỗ trợ PostgreSQL 15

**Nhược điểm:**

- ⚠️ Giới hạn 500MB (đủ cho project nhỏ)

**Cách làm:**

1. Vào https://supabase.com → Sign up (dùng GitHub)
2. **New Project**
3. Điền:
   - **Name**: `cod-system`
   - **Database Password**: tạo password mạnh
   - **Region**: Singapore (gần Việt Nam nhất)
4. Sau khi tạo xong:
   - Vào **Settings** → **Database**
   - Copy **Connection string** (URI format)
   - Hoặc lấy từng thông tin: Host, Port, Database, User, Password

**Environment Variables trên Render:**

```
DB_USERNAME=postgres.xxxxx
DB_PASSWORD=<password bạn đã set>
DATABASE_URL=jdbc:postgresql://db.xxxxx.supabase.co:5432/postgres
```

---

### Option 3: Neon (Serverless PostgreSQL) ⚡

**Ưu điểm:**

- ✅ Miễn phí (3GB storage)
- ✅ Serverless → tự động scale
- ✅ Không sleep
- ✅ Branching database (như Git)

**Nhược điểm:**

- ⚠️ Cần thẻ tín dụng để verify (không charge)

**Cách làm:**

1. Vào https://neon.tech → Sign up
2. **Create Project**
3. Copy connection string

**Environment Variables trên Render:**

```
DATABASE_URL=jdbc:postgresql://<neon-host>/<database>?user=<user>&password=<password>
```

---

## 📊 So sánh nhanh

| Feature          | Render PostgreSQL | Supabase        | Neon        |
| ---------------- | ----------------- | --------------- | ----------- |
| **Miễn phí**     | ✅ (có giới hạn)  | ✅✅ (tốt nhất) | ✅          |
| **Cần thẻ**      | ✅ (verify)       | ❌              | ✅ (verify) |
| **Sleep**        | ⚠️ 90 ngày        | ❌              | ❌          |
| **Storage free** | 1GB               | 500MB           | 3GB         |
| **Dễ setup**     | ⭐⭐⭐⭐⭐        | ⭐⭐⭐⭐        | ⭐⭐⭐      |

---

## 🎯 Khuyến nghị

### Cho project nhỏ/test:

→ **Supabase** (miễn phí, không cần thẻ, không sleep)

### Cho production:

→ **Render PostgreSQL** (tích hợp tốt, cùng network)

---

## 🔧 Cấu hình Environment Variables

Sau khi chọn database, set các biến này trên Render:

### Nếu dùng Supabase/Neon:

```
DB_USERNAME=<username>
DB_PASSWORD=<password>
DATABASE_URL=jdbc:postgresql://<host>:<port>/<database>
```

### Nếu dùng Render PostgreSQL:

```
DB_USERNAME=<username>
DB_PASSWORD=<password>
DATABASE_URL=jdbc:postgresql://<internal-host>:<port>/<database>
```

(Lưu ý: Dùng **Internal Database URL** nếu backend và database cùng region)

---

## 📝 Migration từ Local sang Cloud

Nếu bạn đã có data ở local PostgreSQL:

1. **Export data từ local:**

   ```bash
   pg_dump -U postgres -d cod_db > backup.sql
   ```

2. **Import vào cloud database:**

   - Supabase: Vào SQL Editor → paste và chạy
   - Render/Neon: Dùng `psql` hoặc pgAdmin

3. **Hoặc để Spring Boot tự tạo:**
   - Set `spring.jpa.hibernate.ddl-auto=update`
   - Spring Boot sẽ tự tạo tables khi start

---

## ✅ Checklist

- [ ] Đã chọn database provider (Supabase/Render/Neon)
- [ ] Đã tạo database
- [ ] Đã copy connection info
- [ ] Đã set Environment Variables trên Render
- [ ] Đã test kết nối (xem logs trên Render)
