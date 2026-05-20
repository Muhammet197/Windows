import { motion } from 'framer-motion'
import { translations } from '../i18n'

const statusConfig = {
  completed: { dot: 'bg-emerald-500', text: 'text-emerald-800', bg: 'bg-emerald-100', borderColor: '#10b981' },
  inProgress: { dot: 'bg-blue-500',   text: 'text-blue-800',   bg: 'bg-blue-100',   borderColor: '#3b82f6' },
  pending:    { dot: 'bg-amber-500',  text: 'text-amber-800',  bg: 'bg-amber-100',  borderColor: '#f59e0b' },
}

export default function WorkCard({ work, lang, onClick, index = 0, categories = [], environments = [] }) {
  const t = translations[lang]
  const cfg = statusConfig[work.status] || statusConfig.pending

  const cat = categories.find((c) => c.id === work.category)
  const env = environments.find((e) => e.id === work.environment)

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  // Count task items in steps (preview)
  const taskCount = (work.steps || '').match(/^\s*[-*+]\s*\[[ xX]\]/gm)?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 14px 32px -8px rgba(15, 23, 42, 0.15)' }}
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer transition-colors hover:border-slate-300 group relative overflow-hidden shadow-sm"
      style={{ borderLeftColor: cfg.borderColor, borderLeftWidth: 4 }}
    >
      {/* Title + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 flex-1">
          {work.title}
        </h3>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {t[work.status]}
        </span>
      </div>

      {/* Category + Environment badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {cat && (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: cat.color }}
          >
            {cat.icon} {cat.label}
          </span>
        )}
        {env && (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: env.color }}
          >
            {env.icon} {env.label}
          </span>
        )}
      </div>

      {/* Tags */}
      {work.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {work.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-violet-50 text-violet-700 rounded text-xs font-medium border border-violet-200">#{tag}</span>
          ))}
          {work.tags.length > 3 && <span className="text-slate-500 text-xs self-center">+{work.tags.length - 3}</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100 font-medium">
        <span>{formatDate(work.date)}</span>
        {work.duration && <span>· {work.duration} {t.minutes}</span>}
        {taskCount > 0 && <span>· {taskCount} {lang === 'tr' ? 'adım' : 'steps'}</span>}
        <span className="ml-auto text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
          {lang === 'tr' ? 'Aç →' : 'Open →'}
        </span>
      </div>
    </motion.div>
  )
}
