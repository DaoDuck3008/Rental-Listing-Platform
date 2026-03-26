/**
 * Kiểu dữ liệu cho trạng thái listing
 */
export type ListingStatus =
  | "DRAFT"
  | "EDIT_DRAFT"
  | "PENDING"
  | "PUBLISHED"
  | "HIDDEN"
  | "EXPIRED"
  | "SOFT_DELETED";

/**
 * Map trạng thái từ tiếng Anh sang tiếng Việt
 */
export const STATUS_MAP: Record<string, string> = {
  DRAFT: "Bản nháp",
  EDIT_DRAFT: "Cần duyệt lại",
  PENDING: "Đang chờ kiểm duyệt",
  PUBLISHED: "Đã xuất bản",
  HIDDEN: "Đã ẩn",
  EXPIRED: "Đã hết hạn",
  REJECTED: "Đã bị từ chối",
  SOFT_DELETED: "Đã bị xóa bởi chủ nhà",
};

/**
 * Kiểu dữ liệu cho style của status
 */
export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

/**
 * Cấu hình màu sắc cho từng trạng thái
 */
export const STATUS_STYLES: Record<string, StatusStyle> = {
  DRAFT: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-500",
  },
  EDIT_DRAFT: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  PENDING: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  PUBLISHED: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  HIDDEN: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    dot: "bg-gray-500",
  },
  EXPIRED: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  REJECTED: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  SOFT_DELETED: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

/**
 * Hàm lấy tên trạng thái tiếng Việt
 * @param status - Trạng thái tiếng Anh
 * @returns Trạng thái tiếng Việt
 */
export const getVietnameseStatus = (status?: string): string => {
  if (!status) return "";
  return STATUS_MAP[status] || status;
};

/**
 * Hàm lấy style cho trạng thái
 * @param status - Trạng thái
 * @returns Style object cho trạng thái
 */
export const getStatusStyle = (status?: string): StatusStyle => {
  if (!status) return STATUS_STYLES.DRAFT;
  return STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
};
