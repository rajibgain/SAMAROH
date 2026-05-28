import React from 'react';
import '../styles/errorBoundary.css';

/**
 * Error Boundary Component
 * Catches React rendering errors and displays a user-friendly error page
 * 
 * Features:
 * - Catches render errors, lifecycle errors, and constructor errors
 * - Shows detailed error info in development mode only
 * - Provides recovery options (Try Again / Go Home)
 * - Tracks error frequency
 * - Beautiful UI matching SAMAROH theme
 * 
 * Usage:
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      errorTimestamp: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Catch error details and log them
   */
  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('=== ERROR BOUNDARY CAUGHT ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);

    // Update state with error information
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
      errorTimestamp: new Date().toLocaleTimeString(),
    }));

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reset error boundary state
   */
  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Navigate to home page
   */
  goHome = () => {
    this.resetError();
    window.location.href = '/';
  };

  /**
   * Reload the page
   */
  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      const { error, errorInfo, errorCount, errorTimestamp } = this.state;

      return (
        <div className="errorBoundary__container">
          <div className="errorBoundary__backdrop"></div>
          
          <div className="errorBoundary__content">
            {/* Error Icon */}
            <div className="errorBoundary__icon">⚠️</div>

            {/* Error Title */}
            <h1 className="errorBoundary__title">Oops! Something went wrong</h1>

            {/* User-friendly message */}
            <p className="errorBoundary__message">
              We encountered an unexpected error while loading this page. 
              Don't worry, we've logged this issue and our team has been notified.
            </p>

            {/* Development mode error details */}
            {isDevelopment && error && (
              <div className="errorBoundary__devInfo">
                <details className="errorBoundary__details">
                  <summary className="errorBoundary__summary">
                    📋 Development Details (Error #{this.state.errorCount})
                  </summary>
                  
                  <div className="errorBoundary__detailsContent">
                    {errorTimestamp && (
                      <p className="errorBoundary__timestamp">
                        <strong>Time:</strong> {errorTimestamp}
                      </p>
                    )}
                    
                    <div className="errorBoundary__errorBlock">
                      <p className="errorBoundary__label">Error Message:</p>
                      <pre className="errorBoundary__code">{error.toString()}</pre>
                    </div>

                    {error.stack && (
                      <div className="errorBoundary__errorBlock">
                        <p className="errorBoundary__label">Stack Trace:</p>
                        <pre className="errorBoundary__code">{error.stack}</pre>
                      </div>
                    )}

                    {errorInfo && errorInfo.componentStack && (
                      <div className="errorBoundary__errorBlock">
                        <p className="errorBoundary__label">Component Stack:</p>
                        <pre className="errorBoundary__code">{errorInfo.componentStack}</pre>
                      </div>
                    )}

                    {errorCount > 1 && (
                      <p className="errorBoundary__warning">
                        ⚠️ This error has occurred {errorCount} times. 
                        Consider refreshing the page or clearing your browser cache.
                      </p>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="errorBoundary__actions">
              <button
                className="errorBoundary__btn errorBoundary__btn--primary"
                onClick={this.resetError}
                title="Try to render the component again"
              >
                🔄 Try Again
              </button>
              
              <button
                className="errorBoundary__btn errorBoundary__btn--secondary"
                onClick={this.goHome}
                title="Return to home page"
              >
                🏠 Go Home
              </button>

              {isDevelopment && (
                <button
                  className="errorBoundary__btn errorBoundary__btn--tertiary"
                  onClick={this.reloadPage}
                  title="Reload the entire page"
                >
                  🔁 Reload Page
                </button>
              )}
            </div>

            {/* Footer note */}
            <p className="errorBoundary__footer">
              If this error persists, please contact support at support@samaroh.com
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
