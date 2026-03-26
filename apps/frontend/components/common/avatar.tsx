export default function Avatar({
  avatar,
  name,
  size = "md",
}: {
  avatar: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-12 text-base",
    lg: "size-16 text-xl",
  };

  return (
    <div className={sizeClasses[size]}>
      {avatar && (
        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          <img src={avatar} className="object-cover w-full h-full" />
        </div>
      )}
      {!avatar && (
        <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold uppercase overflow-hidden">
          {name?.charAt(0) || "U"}
        </div>
      )}
    </div>
  );
}
