
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ServiceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Service component error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-muted">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            We encountered an error while loading this service component. 
            {this.state.error && (
              <span className="block mt-1 text-sm font-mono bg-background p-2 rounded text-left overflow-x-auto">
                {this.state.error.toString()}
              </span>
            )}
          </p>
          <Button onClick={this.handleRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ServiceErrorBoundary;
