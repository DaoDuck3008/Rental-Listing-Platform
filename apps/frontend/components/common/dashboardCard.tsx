import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  description?: string;
  iconSize?: number;
  iconColor: string;
  textIconColor?: string;
  bgIconColor?: string;
  isLoading?: boolean;
}

export default function DashboardCard({
  icon: Icon,
  title,
  value,
  description,
  iconSize,
  iconColor,
  textIconColor,
  bgIconColor,
  isLoading,
}: DashboardCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-input-border rounded-xl p-5 lg:p-6 shadow-sm animate-pulse flex flex-col gap-3">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-8 w-16 bg-slate-200 rounded mt-2"></div>
      </div>
    );
  }
  return (
    <div
      className={`bg-white border border-input-border rounded-xl p-5 lg:p-6 shadow-sm hover:shadow-md  transition-shadow flex flex-col gap-3 group`}
    >
      <div className="flex justify-between items-start">
        <p className="text-text-secondary text-sm font-semibold">{title}</p>
        <div
          className={`p-2 bg-${bgIconColor} rounded-lg text-${
            textIconColor || iconColor
          } group-hover:bg-${iconColor} group-hover:text-white transition-colors flex items-center justify-center`}
        >
          <Icon size={iconSize || 20} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-text-main text-2xl lg:text-3xl font-extrabold">
          {value}
        </p>
        {description && (
          <span className="text-[#078838] text-xs lg:text-sm font-bold pb-1 bg-green-50 px-2 py-0.5 rounded-full">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
