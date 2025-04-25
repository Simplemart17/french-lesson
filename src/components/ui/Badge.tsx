import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-900 text-white hover:bg-gray-800",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border border-gray-200 text-gray-900 hover:bg-gray-100 hover:text-gray-900",
      success: "bg-green-100 text-green-800 hover:bg-green-200",
      warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      error: "bg-red-100 text-red-800 hover:bg-red-200",
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge }; 