import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const verifyCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    if (result.status === "ok") {
      console.log(">>> [Cloudinary] Kết nối thành công!");
    }
  } catch (error) {
    console.error(">>> [Cloudinary] Lỗi kết nối! Vui lòng kiểm tra lại biến môi trường.");
    console.error("Chi tiết:", error.error ? error.error.message : error.message);
    process.exit(1); // Dừng server nếu lỗi
  }
};

export default cloudinary;
