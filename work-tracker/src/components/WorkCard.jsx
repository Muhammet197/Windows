import { motion } from 'framer-motion'
import { translations } from '../i18n'

const statusConfig = {
  completed: { label: 'completed', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-l-emerald-500' },
  inProgress: { label: 'inProgress', dot: 'bg-blue-500',   text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-l-blue-500' },
  pending:    { label: 'pending',    dot: 'bg-amber-500',   text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-l-amber-500' },
}

const envIcons = {
  webBrowser: '🌐', desktop: '🖥️', terminal: '⌨️', mobile: '📱',
  api: '🔌', database: '🗄️', cloud: '☁️', other: '📦',
}

export default function WorkCard({ work, lang, onClick, index = 0 }) {
  const t = translations[lang]
  const cfg = statusConfig[work.status] || statusConfig.pending

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 10px 30px -5px rgba(0,0,0,0.12)' }}
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${cfg.border} p-5 cursor-pointer transition-colors hover:border-slate-300 group`}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 flex-1">
          {work.title}
        </h3>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {t[work.status]}
        </span>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {work.category && (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
            {t[work.category] || work.category}
          </span>
        )}
        {work.environment && (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium flex items-center gap-1">
            <span className="text-[10px]">{envIcons[work.environment] || '📦'}</span>
            {t[work.environment] || work.environment}
          </span>
        )}
      </div>

      {/* Tags */}
      {work.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {work.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded text-xs">#{tag}</span>
          ))}
          {work.tags.length > 3 && <span className="text-slate-400 text-xs">+{work.tags.length - 3}</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 text-xs text-slate-400 pt-3 border-t border-slate-100">
        <span>{formatDate(work.date)}</span>
        {work.duration && <span>· {work.duration} {t.minutes}</span>}
        <span className="ml-auto text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
          {lang === 'tr' ? 'Detay →' : 'Detail →'}
        </span>
      </div>
    </motion.div>
  )
}
