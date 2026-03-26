"use client";
import DashboardCard from "@/components/common/dashboardCard";
import UserPersonalInformation from "@/components/user/userPersonalInformation";
import { useAuthStore } from "@/store/auth.store";
import {
  ArchiveRestore,
  Calendar,
  ChevronRight,
  CircleCheckBig,
  CirclePlus,
  Eye,
  FileSliders,
  FileText,
  Heart,
  History,
  Pencil,
  SquarePen,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getUserDashboardDataSWR } from "@/services/user.api";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getAuditActionDisplay } from "@/utils";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: dashboardData, isLoading } = useSWR(
    "user_dashboard_data",
    getUserDashboardDataSWR
  );

  const date = new Date();
  const formattedDate = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const openCreateListing = () => {
    router.replace("/listing-create");
  };

  const openListingManagement = () => {
    router.replace("/profile/listing-management");
  };

  const openEditProfile = () => {
    router.replace("/profile/personal-information/edit");
  };

  return (
    <main
      className=" w-full  transition-all duration-300 flex flex-col min-h-screen"
      id="main-content"
    >
      <div className=" mx-auto w-full p-4 ">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-text-main text-2xl lg:text-3xl font-black tracking-tight">
              Tổng quan
            </h2>
            <p className="text-text-secondary text-sm lg:text-base">
              Chào mừng,
              <span className="font-bold text-blue-500">
                {" "}
                {user!.full_name}!
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white border border-input-border rounded-lg text-sm font-bold shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-blue-500">
                <Calendar />
              </span>
              <span>Hôm nay: {formattedDate}</span>
            </div>
            <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Đăng tin</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <DashboardCard
            icon={FileText}
            title="Số bài đăng đã tạo"
            value={dashboardData?.stats?.total || 0}
            description="Tổng cộng"
            iconSize={25}
            iconColor="blue-500"
            bgIconColor="blue-100"
            isLoading={isLoading}
          />

          <DashboardCard
            icon={ArchiveRestore}
            title="Đang chờ duyệt"
            value={dashboardData?.stats?.pending || 0}
            description="Đang xử lý"
            iconSize={35}
            iconColor="yellow-500"
            textIconColor="yellow-600"
            bgIconColor="yellow-100"
            isLoading={isLoading}
          />

          <DashboardCard
            icon={Eye}
            title="Đang hiển thị"
            value={dashboardData?.stats?.published || 0}
            description="Công khai"
            iconSize={25}
            iconColor="green-600"
            bgIconColor="green-100"
            isLoading={isLoading}
          />
        </div>
        <div className="mb-8 lg:mb-10">
          <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">
              <Zap />
            </span>
            Hành động nhanh
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={openCreateListing}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-[#1069c4] text-white px-4 py-4 lg:px-6 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 touch-manipulation"
            >
              <span className="material-symbols-outlined">
                <CirclePlus />
              </span>
              <span>Đăng tin mới</span>
            </button>
            <button
              onClick={openListingManagement}
              className="flex items-center justify-center gap-2 bg-white border border-input-border text-text-main px-4 py-4 lg:px-6 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 touch-manipulation"
            >
              <span className="material-symbols-outlined">
                <FileSliders />
              </span>
              <span>Quản lý bài</span>
            </button>
            <button
              onClick={openEditProfile}
              className="flex items-center justify-center gap-2 bg-white border border-input-border text-text-main px-4 py-4 lg:px-6 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 touch-manipulation"
            >
              <span className="material-symbols-outlined">
                <SquarePen />
              </span>
              <span>Sửa hồ sơ</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Thông tin tài khoản */}
          <UserPersonalInformation />

          {/* Hoạt động gần dây */}
          <div className="flex flex-col h-full">
            <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">
                <History />
              </span>
              Hoạt động gần đây
            </h3>
            <div className="bg-white border border-input-border rounded-xl divide-y divide-input-border shadow-sm flex-1">
              {isLoading ? (
                <div className="p-8 text-center text-text-secondary text-sm">
                  Đang tải hoạt động...
                </div>
              ) : dashboardData?.activities?.length > 0 ? (
                dashboardData.activities.map((activity: any) => {
                  const { text, icon: Icon, color } = getAuditActionDisplay(activity.action);

                  return (
                    <div
                      key={activity.id}
                      className="p-4 flex items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            <Icon size={20} />
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold line-clamp-1">
                            {text}
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            {(() => {
                              const dateValue = activity.createdAt || activity.created_at;
                              if (!dateValue) return "Không rõ thời gian";
                              const date = new Date(dateValue);
                              if (isNaN(date.getTime())) return "Thời gian không hợp lệ";
                              
                              return formatDistanceToNow(date, {
                                addSuffix: true,
                                locale: vi,
                              });
                            })()}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-sm">
                        <ChevronRight size={20} />
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-text-secondary text-sm">
                  Chưa có hoạt động nào gần đây
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
