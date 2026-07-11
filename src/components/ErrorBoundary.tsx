import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-page px-8 text-center text-ink">
          <span className="text-4xl">🌨️</span>
          <div>
            <p className="text-lg font-extrabold">화면을 그리다 문제가 생겼어요</p>
            <p className="mt-1 text-sm text-sub">새로고침하면 대부분 해결돼요. 기록은 안전하게 저장돼 있어요.</p>
          </div>
          <button
            onClick={() => location.reload()}
            className="press min-h-[44px] rounded-2xl bg-accent px-6 text-sm font-bold text-white"
          >
            새로고침
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
