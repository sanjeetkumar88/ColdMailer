"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const MotionSlot = motion(Slot);

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ variant = "primary", size = "md", asChild = false, children, className, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-white/20 bg-transparent hover:bg-white/5",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-11 px-8 text-base",
    };

    const Comp = asChild ? MotionSlot : motion.button;

    return (
      <Comp
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";
