import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className = "", 
      variant = "default", 
      size = "default", 
      isLoading = false,
      disabled,
      children,
      ...props 
    }, 
    ref
  ) => {
    const variantClasses = {
      default: "bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900",
      destructive: "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500",
      outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-gray-100",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-100",
      ghost: "hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-gray-100",
      link: "text-gray-900 underline-offset-4 hover:underline focus-visible:outline-gray-100",
      success: "bg-green-600 text-white hover:bg-green-700 focus-visible:outline-green-600",
    };

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };
    
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="w-4 h-4 mr-2 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };