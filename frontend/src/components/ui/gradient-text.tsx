import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "default";
}

export function GradientText({ children, className, variant = "primary" }: GradientTextProps) {
  const gradientClass = variant === "primary" ? "text-gradient-primary" : "text-gradient";
  
  return (
    <span className={cn(gradientClass, className)}>
      {children}
    </span>
  );
}
