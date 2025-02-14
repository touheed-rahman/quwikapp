
import React, { Component, ErrorInfo } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    toast({
      title: "An error occurred",
      description: "You have been redirected to the home page",
      variant: "destructive",
    });
  }

  public render() {
    if (this.state.hasError) {
      return <Navigate to="/" replace />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
