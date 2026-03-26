import { LucideIcon } from "lucide-react";

interface RecommendCard {
  icon: LucideIcon;
  iconSize?: number;
  iconColor?: number;
  title: string;
  description: string;
}

export default function RecommendCard({
  icon: Icon,
  title,
  description,
  iconSize,
  iconColor,
}: RecommendCard) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#e7f2fd] flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-primary text-3xl">
          <Icon
            size={iconSize ?? 40}
            color={iconColor ? `${iconColor}` : "#137fec"}
          />
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-900  mb-3">{title}</h3>
      <p className="text-slate-500  leading-relaxed">{description}</p>
    </div>
  );
}
