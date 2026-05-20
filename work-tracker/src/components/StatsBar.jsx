import { motion } from 'framer-motion'
import { translations } from '../i18n'

export default function StatsBar({ works, lang }) {
  const t = translations[lang]
  const completed = works.filter((w) => w.status === 'completed').length
  const inProgress = works.filter((w) => w.status === 'inProgress').length
  const totalMinutes = works.reduce((acc, w) => acc + (Number(w.duration) || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  const stats = [
    { label: t.totalWork,   value: works.length, icon: '📁', color: '#0f172a', bg: 'bg-white' },
    { label: t.completed2,  value: completed,    icon: '✅', color: '#047857', bg: 'bg-emerald-50' },
    { label: t.inProgress2, value: inProgress,   icon: '🔄', color: '#1d4ed8', bg: 'bg-blue-50' },
    { label: t.totalTime,   value: `${totalHours} ${t.hours}`, icon: '⏱️', color: '#6d28d9', bg: 'bg-violet-50' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
          className={`${s.bg} border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm`}
        >
          <div className="text-2xl">{s.icon}</div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-bold leading-none truncate" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-700 mt-1 font-semibold">{s.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
