import { LucideIcon, icons, HelpCircle } from "lucide-react";

interface IconProps {
  icon: keyof typeof icons | LucideIcon;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({
  icon,
  size = 20,
  color = "#137fec",
  className,
}: IconProps) {
  // If icon is a string, get the component from Lucide icons object
  const LucideIconComponent =
    typeof icon === "string" ? icons[icon as keyof typeof icons] : icon;

  // Fallback if icon name doesn't exist
  const FinalIcon = LucideIconComponent || HelpCircle;

  return (
    <span
      className={`inline-flex items-center justify-center ${className ?? ""}`}
    >
      <FinalIcon size={size} color={color} />
    </span>
  );
}
