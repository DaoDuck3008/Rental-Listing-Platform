"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuditLogById } from "@/services/auditLog.api";
import { toast } from "react-toastify";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  User,
  Activity,
  Box,
  MonitorSmartphone,
  Globe,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getAuditActionDisplay } from "@/utils";

interface AuditLogDetail {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_data: any;
  new_data: any;
  ip_address: string;
  user_agent: string;
  createdAt: string;
  user?: {
    id: string;
    full_name: string;
    email: string;
    avatar: string;
  };
}

export default function AuditLogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [log, setLog] = useState<AuditLogDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogDetail = async () => {
      try {
        if (!id) return;
        const res = await getAuditLogById(id as string);
        if (res?.data) {
          setLog(res.data);
        } else {
          toast.error("Không tìm thấy dữ liệu.");
          router.push("/admin/audit-logs");
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải chi tiết lịch sử.");
        router.push("/admin/audit-logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogDetail();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải dữ liệu chi tiết...</p>
      </div>
    );
  }

  if (!log) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">
              Chi tiết Lịch sử <span className="text-blue-600">#{log.id.substring(0, 8)}...</span>
            </h1>
            {(() => {
              const { text, color } = getAuditActionDisplay(log.action);
              return (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${color}`}>
                  {text}
                </span>
              );
            })()}
          </div>
          <p className="text-slate-500 flex items-center gap-2 text-sm">
            <Clock size={14} /> Thời gian thực hiện:{" "}
            {new Date(log.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <Link
          href="/admin/audit-logs"
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
            <User size={16} /> <span>Người Tác Động</span>
          </div>
          <div className="flex items-center gap-3">
            {log.user ? (
              <>
                <img
                  src={log.user.avatar || "/placeholder.png"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-slate-800 truncate">{log.user.full_name}</span>
                  <span className="text-xs text-slate-500 truncate">{log.user.email}</span>
                </div>
              </>
            ) : (
              <span className="italic text-slate-500 font-medium">
                Hệ thống (Tự động)
              </span>
            )}
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
          {(() => {
            const { text, icon: Icon, color } = getAuditActionDisplay(log.action);
            return (
              <>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <Icon size={16} className={color.split(" ")[1]} /> <span>Hành Động</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-lg">
                    {text}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                    {log.action}
                  </span>
                </div>
              </>
            );
          })()}
        </div>

        {/* Entity Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
            <Box size={16} /> <span>Đối Tượng (Entity)</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-slate-800 text-lg truncate">
              {log.entity_type}
            </span>
            <span className="text-xs text-slate-500 font-mono truncate">
              ID: {log.entity_id}
            </span>
          </div>
        </div>

        {/* App/Client Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
            <MonitorSmartphone size={16} /> <span>Client & IP</span>
          </div>
          <div className="flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center gap-2 text-sm">
              <Globe size={14} className="text-blue-500" />
              <span className="font-mono text-slate-800 bg-slate-100 px-1 rounded">{log.ip_address}</span>
            </div>
            <span className="text-xs text-slate-500 truncate" title={log.user_agent}>
              {log.user_agent}
            </span>
          </div>
        </div>
      </div>

      {/* Main Data Section */}
      <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">Chi Tiết Dữ Liệu</h2>
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner flex flex-col xl:flex-row gap-8">
        
        {/* Old Data Box */}
        {log.old_data && Object.keys(log.old_data).length > 0 ? (
          <div className="flex-1 flex flex-col bg-white border border-rose-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-rose-50 px-5 py-4 border-b border-rose-200 flex items-center justify-between">
              <span className="font-bold text-rose-700 uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Dữ liệu cũ
              </span>
            </div>
            <div className="p-5 flex-1 overflow-auto max-h-[600px]">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                {JSON.stringify(log.old_data, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}


        {/* New Data Box */}
        {log.new_data && Object.keys(log.new_data).length > 0 ? (
          <div className="flex-1 flex flex-col bg-white border border-emerald-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-emerald-700 uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Dữ liệu mới
              </span>
            </div>
            <div className="p-5 flex-1 overflow-auto max-h-[600px]">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                {JSON.stringify(log.new_data, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}

        {/* Empty State */}
        {!log.old_data && !log.new_data && (
          <div className="w-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Activity size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Không có JSON Data</h3>
            <p className="text-slate-500 text-sm">Hành động này không lưu dữ liệu chi tiết.</p>
          </div>
        )}
      </div>
    </div>
  );
}
