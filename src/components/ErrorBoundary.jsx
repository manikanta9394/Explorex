import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <div className="error-card">
            <AlertTriangle size={28} className="error-icon" />
            <h4>Something went wrong</h4>
            <p>We couldn't load directions or details right now.</p>
            <button className="error-reset-btn" onClick={this.handleReset}>
              <RotateCcw size={14} /> Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
