# ✅ Hướng dẫn Setup Supabase - Final

## 📋 Connection String bạn đã có

```
postgresql://postgres:[YOUR-PASSWORD]@db.fpqpinwqvawhdvihjcth.supabase.co:5432/postgres
```

## 🔍 Parse Connection String

Từ connection string trên, các thành phần là:

- **Protocol**: `postgresql://`
- **User**: `postgres`
- **Password**: `[YOUR-PASSWORD]` → thay bằng password bạn đã set
- **Host**: `db.fpqpinwqvawhdvihjcth.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`

---

## ⚠️ Lưu ý về IPv4 Warning

Bạn thấy warning **"Not IPv4 compatible"**:

- Render có thể không hỗ trợ IPv6
- **Giải pháp**: Dùng **Session Pooler** thay vì Direct connection

### Cách chuyển sang Pooler:

1. Trong modal "Connect to your project"
2. Tìm dropdown **"Method"**
3. Chọn **"Session Pooler"** thay vì "Direct connection"
4. Connection string sẽ đổi thành:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
5. Port sẽ đổi từ `5432` → `6543`

**Khuyến nghị**: Dùng **Session Pooler** cho Render!

---

## 🔧 Environment Variables cho Render

### Option 1: Dùng Direct Connection (nếu Render hỗ trợ IPv6)

**Biến 1:**

```
NAME: DB_USERNAME
VALUE: postgres
```

**Biến 2:**

```
NAME: DB_PASSWORD
VALUE: <password bạn đã set khi tạo project>
```

**Biến 3:**

```
NAME: DATABASE_URL
VALUE: jdbc:postgresql://db.fpqpinwqvawhdvihjcth.supabase.co:5432/postgres
```

### Option 2: Dùng Session Pooler (Khuyến nghị) ⭐

**Biến 1:**

```
NAME: DB_USERNAME
VALUE: postgres
```

**Biến 2:**

```
NAME: DB_PASSWORD
VALUE: <password bạn đã set khi tạo project>
```

**Biến 3:**

```
NAME: DATABASE_URL
VALUE: jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Lưu ý**:

- Thay `[YOUR-PASSWORD]` bằng password thực của bạn
- Format JDBC: thêm `jdbc:` ở đầu và bỏ `postgres:[YOUR-PASSWORD]@` (dùng biến riêng)

---

## 📝 Các bước điền trên Render

1. Vào Web Service trên Render → tab **Environment**

2. Click **"+ Add Environment Variable"**

3. Điền **Biến 1**:

   - **NAME**: `DB_USERNAME`
   - **VALUE**: `postgres`

4. Click **"+ Add Environment Variable"** lần nữa

5. Điền **Biến 2**:

   - **NAME**: `DB_PASSWORD`
   - **VALUE**: `<password bạn đã set>` (copy từ Supabase hoặc nhớ lại)

6. Click **"+ Add Environment Variable"** lần nữa

7. Điền **Biến 3**:

   - **NAME**: `DATABASE_URL`
   - **VALUE**:
     - Nếu dùng Direct: `jdbc:postgresql://db.fpqpinwqvawhdvihjcth.supabase.co:5432/postgres`
     - Nếu dùng Pooler: `jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

8. **Optional** - Thêm biến cho production:

   ```
   NAME: SHOW_SQL
   VALUE: false

   NAME: FORMAT_SQL
   VALUE: false
   ```

9. **Save** và **Deploy** lại service

---

## ✅ Test kết nối

1. Deploy service trên Render
2. Vào tab **Logs**
3. Tìm dòng: `Started BackendApplication` → ✅ Thành công!
4. Nếu thấy lỗi connection:
   - Kiểm tra password đúng chưa
   - Thử chuyển sang Session Pooler nếu đang dùng Direct
   - Kiểm tra format DATABASE_URL có `jdbc:` ở đầu chưa

---

## 🎯 Tóm tắt nhanh

**Connection String từ Supabase:**

```
postgresql://postgres:[YOUR-PASSWORD]@db.fpqpinwqvawhdvihjcth.supabase.co:5432/postgres
```

**Environment Variables trên Render:**

```
DB_USERNAME=postgres
DB_PASSWORD=<your-password>
DATABASE_URL=jdbc:postgresql://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Lưu ý**:

- Thay `[YOUR-PASSWORD]` bằng password thực
- Khuyến nghị dùng **Session Pooler** (port 6543) thay vì Direct (port 5432)
