import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"; // (วงเล็บ: Utility สำหรับรวม Tailwind classes)

interface DynamicSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full" | "none";
}

export function DynamicSkeleton({
  width = "100%",
  height = "20px",
  className,
  rounded = "md",
}: DynamicSkeletonProps) {
  // (วงเล็บ: Mapping ค่าความมนของขอบ)
  const borderRadius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
    none: "rounded-none",
  };

  return (
    <Skeleton
      className={cn(borderRadius[rounded], className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}
