"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartData {
  postGrowth: { name: string; count: number }[];
  userGrowth: { name: string; count: number }[];
  listingsByType: { name: string; value: number }[];
}

const COLORS = ["#137fec", "#4ade80", "#fbbf24", "#f87171", "#a78bfa", "#2dd4bf"];

export const DashboardCharts = ({ charts }: { charts: ChartData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      
      {/* Post Growth Chart */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 shadow-sm border border-[#e7edf3] dark:border-slate-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-500 text-sm">Số lượng bài đăng mới trong 30 ngày qua</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-4 h-4 mr-1" />
            </span>
          </div>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.postGrowth} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#137fec" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="count" stroke="#137fec" strokeWidth={3} fillOpacity={1} fill="url(#colorPost)" activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 shadow-sm border border-[#e7edf3] dark:border-slate-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-slate-500 text-sm">Tăng trưởng người dùng 30 ngày qua</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-4 h-4 mr-1" />
            </span>
          </div>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.userGrowth} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" fill="#137fec" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Listing Type Pie Chart */}
      <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 shadow-sm border border-[#e7edf3] dark:border-slate-700">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-[#0d141b] dark:text-white text-lg font-bold">Phân bổ Bất động sản</h3>
            <p className="text-slate-500 text-sm">Theo từng loại hình cho thuê</p>
          </div>
        </div>
        <div className="h-[240px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts.listingsByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {charts.listingsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
