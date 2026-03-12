import { toast } from "react-toastify";

/**
 * @param error - error được axios bắt khi backend trả về
 * @param customMessage - message lỗi mặc định khi không có lỗi từ backend
 */
export const handleError = (error: any, customMessage: string = "Đã có lỗi xảy ra. Vui lòng thử lại sau.") => {
  const response = error?.response;

  if (response && response.data) {
    const { error: errorCode, message } = response.data;

    if (errorCode && errorCode !== "INTERNAL_SERVER_ERROR") {
      // Đối với lỗi VALIDATION_ERROR thì hiện toast từng lỗi một
      if (errorCode === "VALIDATION_ERROR" && Array.isArray(response.data.errors)) {
        response.data.errors.forEach((err: any) => {
          toast.error(err.message || "Dữ liệu không hợp lệ");
        });
        return;
      }

      // Đối với các lỗi đã biết thì hiện toast, không log ra console
      toast.error(message || "Đã có lỗi xảy ra");
      return;
    }
  }

  // Đối với lỗi không xác định thì hiện toast và log ra console
  console.error("Unknown Error:", error);
  toast.error(customMessage);
};
