"use client";

import { useUserInfo } from "@/hooks/useUserInfo";
import {
  Eye,
  EyeOff,
  Edit3,
  User as UserIcon,
  ShieldCheck,
  Mail,
  Phone,
  Badge,
  Lock,
  Calendar,
  User,
  CircleUserRound,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ChangePasswordModal from "@/components/user/ChangePasswordModal";

export default function PersonalInformationPage() {
  const { userInfo, isLoading } = useUserInfo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const InfoDisplay = ({
    label,
    value,
    sensitive = false,
    icon: Icon,
    isStatus = false,
  }: any) => {
    const [show, setShow] = useState(!sensitive);

    return (
      <div className="col-span-1">
        <p className="block mb-2 text-sm font-medium text-slate-500">{label}</p>
        <div className="relative flex items-center justify-between p-3.5 bg-slate-50 border border-border-color rounded-lg group hover:border-primary/30 transition-all">
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className="text-slate-400" />}
            <span className="text-base font-semibold text-slate-900">
              {isStatus ? (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    value === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {value === "Active" ? "Đang hoạt động" : "Bị khóa"}
                </span>
              ) : sensitive && !show ? (
                "************"
              ) : (
                value || "Chưa cập nhật"
              )}
            </span>
          </div>
          {sensitive && (
            <button
              onClick={() => setShow(!show)}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 transition-colors"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto pb-24 px-4 md:px-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Hồ sơ cá nhân
          </h1>
        </div>
        <Link
          href="/profile/personal-information/edit"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-[#116ed1] transition-all"
        >
          <Edit3 size={18} />
          Chỉnh sửa hồ sơ
        </Link>
      </div>

      {/* Avatar Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-border-color mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden ring-4 ring-slate-50 shadow-md">
            {userInfo?.avatar ? (
              <Image
                src={userInfo.avatar}
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
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <div className="flex gap-2">
              <h2 className="text-slate-900 text-xl font-bold">
                {userInfo?.full_name}
              </h2>
              <div className=" text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck size={14} />
                {userInfo?.role || "Thành viên"}
              </div>
            </div>

            <p className="text-slate-500 text-sm">Email: {userInfo?.email}</p>
            <p className="text-slate-500 text-sm">
              SĐT: {userInfo?.phone_number}
            </p>
          </div>
        </div>
      </section>

      {/* Personal Info Grid */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-border-color mb-6">
        <h3 className="text-slate-900 text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
          <CircleUserRound size={20} className="text-primary" />
          Thông tin cơ bản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoDisplay
            label="Họ và tên"
            value={userInfo?.full_name}
            icon={UserIcon}
          />
          <InfoDisplay label="Email" value={userInfo?.email} icon={Mail} />
          <InfoDisplay
            label="Số điện thoại"
            value={userInfo?.phone_number}
            icon={Phone}
            sensitive
          />
          <InfoDisplay
            label="Giới tính"
            value={
              userInfo?.gender === "Male"
                ? "Nam"
                : userInfo?.gender === "Female"
                ? "Nữ"
                : userInfo?.gender === "Other"
                ? "Khác"
                : "Chưa cập nhật"
            }
            icon={UserIcon}
          />
        </div>
      </section>

      {/* Account Info */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-border-color mb-6">
        <h3 className="text-slate-900 text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
          <ShieldCheck size={20} className="text-primary" />
          Chi tiết tài khoản
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoDisplay
            label="Trạng thái"
            value={userInfo?.status}
            isStatus
            icon={ShieldCheck}
          />
          <InfoDisplay
            label="Ngày gia nhập"
            value={
              userInfo?.created_at
                ? new Date(userInfo.created_at).toLocaleDateString("vi-VN")
                : "N/A"
            }
            icon={Calendar}
          />
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-border-color">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-slate-900 text-lg font-bold flex items-center gap-2 mb-1">
              <Lock size={20} className="text-primary" />
              Bảo mật & Mật khẩu
            </h3>
            <p className="text-slate-500 text-sm font-medium">
              Bạn nên đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center h-10 px-5 bg-transparent border border-input-border hover:bg-slate-50 text-slate-900 rounded-lg text-sm font-bold transition-colors"
          >
            Đổi mật khẩu
          </button>
        </div>
      </section>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
