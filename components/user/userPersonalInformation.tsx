import { getPersonalInformation } from "@/services/user.api";
import {
  IdCard,
  ShieldCheck,
  CalendarDays,
  Phone,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleError } from "@/utils";

interface UserPersonalInformationProps {
  role: string;
  email: string;
  phone_number: string;
  full_name: string;
  created_at: string;
  status: string;
  gender: string;
}

const USERSTATUS = {
  Active: "Đang hoạt động",
  Inactive: "Không hoạt động",
  Banned: "Bị cấm",
};

export default function UserPersonalInformation() {
  const [user, setUser] = useState<UserPersonalInformationProps | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const toggleShowEmail = () => {
    setShowEmail(!showEmail);
  };

  const toggleShowPhoneNumber = () => {
    setShowPhoneNumber(!showPhoneNumber);
  };

  useEffect(() => {
    const callPersonalInformation = async () => {
      try {
        const result = await getPersonalInformation();

        setUser(result.data.user);
      } catch (error: any) {
        handleError(error, "Đã có lỗi xảy ra, vui lòng thử lại sau!");
      }
    };

    callPersonalInformation();
  }, []);

  return (
    <>
      <div className="bg-white border border-input-border rounded-2xl overflow-hidden shadow-sm h-fit">
        <div className="px-5 py-4 lg:px-6 lg:py-4 border-b border-input-border flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-base lg:text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-[20px]">
              <IdCard />
            </span>
            Thông tin tài khoản
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] lg:text-xs font-bold rounded-full uppercase tracking-wider">
            {USERSTATUS[user?.status as keyof typeof USERSTATUS] || "N/A"}
          </span>
        </div>
        <div className="p-5 lg:p-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="material-symbols-outlined text-[20px]">
                  <ShieldCheck size={20} />
                </span>
                <span className="text-sm font-medium">Vai trò</span>
              </div>
              <span className="font-bold text-sm text-text-main">
                {user?.role || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="material-symbols-outlined text-[20px]">
                  <CalendarDays size={20} />
                </span>
                <span className="text-sm font-medium">Gia nhập</span>
              </div>
              <span className="font-bold text-sm text-text-main">
                {new Date(user?.created_at || "").toLocaleDateString(
                  "vi-VN",
                  {}
                ) || "N/A"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg gap-2 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="material-symbols-outlined text-[20px]">
                  <Mail size={20} />
                </span>
                <span className="text-sm font-medium">Email</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-text-main">
                  {showEmail ? user?.email || "N/A" : "************"}
                </span>
                <button
                  onClick={toggleShowEmail}
                  className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showEmail ? <Eye size={20} /> : <EyeOff size={20} />}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3 text-text-secondary">
                <span className="material-symbols-outlined text-[20px]">
                  <Phone size={20} />
                </span>
                <span className="text-sm font-medium">SĐT</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-text-main">
                  {showPhoneNumber
                    ? user?.phone_number || "N/A"
                    : "************"}
                </span>
                <button
                  onClick={toggleShowPhoneNumber}
                  className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPhoneNumber ? <Eye size={20} /> : <EyeOff size={20} />}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
