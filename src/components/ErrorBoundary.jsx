import { Component } from 'react'
import { reportError } from '../lib/errorReporting.js'

// Sans ça, une erreur de rendu dans n'importe quel écran fait planter toute
// l'app en page blanche silencieuse, sans aucun recours pour l'utilisateur.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Erreur non gérée', error, info)
    reportError(error)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.href = '/home'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <span className="text-4xl" aria-hidden="true">
          🌱
        </span>
        <h1 className="text-xl font-bold text-navy-800 dark:text-sand-100">
          Un souci est survenu
        </h1>
        <p className="max-w-xs text-sm text-navy-800/70 dark:text-sand-100/70">
          Rien de grave — tes données sont en sécurité. Essaie de revenir à l'accueil.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Retour à l'accueil
        </button>
      </main>
    )
  }
}
