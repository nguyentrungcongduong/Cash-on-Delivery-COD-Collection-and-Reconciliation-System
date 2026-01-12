# ⚡ Quick Start - Deploy lên Render

## 🎯 Tóm tắt nhanh

### 1. Xem Region của PostgreSQL
- Vào PostgreSQL service → tab **Info** → xem **Region**
- Ghi nhớ region này (ví dụ: Singapore, Virginia)

### 2. Tạo Web Service
- **Language**: Chọn **Docker**
- **Root Directory**: `backend`
- **Region**: Chọn **cùng region** với PostgreSQL

### 3. Environment Variables cần điền

#### Bắt buộc (3 biến):

```
DB_USERNAME=<từ PostgreSQL Info>
DB_PASSWORD=<từ PostgreSQL Info>  
DATABASE_URL=jdbc:postgresql://<host>:<port>/<database>
```

#### Lấy thông tin từ PostgreSQL:
1. Vào PostgreSQL service → tab **Info**
2. Copy các giá trị:
   - **Host** → thay vào `<host>`
   - **Port** → thay vào `<port>` (thường 5432)
   - **Database** → thay vào `<database>`
   - **User** → giá trị cho `DB_USERNAME`
   - **Password** → giá trị cho `DB_PASSWORD`

#### Ví dụ cụ thể:
```
DB_USERNAME=cod_user_abc123
DB_PASSWORD=mySecurePassword123
DATABASE_URL=jdbc:postgresql://dpg-xxxxx-a.singapore-postgres.render.com:5432/cod_db_xxxx
```

### 4. Optional (cho production):
```
SHOW_SQL=false
FORMAT_SQL=false
```

---

## 📍 Cách điền trên Render Form

1. Click **"+ Add Environment Variable"**
2. Điền **NAME**: `DB_USERNAME`
3. Điền **value**: copy từ PostgreSQL Info
4. Lặp lại cho `DB_PASSWORD` và `DATABASE_URL`

---

## ✅ Checklist

- [ ] PostgreSQL đã tạo và đang chạy
- [ ] Đã note lại region của PostgreSQL
- [ ] Web Service chọn cùng region
- [ ] Đã set 3 biến: DB_USERNAME, DB_PASSWORD, DATABASE_URL
- [ ] Đã deploy và check logs

---

## 🆘 Nếu lỗi

- **Lỗi connection**: Kiểm tra DATABASE_URL đúng format chưa (phải có `jdbc:` ở đầu)
- **Lỗi authentication**: Kiểm tra DB_USERNAME và DB_PASSWORD đúng chưa
- **Lỗi region**: Đảm bảo Web Service và PostgreSQL cùng region

