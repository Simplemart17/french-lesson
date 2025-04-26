import React from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  retryAction?: () => void;
  retry?: () => void; // Alias for retryAction for backward compatibility
  className?: string;
  details?: string;
  showDetails?: boolean;
  type?: 'error' | 'warning' | 'info';
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  }[];
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  retryAction,
  retry,
  className = '',
  details,
  showDetails: initialShowDetails = false,
  type = 'error',
  actions = [],
}) => {
  const [showDetails, setShowDetails] = React.useState(initialShowDetails);

  // Use retry as fallback for retryAction
  const handleRetry = retryAction || retry;

  // Determine colors based on type
  const colors = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      title: 'text-red-800',
      text: 'text-red-700',
      button: 'text-red-800 bg-red-50 hover:bg-red-100 border-red-300',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
      button: 'text-yellow-800 bg-yellow-50 hover:bg-yellow-100 border-yellow-300',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      title: 'text-blue-800',
      text: 'text-blue-700',
      button: 'text-blue-800 bg-blue-50 hover:bg-blue-100 border-blue-300',
    },
  };

  const color = colors[type];

  // Render the appropriate icon based on type
  const renderIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg
            className={`w-5 h-5 ${color.icon}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className={`w-5 h-5 ${color.icon}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className={`w-5 h-5 ${color.icon}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 ${color.bg} border ${color.border} rounded-lg ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {renderIcon()}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${color.title}`}>{title || type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <div className={`mt-1 text-sm ${color.text}`}>{message}</div>

          {details && (
            <div className="mt-2">
              <button
                type="button"
                className={`text-sm ${color.text} underline focus:outline-none`}
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>

              {showDetails && (
                <pre className={`mt-2 p-2 text-xs ${color.text} bg-white bg-opacity-50 rounded overflow-auto max-h-40`}>
                  {details}
                </pre>
              )}
            </div>
          )}

          {(handleRetry || actions.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {handleRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className={color.button}
                >
                  Try Again
                </Button>
              )}

              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                  className={action.variant ? '' : color.button}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
