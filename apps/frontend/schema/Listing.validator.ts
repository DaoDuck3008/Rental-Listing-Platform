import createListingProps from "@/types/listing.type";
import { toast } from "react-toastify";

export const CreateListingValidate = ({
  form,
  images,
  isUpdate = false,
}: {
  form: createListingProps;
  images: File[] | null;
  isUpdate?: boolean;
}): boolean => {
  if (!form.title?.trim()) {
    toast.warning("Tiêu đề bài viết không được để trống!");
    return false;
  }

  if (!form.listing_type_code) {
    toast.warning("Loại phòng không được để trống!");
    return false;
  }

  if (!form.price || form.price <= 0) {
    toast.warning("Giá phòng phải lớn hơn 0!");
    return false;
  }

  if (!form.capacity || form.capacity <= 0) {
    toast.warning("Sức chứa phải lớn hơn 0!");
    return false;
  }

  if (!form.area || form.area <= 0) {
    toast.warning("Diện tích phải lớn hơn 0!");
    return false;
  }

  // Validate beds and bathrooms
  if (form.beds < 0) {
    toast.warning("Số phòng ngủ không hợp lệ!");
    return false;
  }

  if (form.bathrooms < 0) {
    toast.warning("Số phòng vệ sinh không hợp lệ!");
    return false;
  }

  // Validate location
  if (!form.province_code) {
    toast.warning("Vui lòng chọn Tỉnh/Thành phố!");
    return false;
  }

  if (!form.ward_code) {
    toast.warning("Vui lòng chọn Phường/Xã!");
    return false;
  }

  if (!form.address?.trim()) {
    toast.warning("Địa chỉ chi tiết không được để trống!");
    return false;
  }

  if (!form.latitude || !form.longitude) {
    toast.warning("Vui lòng xác định vị trí trên bản đồ!");
    return false;
  }

  // Validate amenities and description
  if (!form.amenities || form.amenities.length === 0) {
    toast.warning("Vui lòng chọn ít nhất 1 tiện ích!");
    return false;
  }

  if (!form.description?.trim()) {
    toast.warning("Mô tả bài viết không được để trống!");
    return false;
  }

  if (!isUpdate && (!images || images.length === 0)) {
    toast.warning("Vui lòng tải lên ít nhất 1 hình ảnh!");
    return false;
  }

  return true;
};

export const CreateDraftListingValidate = ({
  form,
}: {
  form: Partial<createListingProps>;
}): boolean => {
  // For drafts, we require at least a non-empty title
  if (!form.title || form.title.trim() === "") {
    toast.warning("Vui lòng nhập ít nhất tiêu đề để lưu bản nháp!");
    return false;
  }

  if (form.title && form.title.length > 255) {
    toast.warning("Tiêu đề không được vượt quá 255 ký tự!");
    return false;
  }

  return true;
};
