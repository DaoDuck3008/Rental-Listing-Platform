# 🎨 Rental Listing Platform - Frontend Web Application (Bản Tiếng Việt)

[🇺🇸 English Version](./README.md) | [Tiếng Việt](#)

---

> **Mô tả:** Giao diện web hiện đại, hiệu năng cao cho nền tảng cho thuê bất động sản, được xây dựng với Next.js 16 và Tailwind CSS 4.

---

## 🚀 Tổng quan

Lớp giao diện của **Rental Listing Platform** được thiết kế để mang lại trải nghiệm tìm kiếm mượt mà cho người dùng. Hệ thống kết nối với [Backend API Gateway](https://github.com/DaoDuck3008/BE-Rental-Listing-Platform) để cung cấp khả năng tìm kiếm động, quản lý tin đăng thời gian thực và các biểu đồ thống kê trực quan.

Các trọng tâm cốt lõi: **Giao diện Responsive**, **Tối ưu hóa dữ liệu (SWR)**, và **Bản đồ tương tác (Google Maps)**.

---

## 🛠️ Công nghệ sử dụng

- **Framework:** Next.js 16+ (App Router)
- **Quản lý trạng thái:** **Zustand** (Auth & các trạng thái UI toàn cục)
- **Truy xuất dữ liệu:** **SWR** (Cập nhật dữ liệu lạc quan & Caching)
- **Styling:** **Tailwind CSS 4**
- **Biểu đồ:** **Recharts** (Trực quan hóa thống kê lượt xem tin đăng)
- **Bản đồ:** **@react-google-maps/api**
- **Soạn thảo văn bản:** **Tiptap** (Trình soạn thảo mô tả bất động sản)
- **Thư viện Component:** **Lucide Icons**, **React Dropzone** (Tải lên hình ảnh), **React Toastify** (Thông báo).
- **Thời gian thực:** **Socket.io-client**.

---

## ✨ Tính năng nổi bật

### 1. Tìm kiếm & Khám phá trực quan
- **Bộ lọc nâng cao:** Tìm kiếm theo vị trí với bán kính tùy chỉnh (Bản đồ tương tác).
- **Infinite Scrolling:** Trải nghiệm cuộn trang mượt mà khi xem danh sách bất động sản.
- **Giá thuê linh hoạt:** Thanh trượt khoảng giá tương tác để lọc theo ngân sách.

### 2. Quản lý tin đăng mạnh mẽ (Dashboard cho Chủ nhà)
- **Thống kê:** Quan sát lượt xem và xu hướng hiệu suất qua các biểu đồ tương tác.
- **Trình soạn thảo tin đăng:** Soạn thảo mô tả kiểu WYSIWYG và kéo-thả để tải lên hình ảnh.
- **Tự động lưu bản nháp:** Đảm bảo dữ liệu không bị mất khi đang tạo tin đăng.

### 3. Trải nghiệm người dùng đồng nhất
- **Xác thực:** Đăng nhập thống nhất cho Email/Mật khẩu và Google OAuth.
- **Chế độ tối (Dark Mode):** Hỗ trợ chuyển đổi giao diện linh hoạt qua `next-themes`.
- **Thông báo Toast:** Phản hồi ngay lập tức cho mọi hành động của người dùng.

---

## 🏁 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- Node.js 18+
- Backend API đã được chạy

### Các bước cài đặt

#### 🐳 Cách 1: Sử dụng Docker (Khuyên dùng)
*(Hệ thống đang được đóng gói bằng Docker. Script sẽ sớm được cập nhật.)*

#### 🛠️ Cách 2: Cài đặt thủ công
1.  **Clone dự án:** 
    ```bash
    git clone https://github.com/DaoDuck3008/FE-Rental-Listing-Platform.git
    cd frontend
    ```
2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```
3.  **Thiết lập môi trường:**
    - Copy `.env.example` thành `.env.local`.
    - Cung cấp URL Backend API và Google Maps API Key.
4.  **Chạy máy chủ Dev:**
    ```bash
    npm run dev
    ```

---

## 🏗️ Cấu trúc thư mục

```text
app/          # Định nghĩa Pages, Layouts (App Router)
components/   # Các Component UI dùng chung
hooks/        # Custom React hooks (auth, maps, etc.)
lib/          # Các thư viện tiện ích (axios, socket)
services/     # Định nghĩa các API service (SWR fetchers)
store/        # Các store quản lý trạng thái qua Zustand
styles/       # Global CSS & Cấu hình Tailwind
public/       # Tài sản tĩnh (hình ảnh, icon)
```

---

## 🤝 Liên hệ
- **Tác giả:** Đào Anh Đức
- **GitHub:** [@DaoDuck3008](https://github.com/DaoDuck3008)
- **Mục tiêu:** Dự án Internship / Portfolio cá nhân.
