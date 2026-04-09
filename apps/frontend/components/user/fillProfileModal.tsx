import {
  Camera,
  Check,
  HousePlus,
  Phone,
  RefreshCcw,
  UserRoundSearch,
  X,
} from "lucide-react";
import ModalPortal from "../ui/modalPortal";
import { useEffect, useState } from "react";
import Dropzone from "../common/dropzone";
import { toast } from "react-toastify";
import { updateUserProfile } from "@/services/user.api";
import { handleError } from "@/utils";

interface UserProfileProps {
  avatar?: string;
  role?: string;
  gender?: string | "TENANT" | "LANDLORD" | "USER";
  phone_number?: string;

  canPostListing: boolean;
  profileCompleted: boolean;
}

export default function FillProfileModal({
  onClose,
  userProfile,
}: {
  onClose: () => void;
  userProfile?: UserProfileProps | null;
}) {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role, setRole] = useState<string>(userProfile?.role || "TENANT");
  const [phone_number, setPhoneNumber] = useState<string>(
    userProfile?.phone_number || ""
  );
  const [gender, setGender] = useState<string>(userProfile?.gender || "Male");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userProfile?.phone_number) {
      setPhoneNumber(userProfile.phone_number);
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!phone_number) {
        toast.warning("Vui lòng nhập số điện thoại.");
        return;
      }

      const result = await updateUserProfile({
        role,
        avatar,
        phone_number,
        gender,
      });

      const { message, code } = result.data;

      if (result.status === 200) {
        toast.success(message || "Cập nhật hồ sơ thành công.");
        setIsLoading(false);
        setTimeout(() => {
          onClose();
        }, 1000);
        window.location.reload();
        return;
      }
    } catch (error: any) {
      handleError(error, "Đã có lỗi xảy ra. Vui lòng thử lại.");
      setIsLoading(false);
      return;
    }
  };

  return (
    <ModalPortal>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-3 sm:p-4">
        {/* MODAL */}
        <div className="w-full max-w-md animate-fade-in-up sm:max-w-250">
          <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex justify-end pt-3 pr-3 sm:pt-4 sm:pr-4">
              <button
                onClick={onClose}
                className="cursor-pointer hover:bg-slate-100 rounded-md p-2"
              >
                <X />
              </button>
            </div>
            <div className="border-b border-slate-100 px-4 pb-3 text-center sm:px-5 sm:pb-4">
              <h2 className="text-xl font-bold leading-tight text-text-main sm:text-2xl">
                Hoàn thiện hồ sơ
              </h2>
              <p className="mt-1 text-xs font-medium text-text-secondary sm:mt-2 sm:text-sm">
                Vui lòng cập nhật thông tin để chúng tôi có thể hỗ trợ bạn tốt
                hơn trong việc tìm kiếm hoặc cho thuê.
              </p>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 overflow-y-auto p-4 max-h-[60vh] sm:gap-6 sm:p-6 sm:max-h-[75vh] md:flex-row">
              <div className="md:w-1/3 flex flex-col items-center justify-start gap-3 sm:gap-4">
                <Dropzone
                  currentAvatar={userProfile?.avatar}
                  setAvatarCallback={(file) => setAvatar(file)}
                />
                <p className="text-xs text-text-secondary text-center sm:text-sm">
                  Ảnh đại diện giúp hồ sơ của bạn trông đáng tin cậy hơn
                </p>
              </div>

              <div className="md:w-2/3 flex flex-col gap-4 sm:gap-6">
                {/* Role Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-main sm:text-base">
                    Bạn là ai?
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                    <label className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-transparent bg-bg-light p-3 transition-all hover:bg-border-color has-checked:border-blue-400 has-checked:bg-[#f3f8fe] has-checked:text-blue-400 sm:gap-2 sm:p-4">
                      <input
                        checked={
                          role
                            ? role === "TENANT"
                            : userProfile?.role === "TENANT" ||
                              userProfile?.role === "USER"
                        }
                        className="sr-only"
                        type="radio"
                        onChange={() => setRole("TENANT")}
                      />
                      <UserRoundSearch size={24} className="sm:size-7.5" />
                      <span className="text-xs font-bold sm:text-sm">
                        Người đi thuê
                      </span>
                    </label>

                    <label className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-transparent bg-bg-light p-3 transition-all hover:bg-border-color has-checked:border-blue-400 has-checked:bg-[#f3f8fe] has-checked:text-blue-400 sm:gap-2 sm:p-4">
                      <input
                        checked={
                          role
                            ? role === "LANDLORD"
                            : userProfile?.role === "LANDLORD"
                        }
                        className="sr-only"
                        type="radio"
                        onChange={() => setRole("LANDLORD")}
                      />
                      <HousePlus size={24} className="sm:size-7.5" />
                      <span className="text-xs font-bold sm:text-sm">
                        Chủ cho thuê
                      </span>
                    </label>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-main sm:text-base">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary sm:left-4">
                      <Phone size={18} className="sm:size-auto" />
                    </span>
                    <input
                      className="h-10 w-full rounded-lg border border-input-border bg-white pl-9 pr-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary sm:h-12 sm:pl-11 sm:pr-4 sm:text-base"
                      placeholder="Nhập số điện thoại"
                      value={phone_number}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <label className="text-sm font-bold text-text-main sm:text-base">
                    Giới tính
                    <span className="ml-1 text-xs font-normal text-text-secondary sm:text-sm">
                      (Không bắt buộc)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {["Male", "Female", "Other"].map((g) => (
                      <label
                        key={g}
                        className="inline-flex items-center gap-1.5 cursor-pointer sm:gap-2"
                      >
                        <input
                          type="radio"
                          checked={
                            gender ? gender === g : userProfile?.gender === g
                          }
                          onChange={() => setGender(g)}
                          className="h-4 w-4 text-primary sm:h-5 sm:w-5"
                        />
                        <span className="text-xs font-medium sm:text-sm">
                          {g === "Male"
                            ? "Nam"
                            : g === "Female"
                            ? "Nữ"
                            : "Khác"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-slate-100 p-4 pt-3 sm:gap-3 sm:p-6 sm:pt-4">
              <button
                onClick={handleSubmit}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 px-4 text-sm font-bold text-white shadow-sm transition-transform hover:bg-blue-600 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:h-12 sm:px-6 sm:text-base"
              >
                <span className="mr-1.5 sm:mr-2">
                  {!isLoading ? "Hoàn tất" : "Đang xử lý"}
                </span>
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
                  {!isLoading && <Check size={18} className="sm:size-auto" />}
                  {isLoading && (
                    <RefreshCcw
                      size={18}
                      className="sm:size-auto animate-spin"
                    />
                  )}
                </span>
              </button>

              <p className="text-center text-xs text-text-secondary">
                Bằng cách tiếp tục, bạn đồng ý với{" "}
                <a className="underline hover:text-primary" href="#">
                  Điều khoản dịch vụ
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
