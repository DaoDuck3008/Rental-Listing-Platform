# ANTIGRAVITY RULES - BACKEND

Dưới đây là các quy tắc quan trọng mà Antigravity (AI) cần tuân thủ khi làm việc với codebase backend này:

## 1. Terminal & Port Management
- **MANDATORY**: Sau khi kết thúc việc chạy các bộ test (unit tests, integration tests), bạn **PHẢI** đóng/kill terminal hoặc tiến trình đang chạy backend ngay lập tức.
- **Mục đích**: Đảm bảo cổng (port 5000 hoặc PORT từ .env) luôn được giải phóng để người dùng có thể chạy backend thủ công bằng `npm run dev` mà không bị lỗi "Port already in use".

## 2. Environment Variables
- Khi thêm biến môi trường mới vào `.env`, hãy luôn cập nhật tệp `.env.example` với giá trị mặc định hoặc mô tả tương ứng.
- Đảm bảo các biến nhạy cảm không được commit lên git (đã có `.gitignore`).

## 3. Database & Migrations
- Luôn sử dụng `sequelize-cli` để tạo model và migration.
- Không chỉnh sửa database trực tiếp hoặc sử dụng `sequelize.sync()` trong code chính thức để tránh mất dữ liệu hoặc không đồng nhất.
- Khi tạo migration mới, hãy kiểm tra kỹ cả hàm `up` và `down`.

## 4. Coding Style & Patterns
- **Logging**: Hãy tuân thủ phong cách log hiện tại của dự án: sử dụng tiền tố `>>>` trong console log (Ví dụ: `console.log(">>> Database connected");`).
- **Error Handling**: Sử dụng cấu trúc lỗi đồng nhất đã thiết lập trong `app.js`. Luôn trả về:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "error": "ERROR_CODE",
    "message": "Chi tiết lỗi"
  }
  ```
- **Validation**: Sử dụng `Zod` để validate dữ liệu đầu vào (request body, params, query) trước khi xử lý logic ở controller.
- **ES Modules**: Tuyệt đối sử dụng cú pháp `import`/`export` (ESM), không sử dụng `require`/`module.exports`.

## 5. Socket.io & Redis
- Lưu ý rằng dự án sử dụng Socket.io được khởi tạo trong `server.js`. Khi viết các bộ test hay sửa đổi code, luôn kiểm tra xem kết nối socket đã được ngắt (disconnect) hay chưa sau khi dùng xong để tránh rò rỉ bộ nhớ hoặc cổng bị treo.
- **Redis**: Dự án cũng sử dụng Redis cho caching hoặc state. Đảm bảo kết nối Redis được xử lý cẩn thận trong môi trường phát triển và test (Sử dụng `initRedis` từ `config/redis.js`).

## 6. Cron Jobs & Tasks
- Lưu ý các cron job đang chạy (như `syncListingViewsJob`) có thể ảnh hưởng đến hiệu suất hoặc dữ liệu khi test. Cần tắt hoặc mock chúng nếu cần thiết trong môi trường test.
