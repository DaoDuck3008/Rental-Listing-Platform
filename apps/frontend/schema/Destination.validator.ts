import { toast } from "react-toastify";

export interface CreateDestinationProps {
  name: string;
  type: string;
  longitude: number | null;
  latitude: number | null;
  province_code?: number | null;
  ward_code?: number | null;
  address?: string; 
}

export const CreateDestinationValidate = (form: CreateDestinationProps): boolean => {
  if (!form.name?.trim()) {
    toast.warning("Tên địa danh không được để trống!");
    return false;
  }

  if (form.name.length < 3) {
    toast.warning("Tên địa danh phải dài ít nhất 3 ký tự!");
    return false;
  }

  if (!form.type) {
    toast.warning("Loại địa danh không được để trống!");
    return false;
  }

  if (form.longitude === null || form.latitude === null) {
    toast.warning("Vui lòng xác định vị trí trên bản đồ (Kinh độ/Vĩ độ)!");
    return false;
  }

  return true;
};
