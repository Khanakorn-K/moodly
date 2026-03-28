import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/cors/lib/utils";

interface DynamicSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | "none";
}

export function DynamicSkeleton({
  width = "100%",
  height = "20px",
  className,
  rounded = "md",
}: DynamicSkeletonProps) {
  // (วงเล็บ: Check if string is a Tailwind class)
  const isTailwindWidth = typeof width === "string" && width.startsWith("w-");
  const isTailwindHeight =
    typeof height === "string" && height.startsWith("h-");

  const borderRadius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
    none: "rounded-none",
  };

  return (
    <Skeleton
      className={cn(
        borderRadius[rounded],
        isTailwindWidth ? width : "",
        isTailwindHeight ? height : "",
        className,
      )}
      style={{
        width: !isTailwindWidth
          ? typeof width === "number"
            ? `${width}px`
            : width
          : undefined,
        height: !isTailwindHeight
          ? typeof height === "number"
            ? `${height}px`
            : height
          : undefined,
      }}
    />
  );
}
