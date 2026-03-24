import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-academy-bg p-4">
            <div className="max-w-md w-full text-center">
              <h1 className="text-2xl font-bold text-academy-dark mb-2">⚠️ Errore</h1>
              <p className="text-academy-gray mb-4">Si è verificato un errore imprevisto.</p>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-2 bg-academy-blue text-white rounded-lg font-semibold hover:bg-academy-light-blue"
              >
                Torna alla Home
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
