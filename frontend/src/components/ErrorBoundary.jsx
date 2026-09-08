import React from 'react';

/**
 * ErrorBoundary — Composant de capture d'erreurs React.
 * 
 * Enveloppe l'arbre de composants pour intercepter toute erreur JS inattendue
 * et afficher un écran de repli au lieu d'un crash en écran blanc.
 * 
 * Utilisation dans App.jsx :
 *   <ErrorBoundary>
 *     <Router>...</Router>
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Erreur non capturée :', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#020617',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif',
            color: '#fff',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, marginBottom: 32,
              boxShadow: '0 0 40px rgba(102,126,234,0.4)',
            }}
          >
            ⚠️
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Oops, quelque chose s'est mal passé
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 400, marginBottom: 40, lineHeight: 1.6 }}>
            Une erreur inattendue est survenue. Essaie de revenir à l'accueil.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '14px 36px', borderRadius: 50,
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
            }}
          >
            Retourner à l'accueil
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: 40, padding: '20px',
              background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)',
              borderRadius: 12, fontSize: 12, color: '#f87171',
              maxWidth: 600, textAlign: 'left', overflowX: 'auto', whiteSpace: 'pre-wrap',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
