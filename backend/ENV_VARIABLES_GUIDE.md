# 📝 Hướng dẫn Environment Variables cho Render

## 🔍 Cách xem Region của PostgreSQL trên Render

### Bước 1: Vào PostgreSQL Service

1. Đăng nhập vào **Render Dashboard**
2. Tìm và click vào **PostgreSQL database** bạn đã tạo
3. Vào tab **Info** hoặc **Settings**

### Bước 2: Xem Region

- Region sẽ hiển thị ở phần **Info**, ví dụ:
  - `Singapore (Southeast Asia)`
  - `Virginia (US East)`
  - `Oregon (US West)`
  - v.v.

### Bước 3: Chọn cùng Region cho Web Service

- Khi tạo Web Service, chọn **cùng region** với PostgreSQL
- Để services có thể giao tiếp qua **private network** (nhanh hơn và không tốn bandwidth)

---

## 📋 Lấy thông tin Database từ Render

### Cách 1: Lấy từ Internal Database URL (Khuyến nghị)

1. Vào PostgreSQL service → tab **Info**
2. Tìm **Internal Database URL** hoặc **Connection String**
3. Format sẽ là:
   ```
   postgresql://username:password@host:port/database
   ```
4. Parse ra các thành phần:
   - `username` → DB_USERNAME
   - `password` → DB_PASSWORD
   - `host` → DATABASE_HOST
   - `port` → DATABASE_PORT (thường là 5432)
   - `database` → DATABASE_NAME

### Cách 2: Lấy từng thông tin riêng lẻ

Trong tab **Info** của PostgreSQL service, bạn sẽ thấy:

- **Host** → DATABASE_HOST
- **Port** → DATABASE_PORT (thường là 5432)
- **Database** → DATABASE_NAME
- **User** → DB_USERNAME
- **Password** → DB_PASSWORD (có thể cần click "Show" để hiện)

---

## 🔧 Environment Variables cần điền trên Render

### Bắt buộc (Required)

#### 1. Database Connection

**Cách 1: Dùng DATABASE_URL (Đơn giản nhất)**

```
NAME: DATABASE_URL
VALUE: jdbc:postgresql://<host>:<port>/<database>
```

Ví dụ:

```
DATABASE_URL=jdbc:postgresql://dpg-xxxxx-a.singapore-postgres.render.com:5432/cod_db_xxxx
```

**Cách 2: Dùng từng biến riêng (Khuyến nghị - dễ debug)**

```
NAME: DB_USERNAME
VALUE: <username từ PostgreSQL>

NAME: DB_PASSWORD
VALUE: <password từ PostgreSQL>

NAME: DATABASE_URL
VALUE: jdbc:postgresql://<host>:<port>/<database>
```

Ví dụ đầy đủ:

```
DB_USERNAME=cod_user_abc123
DB_PASSWORD=your_password_here
DATABASE_URL=jdbc:postgresql://dpg-xxxxx-a.singapore-postgres.render.com:5432/cod_db_xxxx
```

### Tùy chọn (Optional)

#### 2. JWT Configuration (Có thể giữ mặc định)

```
NAME: JWT_SECRET
VALUE: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

NAME: JWT_EXPIRATION
VALUE: 86400000

NAME: JWT_REFRESH_EXPIRATION
VALUE: 604800000
```

#### 3. Logging (Cho production nên tắt)

```
NAME: SHOW_SQL
VALUE: false

NAME: FORMAT_SQL
VALUE: false
```

---

## 📝 Ví dụ điền đầy đủ trên Render

### Bước 1: Click "+ Add Environment Variable"

### Bước 2: Điền từng biến một:

**Biến 1:**

- **NAME_OF_VARIABLE**: `DB_USERNAME`
- **value**: `cod_user_abc123` (copy từ PostgreSQL Info)

**Biến 2:**

- **NAME_OF_VARIABLE**: `DB_PASSWORD`
- **value**: `your_actual_password` (copy từ PostgreSQL Info)

**Biến 3:**

- **NAME_OF_VARIABLE**: `DATABASE_URL`
- **value**: `jdbc:postgresql://dpg-xxxxx-a.singapore-postgres.render.com:5432/cod_db_xxxx`
  - Thay `<host>`, `<port>`, `<database>` bằng giá trị thực từ PostgreSQL Info

**Biến 4 (Optional):**

- **NAME_OF_VARIABLE**: `SHOW_SQL`
- **value**: `false`

**Biến 5 (Optional):**

- **NAME_OF_VARIABLE**: `FORMAT_SQL`
- **value**: `false`

---

## ⚠️ Lưu ý quan trọng

1. **Internal vs External URL:**

   - Nếu Web Service và PostgreSQL **cùng region** → dùng **Internal Database URL** (nhanh hơn, không tốn bandwidth)
   - Nếu khác region → dùng **External Database URL**

2. **Format DATABASE_URL:**

   - Render cung cấp format: `postgresql://user:pass@host:port/db`
   - Spring Boot cần format: `jdbc:postgresql://host:port/db`
   - **Phải thêm `jdbc:` ở đầu và bỏ `user:pass@`**

3. **Password có ký tự đặc biệt:**

   - Nếu password có `@`, `#`, `%` → có thể cần URL encode
   - Hoặc dùng biến riêng `DB_PASSWORD` thay vì trong URL

4. **Security:**
   - Không commit password vào Git
   - Chỉ set trên Render Environment Variables
   - Có thể dùng nút **Generate** để tạo password mạnh

---

## 🧪 Test kết nối

Sau khi set Environment Variables:

1. Deploy service
2. Xem **Logs** trong Render dashboard
3. Nếu thấy log: `Started BackendApplication` → thành công ✅
4. Nếu thấy lỗi database connection → kiểm tra lại các biến

---

## 📸 Screenshot mẫu (tham khảo)

```
Environment Variables trên Render sẽ trông như này:

┌─────────────────────────────────────────┐
│ NAME_OF_VARIABLE    │ value            │
├─────────────────────────────────────────┤
│ DB_USERNAME         │ cod_user_abc123  │
│ DB_PASSWORD         │ ********         │
│ DATABASE_URL        │ jdbc:postgresql..│
│ SHOW_SQL            │ false            │
└─────────────────────────────────────────┘
```
