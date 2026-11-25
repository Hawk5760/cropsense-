import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('CropSense UI Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-cream text-brand-dark flex items-center justify-center px-6">
          <div className="max-w-md w-full border border-brand-border bg-brand-light rounded-md p-8 text-center">
            <h1 className="font-playfair text-2xl text-brand-dark mb-3">
              Something went wrong
            </h1>
            <p className="text-sm text-brand-muted mb-6">
              An unexpected error interrupted this screen. Reload to restore your saved CropSense workspace.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-brand-dark text-white text-sm rounded-md hover:bg-brand-green transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
