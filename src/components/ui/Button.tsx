import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent font-medium transition-all",
          "focus-visible:ring-brand/30 focus-visible:ring-offset-bg-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Variants
          variant === "primary" && [
            "bg-brand text-white shadow-sm",
            "hover:bg-brand-dark hover:shadow active:scale-95",
          ],
          variant === "secondary" && [
            "border-border-strong bg-bg-card text-text-primary shadow-sm",
            "hover:border-brand/40 hover:bg-brand-light/45 hover:text-brand active:scale-95",
          ],
          variant === "ghost" && [
            "text-text-secondary",
            "hover:bg-brand-light/45 hover:text-brand active:scale-95",
          ],
          variant === "icon" && [
            "text-text-secondary rounded-full",
            "hover:border-brand/35 hover:bg-brand-light/45 hover:text-brand active:scale-95",
          ],
          // Sizes
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && (variant === "icon" ? "p-2" : "px-4 py-2 text-sm"),
          size === "lg" && "px-6 py-3 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
