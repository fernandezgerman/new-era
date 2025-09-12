import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can integrate logging here if needed
    if (typeof this.props.onError === 'function') {
      try { this.props.onError(error, errorInfo); } catch (_) {}
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === 'function') {
      try { this.props.onReset(); } catch (_) {}
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return typeof fallback === 'function' ? fallback({ error, resetErrorBoundary: this.handleReset }) : fallback;
      }
      // Default fallback UI
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded">
          <div className="text-red-700 font-semibold mb-2">Ocurrió un error al cargar esta sección.</div>
          {process.env.NODE_ENV !== 'production' && error && (
            <div className="text-xs text-red-600 mb-2 whitespace-pre-wrap">{String(error?.message || error)}</div>
          )}
          <button type="button" onClick={this.handleReset} className="px-3 py-1 bg-red-600 text-white rounded">
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
