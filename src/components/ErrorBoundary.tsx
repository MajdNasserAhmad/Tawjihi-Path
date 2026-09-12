import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-950 flex flex-col items-center justify-center font-cairo p-6" dir="rtl">
          <div className="bg-slate-900 border-2 border-red-500 rounded-2xl p-8 max-w-2xl w-full text-white shadow-2xl">
            <h1 className="text-3xl font-bold text-red-500 mb-4 flex items-center gap-3">
              <span className="text-4xl">⚠️</span> عذراً، تعطل التطبيق!
            </h1>
            <p className="text-slate-300 mb-6 text-lg">
              حدث خطأ غير متوقع أثناء عرض هذه الصفحة. يرجى التقاط صورة لهذه الشاشة حتى نتمكن من إصلاحه.
            </p>
            
            <div className="bg-black rounded-lg p-4 font-mono text-left mb-6 overflow-x-auto" dir="ltr">
              <div className="text-red-400 font-bold mb-2">Error: {this.state.error?.message}</div>
              <div className="text-slate-400 text-sm whitespace-pre-wrap">{this.state.error?.stack}</div>
            </div>

            {this.state.errorInfo && (
              <div className="bg-black/50 rounded-lg p-4 font-mono text-left mb-6 overflow-x-auto text-xs" dir="ltr">
                <div className="text-orange-300 mb-2">Component Stack:</div>
                <div className="text-slate-500 whitespace-pre-wrap">{this.state.errorInfo.componentStack}</div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition"
                onClick={() => window.location.href = '/'}
              >
                العودة للصفحة الرئيسية
              </button>
              <button
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition"
                onClick={() => window.location.reload()}
              >
                تحديث الصفحة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
