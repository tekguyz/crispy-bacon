
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react'; 

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch rendering errors in the component tree.
 */
// Fix: Explicitly extending React.Component ensures inheritance of props, state, and setState with correct generic types.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Initializing state in constructor with correct typing.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: state property is correctly initialized and inherited from React.Component.
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Fix: setState is correctly inherited and typed from React.Component.
    this.setState({ errorInfo });
  }

  public render(): ReactNode {
    // Fix: Accessing state property inherited from the base React.Component.
    const { hasError, error, errorInfo } = this.state;
    
    if (hasError) {
      // Standard fallback UI for unexpected application crashes.
      return (
        <div className="h-screen w-screen bg-zinc-950 text-red-400 flex flex-col items-center justify-center p-8 text-center font-sans">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h1 className="text-3xl font-bold mb-4 text-zinc-100">Oops! Something went wrong.</h1>
          <p className="text-lg text-zinc-400 mb-6">The application encountered an unexpected error.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RotateCw size={20} /> Refresh Page
          </button>
          {error && (
            <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-left max-w-xl overflow-auto custom-scrollbar">
              <pre className="text-xs whitespace-pre-wrap break-words text-red-200">
                {error.toString()}
                {errorInfo?.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    // Fix: Accessing props property inherited from the base React.Component.
    return this.props.children;
  }
}

export default ErrorBoundary;
