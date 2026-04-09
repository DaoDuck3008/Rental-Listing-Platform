"use client";

import React from "react";
import { Users, Building2, Clock, AlertTriangle } from "lucide-react";

interface OverviewData {
  totalUsers: number;
  totalPosts: number;
  pendingPosts: number;
  reportedPosts: number;
  userGrowthPercent: number;
  postGrowthPercent: number;
}

export const DashboardStats = ({ overview }: { overview: OverviewData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Total Users */}
      <div className="flex flex-col gap-1 rounded-xl p-6 bg-white  shadow-sm border border-[#e7edf3] ">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-blue-50  text-blue-600  p-2 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded ${overview.userGrowthPercent >= 0 ? "text-green-600 bg-green-50 " : "text-red-600 bg-red-50 "}`}>
            {overview.userGrowthPercent > 0 ? "+" : ""}{overview.userGrowthPercent}%
          </span>
        </div>
        <p className="text-[#64748b] text-sm font-medium leading-normal">Tổng số người dùng</p>
        <p className="text-[#0d141b]  text-2xl font-bold leading-tight">
          {new Intl.NumberFormat().format(overview.totalUsers)}
        </p>
      </div>

      {/* Total Posts */}
      <div className="flex flex-col gap-1 rounded-xl p-6 bg-white  shadow-sm border border-[#e7edf3] ">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-indigo-50  text-indigo-600  p-2 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded ${overview.postGrowthPercent >= 0 ? "text-green-600 bg-green-50 " : "text-red-600 bg-red-50 "}`}>
            {overview.postGrowthPercent > 0 ? "+" : ""}{overview.postGrowthPercent}%
          </span>
        </div>
        <p className="text-[#64748b] text-sm font-medium leading-normal">Tổng số bài đăng</p>
        <p className="text-[#0d141b]  text-2xl font-bold leading-tight">
          {new Intl.NumberFormat().format(overview.totalPosts)}
        </p>
      </div>

      {/* Pending Posts */}
      <div className="flex flex-col gap-1 rounded-xl p-6 bg-white  shadow-sm border-l-4 border-yellow-400 border-y border-r  ">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-yellow-50  text-yellow-600  p-2 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <span className="text-yellow-700 bg-yellow-50  text-xs font-bold px-2 py-1 rounded">
            Cần xử lý
          </span>
        </div>
        <p className="text-[#64748b] text-sm font-medium leading-normal">Bài đăng chờ duyệt</p>
        <p className="text-[#0d141b]  text-2xl font-bold leading-tight">
          {new Intl.NumberFormat().format(overview.pendingPosts)}
        </p>
      </div>

      {/* Reported Posts */}
      <div className="flex flex-col gap-1 rounded-xl p-6 bg-white  shadow-sm border-l-4 border-red-500 border-y border-r  ">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-red-50  text-red-600  p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <span className="text-red-700 bg-red-50  text-xs font-bold px-2 py-1 rounded">
            Quan trọng
          </span>
        </div>
        <p className="text-[#64748b] text-sm font-medium leading-normal flex items-center gap-2">
          Bài đăng bị báo cáo
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded uppercase font-bold  ">Đang phát triển</span>
        </p>
        <p className="text-[#0d141b]  text-2xl font-bold leading-tight">
          {new Intl.NumberFormat().format(overview.reportedPosts)}
        </p>
      </div>
    </div>
  );
};
