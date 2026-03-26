# Utils - Thư viện Tiện ích

Thư mục này chứa các hàm tiện ích và constants có thể tái sử dụng trong toàn bộ ứng dụng.

## 📁 Cấu trúc

```
utils/
├── formatters.ts    # Các hàm format dữ liệu
├── constants.ts     # Constants và helper functions
├── index.ts         # Export tất cả utilities
└── README.md        # Tài liệu này
```

## 🚀 Cách sử dụng

### Import từ utils

```typescript
// Import tất cả từ index
import {
  formatVietnameseDate,
  formatVietnamesePrice,
  formatViews,
  getVietnameseStatus,
  getStatusStyle,
  STATUS_MAP,
  STATUS_STYLES,
} from "@/utils";

// Hoặc import từng file cụ thể
import { formatVietnameseDate } from "@/utils/formatters";
import { getVietnameseStatus } from "@/utils/constants";
```

## 📚 API Reference

### Formatters (`formatters.ts`)

#### `formatVietnameseDate(dateString?: string): string`

Format ngày tháng sang định dạng Việt Nam.

**Tham số:**
- `dateString` (optional): Chuỗi ngày tháng dạng ISO hoặc Date string

**Trả về:** Ngày tháng đã format theo locale `vi-VN` (DD/MM/YYYY, HH:MM)

**Ví dụ:**
```typescript
formatVietnameseDate("2026-01-17T11:52:36+07:00")
// => "17/01/2026, 11:52"
```

---

#### `formatVietnamesePrice(price: number): string`

Format giá tiền sang định dạng VNĐ (tỷ/triệu/nghìn).

**Tham số:**
- `price`: Giá tiền dạng số (Numeric)

**Trả về:** Giá tiền đã format với đơn vị phù hợp

**Ví dụ:**
```typescript
formatVietnamesePrice(5000000)     // => "5 tr/tháng"
formatVietnamesePrice(1500000000)  // => "1,5 tỷ/tháng"
formatVietnamesePrice(500000)      // => "500 nghìn/tháng"
```

---

#### `formatViews(views: string | number): string`

Format số lượt xem (K, M).

**Tham số:**
- `views`: Số lượt xem (string hoặc number)

**Trả về:** Số lượt xem đã format

**Ví dụ:**
```typescript
formatViews(1500)      // => "1.5K"
formatViews(1500000)   // => "1.5M"
```

---

### Constants (`constants.ts`)

#### `STATUS_MAP: Record<string, string>`

Map trạng thái từ tiếng Anh sang tiếng Việt.

**Giá trị:**
- `DRAFT` → "Bản nháp"
- `PENDING` → "Đang chờ kiểm duyệt"
- `PUBLISHED` → "Đã xuất bản"
- `HIDDEN` → "Đã ẩn"
- `EXPIRED` → "Đã hết hạn"

---

#### `STATUS_STYLES: Record<string, StatusStyle>`

Cấu hình màu sắc cho từng trạng thái.

**Interface StatusStyle:**
```typescript
interface StatusStyle {
  bg: string;      // Background color class
  text: string;    // Text color class
  border: string;  // Border color class
  dot: string;     // Dot indicator color class
}
```

---

#### `getVietnameseStatus(status?: string): string`

Lấy tên trạng thái tiếng Việt.

**Tham số:**
- `status` (optional): Trạng thái tiếng Anh

**Trả về:** Trạng thái tiếng Việt

**Ví dụ:**
```typescript
getVietnameseStatus("PENDING")  // => "Đang chờ kiểm duyệt"
getVietnameseStatus("DRAFT")    // => "Bản nháp"
```

---

#### `getStatusStyle(status?: string): StatusStyle`

Lấy style cho trạng thái.

**Tham số:**
- `status` (optional): Trạng thái

**Trả về:** Object chứa các class CSS cho status badge

**Ví dụ:**
```typescript
const style = getStatusStyle("PUBLISHED");
// => {
//   bg: "bg-emerald-100",
//   text: "text-emerald-700",
//   border: "border-emerald-200",
//   dot: "bg-emerald-500"
// }
```

---

## 💡 Ví dụ Sử dụng

### Trong Component

```typescript
import {
  formatVietnameseDate,
  formatVietnamesePrice,
  getVietnameseStatus,
  getStatusStyle,
} from "@/utils";

function ListingCard({ listing }) {
  const formattedDate = formatVietnameseDate(listing.createdAt);
  const formattedPrice = formatVietnamesePrice(listing.price);
  const statusText = getVietnameseStatus(listing.status);
  const statusStyle = getStatusStyle(listing.status);

  return (
    <div>
      <p>{formattedPrice}</p>
      <p>{formattedDate}</p>
      <span className={`${statusStyle.bg} ${statusStyle.text}`}>
        {statusText}
      </span>
    </div>
  );
}
```

---

## 🔧 Mở rộng

Để thêm utility mới:

1. Tạo hàm trong file tương ứng (`formatters.ts` hoặc `constants.ts`)
2. Export hàm đó
3. Thêm export vào `index.ts`
4. Cập nhật README này với documentation

---

## 📝 Ghi chú

- Tất cả các hàm đều handle edge cases (null, undefined, invalid values)
- Sử dụng locale `vi-VN` cho tất cả formatting
- Constants có thể được import trực tiếp hoặc qua helper functions
