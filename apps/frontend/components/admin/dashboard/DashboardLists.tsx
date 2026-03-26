"use client";

import React from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import ModerationTableBody from "@/components/admin/ModerationTableBody";

interface ListData {
  pendingListings: any[];
  recentPosts: any[];
}

export const DashboardLists = ({ lists }: { lists: ListData }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Pending Posts Table */}
      <div className="xl:col-span-2 flex flex-col rounded-xl bg-white dark:bg-[#1a202c] shadow-sm border border-[#e7edf3] dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#e7edf3] dark:border-slate-700">
          <h3 className="text-[#0d141b] dark:text-white text-lg font-bold">Bài đăng chờ duyệt</h3>
          <Link href="/admin/moderation" className="text-sm font-semibold text-primary hover:text-blue-700">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ảnh</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Thông tin bài đăng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Giá & Địa chỉ</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center font-display">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Thời gian</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right font-display">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {lists.pendingListings?.length > 0 ? (
                lists.pendingListings.map((listing) => (
                  <ModerationTableBody
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    creator_name={listing.owner?.full_name || "Người dùng"}
                    address={listing.address}
                    price={Number(listing.price)}
                    status={listing.status}
                    createdAt={listing.created_at || listing.createdAt}
                    img_url={listing.images?.[0]?.image_url}
                    onRefresh={() => window.location.reload()}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Không có bài đăng nào đang chờ duyệt
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="flex flex-col gap-6">
        {/* Critical Alerts */}
        <div className="flex flex-col rounded-xl bg-white dark:bg-[#1a202c] shadow-sm border border-[#e7edf3] dark:border-slate-700">
          <div className="flex items-center gap-2 p-5 border-b border-[#e7edf3] dark:border-slate-700">
            <AlertCircle className="text-red-500" />
            <h3 className="text-[#0d141b] dark:text-white text-lg font-bold">Thông báo quan trọng</h3>
          </div>
          <div className="flex flex-col p-2 relative">
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 z-10 flex items-center justify-center rounded-b-xl backdrop-blur-[1px]">
               <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-xs font-bold uppercase">Đang phát triển</span>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors opacity-50">
              <div className="size-2 rounded-full bg-red-500 mt-2 shrink-0"></div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-[#0d141b] dark:text-white">Bài đăng #482 bị báo cáo 5 lần</p>
                <p className="text-xs text-slate-500">Lý do: Lừa đảo tiền cọc. Hãy kiểm tra ngay.</p>
                <button className="self-start mt-1 text-xs font-semibold text-primary hover:underline">Xem chi tiết</button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors opacity-50">
              <div className="size-2 rounded-full bg-yellow-500 mt-2 shrink-0"></div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-[#0d141b] dark:text-white">Hệ thống báo cáo spam</p>
                <p className="text-xs text-slate-500">Phát hiện người dùng user_99 spam bài viết.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts (Condensed) */}
        <div className="flex flex-col rounded-xl bg-white dark:bg-[#1a202c] shadow-sm border border-[#e7edf3] dark:border-slate-700 flex-1">
          <div className="flex items-center justify-between p-5 border-b border-[#e7edf3] dark:border-slate-700">
            <h3 className="text-[#0d141b] dark:text-white text-lg font-bold">Bài đăng mới nhất</h3>
            <Link href="/admin/listings" className="text-sm font-semibold text-primary hover:text-blue-700">Xem thêm</Link>
          </div>
          <div className="flex flex-col p-2">
            {lists.recentPosts?.length > 0 ? (
                lists.recentPosts.slice(0, 3).map((listing, index) => (
                    <a key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">
                    <div
                        className="size-10 rounded-lg bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url("${listing.images?.[0]?.image_url || 'https://via.placeholder.com/150'}")` }}
                    ></div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white truncate">{listing.title || 'Không tiêu đề'}</p>
                        <p className="text-xs text-slate-500">
                          {(() => {
                            const dateValue = listing.createdAt || listing.created_at;
                            if (!dateValue) return "N/A";
                            const d = new Date(dateValue);
                            if (isNaN(d.getTime())) return "N/A";
                            return formatDistanceToNow(d, {
                              addSuffix: true,
                              locale: vi,
                            });
                          })()}
                          {" "}• {listing.status === 'PUBLISHED' ? 'Đã duyệt' : (listing.status === 'PENDING' ? 'Chờ duyệt' : 'Bản nháp')}
                        </p>
                    </div>
                    <span className={`size-2 rounded-full ${listing.status === 'PUBLISHED' ? 'bg-green-500' : (listing.status === 'PENDING' ? 'bg-yellow-400' : 'bg-slate-400')}`}></span>
                    </a>
                ))
            ) : (
                <div className="p-4 text-center text-slate-500 text-sm">Chưa có bài đăng nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
