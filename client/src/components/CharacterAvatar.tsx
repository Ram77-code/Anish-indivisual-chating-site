import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CharacterAvatarProps {
  name: string;
  src?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CharacterAvatar({ name, src, className, size = "md" }: CharacterAvatarProps) {
  // Generate initials
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Consistent generic colors based on name length
  const colors = [
    "bg-red-100 text-red-600",
    "bg-orange-100 text-orange-600",
    "bg-amber-100 text-amber-600",
    "bg-green-100 text-green-600",
    "bg-emerald-100 text-emerald-600",
    "bg-teal-100 text-teal-600",
    "bg-cyan-100 text-cyan-600",
    "bg-blue-100 text-blue-600",
    "bg-indigo-100 text-indigo-600",
    "bg-violet-100 text-violet-600",
    "bg-purple-100 text-purple-600",
    "bg-fuchsia-100 text-fuchsia-600",
    "bg-pink-100 text-pink-600",
    "bg-rose-100 text-rose-600",
  ];
  
  const colorClass = colors[name.length % colors.length];

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  return (
    <Avatar className={cn(sizeClasses[size], "border-2 border-white shadow-sm", className)}>
      <AvatarImage src={src || undefined} className="object-cover" />
      <AvatarFallback className={cn("font-semibold", colorClass)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
