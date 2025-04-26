import React from 'react';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  overlay?: boolean;
  className?: string;
  type?: 'spinner' | 'skeleton' | 'dots';
  delay?: number; // Delay in ms before showing the loading state
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
  fullPage = false,
  overlay = false,
  className = '',
  type = 'spinner',
  delay = 0,
}) => {
  const [show, setShow] = React.useState(delay === 0);

  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!show) return null;

  const spinnerSizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const skeletonSizes = {
    small: 'h-4',
    medium: 'h-8',
    large: 'h-12',
  };

  const renderLoadingIndicator = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-600 ${spinnerSizes[size]}`}></div>
        );
      case 'skeleton':
        return (
          <div className={`animate-pulse bg-gray-200 rounded ${skeletonSizes[size]} w-full max-w-md`}></div>
        );
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`animate-bounce rounded-full bg-primary-600 ${size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'}`} style={{ animationDelay: '0ms' }}></div>
            <div className={`animate-bounce rounded-full bg-primary-600 ${size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'}`} style={{ animationDelay: '150ms' }}></div>
            <div className={`animate-bounce rounded-full bg-primary-600 ${size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'}`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      default:
        return null;
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderLoadingIndicator()}
      {message && <p className={`mt-2 text-gray-600 ${textSizes[size]}`}>{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded-lg">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingState;
