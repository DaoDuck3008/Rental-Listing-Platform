"use client";

import useSWR from "swr";
import { getDashboardOverview, getDashboardCharts, getDashboardPieChart, getDashboardRecent } from "@/services/dashboard.api";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";
import { DashboardLists } from "@/components/admin/dashboard/DashboardLists";
import LoadingOverlay from "@/components/common/loadingOverlay";

export default function DashboardAdminPage() {
  const {
    data: overview,
    error: errOverview,
    isLoading: loadingOverview,
  } = useSWR("dashboard_overview", getDashboardOverview);
  
  const {
    data: growthCharts,
    error: errCharts,
    isLoading: loadingCharts,
  } = useSWR("dashboard_charts", getDashboardCharts);
  
  const {
    data: listingsByType,
    error: errPie,
    isLoading: loadingPie,
  } = useSWR("dashboard_pie_chart", getDashboardPieChart);
  
  const {
    data: lists,
    error: errLists,
    isLoading: loadingLists,
  } = useSWR("dashboard_recent", getDashboardRecent);

  const isLoading =
    loadingOverview || loadingCharts || loadingPie || loadingLists;
  const error = errOverview || errCharts || errPie || errLists;

  if (isLoading) return <LoadingOverlay message="Đang tải dữ liệu dashboard" />;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Lỗi khi tải dữ liệu dashboard: {error.message}
      </div>
    );

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden relative">

      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-300 mx-auto flex flex-col gap-6 md:gap-8 pb-10">
          {/* Page Heading */}
          <div className="flex flex-col gap-1">
            <h2 className="text-text-main  text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">
              Tổng quan hệ thống
            </h2>
            <p className="text-text-secondarytext-sm md:text-base font-medium">
              Chào mừng trở lại, Quản trị viên.
            </p>
          </div>

          <DashboardStats overview={overview} />

          <DashboardCharts
            charts={{
              postGrowth: growthCharts?.postGrowth,
              userGrowth: growthCharts?.userGrowth,
              listingsByType: listingsByType,
            }}
          />

          <DashboardLists lists={lists} />
        </div>
      </div>
    </div>
  );
}
