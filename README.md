# 🛡️ SAFE ZONE

**Demo đa kịch bản cảnh báo thiên tai tại Việt Nam** — ứng dụng bản đồ tương tác giúp người dùng quét vị trí thực tế (GPS) hoặc mô phỏng các kịch bản thiên tai (sạt lở đèo, lũ sông, cháy rừng núi) và nhận phân tích lý thuyết về mức độ nguy hiểm của khu vực.

Xây dựng trên **Laravel 13** + **Leaflet** + **Bootstrap 5**.

---

## ✨ Tính năng

- 🗺️ **Bản đồ tương tác** (Leaflet) hiển thị vùng an toàn / vùng nguy hiểm.
- 🌐 **Chế độ thực tế (GPS):** quét vị trí hiện tại của người dùng.
- ⛰️ **Mô phỏng kịch bản thiên tai:**
  - Đèo Mã Pí Lèng (sạt lở đèo)
  - Mường Lay – Điện Biên (lũ sông/sườn)
  - VQG Bù Gia Mập (rừng núi)
- 🤖 **Phân tích lý thuyết đất** theo từng kịch bản.
- 🔐 **Xác thực người dùng (Auth):** đăng ký, đăng nhập, đăng xuất.
  - Trang chủ `/` **truy cập tự do** (không bắt buộc đăng nhập).
  - Khách được hiển thị nút **Đăng nhập / Đăng ký**; người dùng đã đăng nhập thấy lời chào và nút **Đăng xuất**.
- 📱 **Giao diện tương thích mobile:** trên màn hình nhỏ (≤768px) bố cục tự xếp dọc — bản đồ ở trên, bảng điều khiển ở dưới.
- 🔌 **API hazards:** `GET /api/v1/hazards`.

---

## 🚀 Cài đặt

Yêu cầu: **PHP ^8.3**, **Composer**, **Node.js**, **MySQL**.

```bash
# 1. Cài dependencies
composer install
npm install

# 2. Tạo file môi trường & app key
cp .env.example .env
php artisan key:generate

# 3. Cấu hình database trong .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
#    rồi chạy migration
php artisan migrate

# 4. Build assets
npm run build
```

## ▶️ Chạy dự án

```bash
# Cách nhanh (server + queue + logs + vite chạy song song)
composer dev

# Hoặc thủ công
php artisan serve
npm run dev
```

Truy cập: <http://127.0.0.1:8000>

---

## 🗂️ Các route chính

| Method | URI | Mô tả | Yêu cầu |
|--------|-----|-------|---------|
| GET | `/` | Trang chủ SAFE ZONE | Tự do |
| GET | `/safezone` | Alias trang chủ | Tự do |
| GET / POST | `/login` | Đăng nhập | Khách (`guest`) |
| GET / POST | `/register` | Đăng ký tài khoản | Khách (`guest`) |
| POST | `/logout` | Đăng xuất | Đã đăng nhập (`auth`) |
| GET | `/api/v1/hazards` | API danh sách hazard | Tự do |

---

## 🔐 Luồng xác thực

1. Khách vào `/` tự do, thấy nút **Đăng nhập / Đăng ký** trên sidebar.
2. **Đăng ký** (`name`, `email`, `password` + xác nhận, tối thiểu 8 ký tự) → tự động đăng nhập → quay lại trang chủ.
3. **Đăng nhập** (`email`, `password`, tùy chọn *ghi nhớ đăng nhập*) → quay lại trang trước đó.
4. **Đăng xuất** → hủy session → về trang đăng nhập.

Mật khẩu được băm bằng `Hash::make`; session lưu ở database (`SESSION_DRIVER=database`).

---

## 🧱 Cấu trúc liên quan

```text
app/Http/Controllers/
├── SafeZoneController.php        # Trang chủ
├── HazardApiController.php       # API hazards
└── Auth/
    ├── LoginController.php
    ├── RegisterController.php
    └── LogoutController.php
resources/views/
├── safezone.blade.php           # Giao diện chính + nút auth
├── layouts/app.blade.php        # Layout cho trang auth
└── auth/{login,register}.blade.php
resources/css/safezone.css        # CSS + media query mobile
routes/web.php
```

---

## 🧪 Kiểm thử

```bash
php artisan test
```

---

## 📄 License

Mã nguồn khung Laravel phát hành theo [giấy phép MIT](https://opensource.org/licenses/MIT).
