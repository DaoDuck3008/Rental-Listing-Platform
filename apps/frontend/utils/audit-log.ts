import { 
  CirclePlus, 
  Pencil, 
  History, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  Mail,
  Zap,
  ArrowUpCircle
} from "lucide-react";

export const AUDIT_ACTION_MAP: Record<string, { 
  text: string; 
  icon: any; 
  color: string;
}> = {
  // Listings
  CREATE_LISTING: {
    text: "Bạn đã tạo bài đăng mới",
    icon: CirclePlus,
    color: "bg-blue-50 text-blue-600",
  },
  CREATE_EDIT_DRAFT: {
    text: "Bạn đã tạo bản cập nhật mới",
    icon: CirclePlus,
    color: "bg-blue-50 text-blue-600",
  },
  UPDATE_LISTING: {
    text: "Bạn đã cập nhật bài đăng",
    icon: Pencil,
    color: "bg-yellow-50 text-yellow-600",
  },
  SUBMIT_LISTING: {
    text: "Bạn đã gửi bài đăng chờ duyệt",
    icon: ArrowUpCircle,
    color: "bg-indigo-50 text-indigo-600",
  },
  APPROVE_LISTING: {
    text: "Bài đăng của bạn đã được duyệt",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  APPROVE_EDIT_DRAFT: {
    text: "Bài đăng của bạn đã được duyệt",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600",
  },
  REJECT_LISTING: {
    text: "Bài đăng của bạn bị từ chối",
    icon: XCircle,
    color: "bg-red-50 text-red-600",
  },
  REJECT_EDIT_DRAFT: {
    text: "Bài đăng của bạn bị từ chối",
    icon: XCircle,
    color: "bg-red-50 text-red-600",
  },
  DELETE_LISTING: {
    text: "Bạn đã xóa bài đăng",
    icon: History,
    color: "bg-slate-50 text-slate-600",
  },
  SHOW_LISTING: {
    text: "Bạn đã hiển thị bài đăng",
    icon: History,
    color: "bg-slate-50 text-slate-600",
  },
  HIDE_LISTING: {
    text: "Bạn đã ẩn bài đăng",
    icon: History,
    color: "bg-slate-50 text-slate-600",
  },

  // Profile & Auth
  UPDATE_PROFILE: {
    text: "Bạn đã cập nhật thông tin cá nhân",
    icon: Pencil,
    color: "bg-cyan-50 text-cyan-600",
  },
  USER_LOGIN: {
    text: "Bạn đã đăng nhập hệ thống",
    icon: LogIn,
    color: "bg-emerald-50 text-emerald-600",
  },
  USER_GOOGLE_LOGIN: {
    text: "Đăng nhập bằng Google",
    icon: LogIn,
    color: "bg-emerald-50 text-emerald-600",
  },
  USER_REGISTER: {
    text: "Đăng ký tài khoản thành công",
    icon: UserPlus,
    color: "bg-blue-50 text-blue-600",
  },
  USER_GOOGLE_REGISTER: {
    text: "Đăng ký thành công bằng Google",
    icon: UserPlus,
    color: "bg-blue-50 text-blue-600",
  },
  USER_VERIFY_EMAIL: {
    text: "Xác thực email thành công",
    icon: ShieldCheck,
    color: "bg-green-50 text-green-600",
  },
  USER_CHANGE_PASSWORD: {
    text: "Bạn đã đổi mật khẩu",
    icon: KeyRound,
    color: "bg-purple-50 text-purple-600",
  },
  USER_REQUEST_FORGOT_PASSWORD: {
    text: "Yêu cầu khôi phục mật khẩu",
    icon: Mail,
    color: "bg-orange-50 text-orange-600",
  },
  USER_RESET_PASSWORD: {
    text: "Đặt lại mật khẩu thành công",
    icon: KeyRound,
    color: "bg-green-50 text-green-600",
  },
};

/**
 * Lấy thông tin hiển thị cho action trong Audit Log
 * @param action Mã hành động
 * @returns { text: string, icon: LucideIcon, color: string }
 */
export const getAuditActionDisplay = (action: string) => {
  return (
    AUDIT_ACTION_MAP[action] || {
      text: action,
      icon: Zap,
      color: "bg-slate-50 text-slate-500",
    }
  );
};
