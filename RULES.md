# Frontend Coding Rules & Guidelines

Tài liệu này quy định các tiêu chuẩn và nguyên tắc thiết kế cho phần Frontend của dự án Rental Listing Platform.

## 🏗 Kiến trúc tổng quan
- **Framework:** Next.js (App Router).
- **Ngôn ngữ:** TypeScript.
- **Styling:** Tailwind CSS v4.
- **State Management:** Zustand.
- **Data Fetching:** SWR & Axios.

## 📂 Cấu trúc thư mục
- `app/`: Chứa các route, layouts và pages của Next.js.
- `components/`: Chứa các React components, phân chia theo tính năng (ví dụ: `chat/`, `listing/`, `auth/`).
- `hooks/`: Chứa các Custom Hooks (logic xử lý hoặc data fetching).
- `services/`: Chứa các định nghĩa API call (sử dụng Axios instance từ `api.ts`).
- `store/`: Chứa các Zustand stores cho global state.
- `types/`: Chứa các interface và type định nghĩa toàn cục.
- `utils/`: Chứa các hàm helper dùng chung.
- `schema/`: Chứa các schema validation.

## 🏷 Quy tắc đặt tên (Naming Conventions)
- **Files:**
    - Components: `camelCase.tsx` (ví dụ: `chatWindow.tsx`).
    - Hooks: `useCamelCase.ts` (ví dụ: `useUserInfo.ts`).
    - Stores: `camelCase.store.ts` (ví dụ: `auth.store.ts`).
    - Services: `camelCase.api.ts` (ví dụ: `listing.api.ts`).
    - Utils: `kebab-case.ts` (ví dụ: `error-handler.ts`).
- **Directories:** `camelCase` hoặc `kebab-case` cho các thư mục feature trong `components`.

## 💻 Tiêu chuẩn lập trình
### 1. React & Next.js
- Luôn sử dụng `"use client";` ở đầu file cho các component cần tương tác (event handlers, hooks).
- Ưu tiên sử dụng Functional Components với `export default function Name`.
- Sử dụng `next/image` cho hình ảnh và `next/link` cho điều hướng.

### 2. TypeScript
- Ưu tiên định nghĩa Interface rõ ràng cho Props và Dữ liệu.
- Hạn chế sử dụng `any`. Nếu không biết rõ kiểu dữ liệu, hãy cố gắng define nó trong `types/`.

### 3. Styling
- Sử dụng Tailwind CSS cho toàn bộ giao diện.
- Sử dụng thư viện `clsx` và `tailwind-merge` để xử lý class động.
- Tránh viết Inline Styles trừ trường hợp bất khả kháng.

### 4. API & Error Handling
- Tất cả API call phải thông qua `services/`.
- Các file API đều phải dùng `api.ts` để tạo instance axios.
- Sử dụng `handleError(error, message)` từ `@/utils` để xử lý lỗi thống nhất.
- Sử dụng `react-toastify` để thông báo cho người dùng.

### 5. State Management
- Sử dụng Zustand cho global state.
- Giữ logic trong store tối giản, chỉ chứa state và các hàm update state liên quan.

## 🎨 UI/UX & Icons
- Sử dụng **Lucide React** cho các icon.
- Đảm bảo tính responsive trên mobile và desktop.
- Sử dụng các component dùng chung từ `components/ui/` (ví dụ: `WarningModal`, `Button`).

---
> [!IMPORTANT]
> Luôn kiểm tra lại codebase hiện tại trước khi tạo mới để đảm bảo tính nhất quán (Consistency).
