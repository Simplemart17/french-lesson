import * as React from "react";

export type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center rounded-full bg-gray-200 p-0 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 data-[state=checked]:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <span className="pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out peer-checked:translate-x-5" />
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };