import { Home, CalendarDays, Wallet, ListChecks, BookOpen } from 'lucide-react'
import type { TabId } from '../App'

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: '홈', Icon: Home },
  { id: 'itinerary', label: '일정', Icon: CalendarDays },
  { id: 'budget', label: '예산', Icon: Wallet },
  { id: 'checklist', label: '체크', Icon: ListChecks },
  { id: 'guide', label: '가이드', Icon: BookOpen },
]

export default function TabNav({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 shadow-float backdrop-blur-xl">
      <div className="pb-safe-nav mx-auto flex max-w-lg items-center justify-around px-2 pt-1.5">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-current={active ? 'page' : undefined}
              className="press flex min-h-[48px] min-w-[56px] flex-col items-center justify-center gap-1 rounded-xl px-2"
            >
              <Icon
                size={23}
                strokeWidth={active ? 2.5 : 1.9}
                className={`transition-colors ${active ? 'text-accent' : 'text-mute'}`}
              />
              <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-accent' : 'text-mute'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
