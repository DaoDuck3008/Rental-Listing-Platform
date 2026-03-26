import { toast } from "react-toastify";

export interface UpdateProfileProps {
  full_name: string;
  phone_number: string;
  gender: string;
}

export const UpdateProfileValidate = (form: UpdateProfileProps): boolean => {
  if (!form.full_name?.trim()) {
    toast.warning("Họ và tên không được để trống!");
    return false;
  }

  if (form.full_name.trim().length < 2) {
    toast.warning("Họ và tên phải có ít nhất 2 ký tự!");
    return false;
  }

  if (!form.phone_number?.trim()) {
    toast.warning("Số điện thoại không được để trống!");
    return false;
  }

  const phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (!phoneRegex.test(form.phone_number.trim())) {
    toast.warning("Số điện thoại không hợp lệ (phải có 10 số)!");
    return false;
  }

  if (!form.gender) {
    toast.warning("Vui lòng chọn giới tính!");
    return false;
  }

  return true;
};
