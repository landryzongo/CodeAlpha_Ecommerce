import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
                    <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-red-100">
                        <div className="bg-red-500 px-6 py-4">
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                ⚠️ Une erreur critique est survenue
                            </h1>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 mb-4">
                                L'application a rencontré une erreur inattendue. Voici les détails techniques pour le débogage :
                            </p>

                            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto mb-6">
                                <code className="text-red-400 font-mono text-sm block mb-2">
                                    {this.state.error && this.state.error.toString()}
                                </code>
                                <pre className="text-slate-500 text-xs font-mono whitespace-pre-wrap">
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Recharger la page
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        window.location.href = '/login';
                                    }}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Déconnexion d'urgence (Vider Cache)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
