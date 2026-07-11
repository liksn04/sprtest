import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { DatabaseBackup, Copy, Check, Download } from 'lucide-react'

const KEYS = [
  'checklist-v1',
  'itinerary-done-v1',
  'expenses-v1',
  'flight-price-log-v1',
  'flight-scenario-v1',
  'jpy-rate-v1',
  'jpy-rate-manual-v1',
  'jpy-amount-v1',
]

/** Export/import all app data as JSON — the safety net until real sync exists. */
export default function BackupCard() {
  const [copied, setCopied] = useState(false)
  const [importing, setImporting] = useState(false)
  const [paste, setPaste] = useState('')
  const [error, setError] = useState('')

  const exportData = async () => {
    const payload: Record<string, unknown> = { _app: 'sapporo-trip-guide', _at: new Date().toISOString() }
    for (const k of KEYS) {
      const raw = localStorage.getItem(k)
      if (raw !== null) payload[k] = JSON.parse(raw)
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('클립보드 접근이 막혀 있어요. 사파리 설정을 확인해 주세요.')
    }
  }

  const importData = () => {
    setError('')
    try {
      const data = JSON.parse(paste)
      if (data._app !== 'sapporo-trip-guide') throw new Error('wrong app')
      for (const k of KEYS) {
        if (k in data) localStorage.setItem(k, JSON.stringify(data[k]))
      }
      location.reload()
    } catch {
      setError('백업 데이터 형식이 아니에요. 내보내기로 복사한 내용을 그대로 붙여넣어 주세요.')
    }
  }

  return (
    <section className="rounded-3xl bg-card p-5 shadow-card">
      <div className="flex items-center gap-2">
        <DatabaseBackup size={16} className="text-accent" />
        <h2 className="text-[15px] font-bold">데이터 백업</h2>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-mute">
        체크·지출 기록은 이 폰에만 저장돼요. 내보내기로 복사해 메모장에 보관하거나 동행에게 보내면, 어느 폰에서든
        가져오기로 복원할 수 있어요.
      </p>
      <div className="mt-3 flex gap-1.5">
        <button
          onClick={exportData}
          className="press flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-accent-soft text-xs font-bold text-accent"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? '복사됐어요!' : '내보내기 (복사)'}
        </button>
        <button
          onClick={() => setImporting((v) => !v)}
          className="press flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-fill text-xs font-bold text-sub"
        >
          <Download size={13} /> 가져오기
        </button>
      </div>
      <AnimatePresence initial={false}>
        {importing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.3, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <textarea
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="내보내기로 복사한 내용을 여기 붙여넣으세요"
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl bg-fill px-3.5 py-3 text-xs font-medium outline-none placeholder:text-mute"
            />
            <button
              onClick={importData}
              disabled={!paste.trim()}
              className="press mt-1.5 min-h-[40px] w-full rounded-2xl bg-accent text-xs font-bold text-white disabled:opacity-40"
            >
              복원하기 (기존 기록을 덮어써요)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-2 text-[11px] font-medium text-over">{error}</p>}
    </section>
  )
}
