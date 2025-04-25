import * as React from "react";

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className = "", pressed, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={pressed}
        data-state={pressed ? "on" : "off"}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900 ${className}`}
        {...props}
      />
    );
  }
);
Toggle.displayName = "Toggle";

export { Toggle }; 