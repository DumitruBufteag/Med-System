import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ServerErrorPage } from '../pages/errors';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

/** Catches render-time errors so a broken page does not blank the whole app. */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Eroare neprevăzută în interfață:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    // An exception that escapes a component is the client-side equivalent of a
    // 500 — the same page the failing services render.
    return <ServerErrorPage detail={this.state.message} />;
  }
}
