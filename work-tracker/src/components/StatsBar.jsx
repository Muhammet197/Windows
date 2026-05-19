import { motion } from 'framer-motion'
import { translations } from '../i18n'

const stats = (works, t) => {
  const completed = works.filter((w) => w.status === 'completed').length
  const inProgress = works.filter((w) => w.status === 'inProgress').length
  const totalMinutes = works.reduce((acc, w) => acc + (Number(w.duration) || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)
  return [
    { label: t.totalWork,   value: works.length, icon: '📁', color: 'text-slate-700',   bg: 'bg-white',        border: 'border-slate-200' },
    { label: t.completed2,  value: completed,    icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50',   border: 'border-emerald-200' },
    { label: t.inProgress2, value: inProgress,   icon: '🔄', color: 'text-blue-700',    bg: 'bg-blue-50',      border: 'border-blue-200' },
    { label: t.totalTime,   value: `${totalHours} ${t.hours}`, icon: '⏱️', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  ]
}

export default function StatsBar({ works, lang }) {
  const t = translations[lang]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats(works, t).map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
          className={`${s.bg} border ${s.border} rounded-xl p-5 flex items-center gap-4`}
        >
          <div className="text-2xl">{s.icon}</div>
          <div>
            <div className={`text-2xl font-bold leading-none ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
