/**
 * Hàm format ngày tháng sang định dạng Việt Nam
 * @param dateString - Chuỗi ngày tháng dạng ISO hoặc Date string
 * @returns Ngày tháng đã format theo locale vi-VN
 */
export const formatVietnameseDate = (dateString?: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Hàm format giá tiền sang định dạng VNĐ
 * @param price - Giá tiền dạng số (Numeric)
 * @returns Giá tiền đã format (tỷ/triệu/nghìn/VNĐ)
 */
export const formatVietnamesePrice = (price: number): string => {
  if (!price || price === 0) return "0 VNĐ";

  // Nếu giá >= 1 tỷ
  if (price >= 1000000000) {
    const billions = price / 1000000000;
    return `${billions.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} tỷ/tháng`;
  }
  // Nếu giá >= 1 triệu
  else if (price >= 1000000) {
    const millions = price / 1000000;
    return `${millions.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} tr/tháng`;
  }
  // Nếu giá >= 1 nghìn
  else if (price >= 1000) {
    const thousands = price / 1000;
    return `${thousands.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} nghìn/tháng`;
  }
  // Dưới 1 nghìn
  else {
    return `${price.toLocaleString("vi-VN")} VNĐ/tháng`;
  }
};

/**
 * Hàm format số lượt xem
 * @param views - Số lượt xem
 * @returns Số lượt xem đã format
 */
export const formatViews = (views: string | number): string => {
  const viewCount = typeof views === "string" ? parseInt(views) : views;
  
  if (isNaN(viewCount)) return "0";
  
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}K`;
  }
  
  return viewCount.toString();
};

/**
 * Hàm format thời gian tương đối (ví dụ: 5 phút trước)
 * @param dateString - Chuỗi ngày tháng
 * @returns Khoảng thời gian tương đối
 */
export const formatTimeAgo = (dateString?: string): string => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
  return `${Math.floor(diffInMonths / 12)} năm trước`;
};
