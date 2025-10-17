interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'error' | 'warning';
  title?: string;
}

export function ErrorAlert({ 
  message, 
  onDismiss, 
  variant = 'error',
  title 
}: ErrorAlertProps) {
  const styles = {
    error: {
      bg: 'bg-red-50',
      icon: 'text-red-400',
      text: 'text-red-800',
      hover: 'hover:text-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-400', 
      text: 'text-yellow-800',
      hover: 'hover:text-yellow-500'
    }
  }[variant];

  return (
    <div className={`rounded-md ${styles.bg} p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className={`h-5 w-5 ${styles.icon}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${styles.text} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${styles.text}`}>{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`inline-flex ${styles.icon} ${styles.hover}`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}