"use client";

import { useUserInfo } from "@/hooks/useUserInfo";
import { updateUserProfile } from "@/services/user.api";
import {
  Camera,
  Save,
  X,
  User as UserIcon,
  ArrowLeft,
  AlertCircle,
  Mail,
  Phone,
  Badge,
  Lock,
  User,
  CircleUserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BackButton from "@/components/common/backButton";
import { UpdateProfileValidate } from "@/schema/user.validator";
import WarningModal from "@/components/ui/warningModal";
import LoadingOverlay from "@/components/common/loadingOverlay";

export default function EditPersonalInformationPage() {
  const { userInfo, isLoading: isUserLoading, mutate } = useUserInfo();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Male" as "Male" | "Female" | "Other",
    phone_number: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        full_name: userInfo.full_name || "",
        gender: (userInfo.gender as any) || "Male",
        phone_number: userInfo.phone_number || "",
      });
      setAvatarPreview(userInfo.avatar || null);
    }
  }, [userInfo]);

  const validateForm = () => {
    return UpdateProfileValidate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước ảnh tối đa là 2MB");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("full_name", formData.full_name.trim());
      data.append("gender", formData.gender);
      data.append("phone_number", formData.phone_number);
      if (avatarFile) data.append("avatar", avatarFile);

      await updateUserProfile(data as any);
      toast.success("Cập nhật thông tin thành công!");
      await mutate();
      setTimeout(() => router.push("/profile/personal-information"), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
      {isSubmitting && <LoadingOverlay message="Đang cập nhật hồ sơ..." />}

      {showConfirmModal && (
        <WarningModal
          title="Xác nhận cập nhật"
          message="Vui lòng kiểm tra kỹ lại thông tin trước khi xác nhận. Bạn có chắc chắn muốn lưu các thay đổi này?"
          OnClose={() => setShowConfirmModal(false)}
          OnSubmit={handleConfirmSubmit}
          submitLabel="Xác nhận lưu"
          closeLabel="Kiểm tra lại"
        />
      )}

      {/* Page Heading */}
      <div className="flex justify-between gap-2 mb-8">
        <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
          Chỉnh sửa hồ sơ cá nhân
        </h1>
        <BackButton />
      </div>

      <form onSubmit={handlePreSubmit}>
        {/* Avatar Section */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-border-color mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden ring-4 ring-slate-50 shadow-md">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2 shadow-lg hover:bg-[#116ed1] transition-colors cursor-pointer flex items-center justify-center">
                <Camera size={20} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div className="flex flex-col gap-4 text-center sm:text-left flex-1">
              <div>
                <h2 className="text-slate-900 text-xl font-bold">
                  Ảnh đại diện
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Cho phép định dạng .jpg, .png. Kích thước tối đa 2MB.
                </p>
              </div>
              <div className="flex gap-3 justify-center sm:justify-start">
                <label className="flex items-center justify-center h-10 px-5 bg-border-color hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-bold transition-colors cursor-pointer">
                  Tải ảnh lên
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
                {avatarFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(userInfo?.avatar || null);
                    }}
                    className="flex items-center justify-center h-10 px-5 bg-transparent border border-input-border text-red-600 rounded-lg text-sm font-bold transition-colors"
                  >
                    Hủy thay đổi
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Info Form */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-border-color mb-6">
          <h3 className="text-slate-900 text-lg font-bold mb-6 flex items-center gap-2">
            <CircleUserRound size={20} className="text-primary" />
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-slate-900">
                Họ và tên
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User size={20} />
                </span>
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-input-border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-slate-400 font-medium"
                  type="text"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block mb-2 text-sm font-medium text-slate-900">
                Email (Không thể thay đổi)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={20} />
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-input-border rounded-lg text-slate-500 cursor-not-allowed font-medium"
                  type="email"
                  value={userInfo?.email || ""}
                  disabled
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block mb-2 text-sm font-medium text-slate-900">
                Số điện thoại
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone size={20} />
                </span>
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-input-border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-slate-400 font-medium"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-slate-900">
                Giới tính
              </label>
              <div className="flex gap-4">
                {["Male", "Female", "Other"].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary border-input-border focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {gender === "Male"
                        ? "Nam"
                        : gender === "Female"
                        ? "Nữ"
                        : "Khác"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Section (Placeholder) */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-border-color mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2 mb-1">
                <Lock size={20} className="text-primary" />
                Bảo mật & Mật khẩu
              </h3>
              <p className="text-slate-500 text-sm">
                Bạn nên đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-10 px-5 bg-transparent border border-input-border hover:bg-slate-50 text-slate-900 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
            >
              Đổi mật khẩu
            </button>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-color">
          <button
            type="button"
            onClick={() => router.push("/profile/personal-information")}
            className="h-12 px-6 rounded-lg text-slate-500 hover:text-slate-900 font-semibold transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 px-8 bg-primary hover:bg-[#116ed1] text-white rounded-lg font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
          >
            <Save size={20} />
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
