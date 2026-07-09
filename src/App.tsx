import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import TabNav from './components/TabNav'
import HomeTab from './components/HomeTab'
import ItineraryTab from './components/ItineraryTab'
import BudgetTab from './components/BudgetTab'
import ChecklistTab from './components/ChecklistTab'
import GuideTab from './components/GuideTab'

export type TabId = 'home' | 'itinerary' | 'budget' | 'checklist' | 'guide'

const VIEWS: Record<TabId, () => React.ReactElement> = {
  home: HomeTab,
  itinerary: ItineraryTab,
  budget: BudgetTab,
  checklist: ChecklistTab,
  guide: GuideTab,
}

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const View = VIEWS[tab]

  return (
    <div className="min-h-dvh bg-page text-ink">
      <main className="pt-safe pb-content relative mx-auto max-w-lg px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.3, 0, 0.2, 1] }}
          >
            <View />
          </motion.div>
        </AnimatePresence>
      </main>
      <TabNav tab={tab} onChange={setTab} />
    </div>
  )
}
