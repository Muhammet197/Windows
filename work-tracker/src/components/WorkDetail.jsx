import { motion } from 'framer-motion'
import { translations } from '../i18n'

const statusConfig = {
  completed: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  inProgress: { text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  pending:    { text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
}

export default function WorkDetail({ work, lang, onBack, onEdit, onDelete, categories = [], environments = [] }) {
  const t = translations[lang]
  const cfg = statusConfig[work.status] || statusConfig.pending

  const cat = categories.find((c) => c.id === work.category)
  const env = environments.find((e) => e.id === work.environment)

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  const handleDelete = () => {
    if (window.confirm(t.confirmDelete)) onDelete(work.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="min-h-screen bg-slate-100"
    >
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
            ← {t.back}
          </button>
          <div className="flex gap-2">
            <button onClick={() => onEdit(work)}
              className="px-4 py-1.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              {t.edit}
            </button>
            <button onClick={handleDelete}
              className="px-4 py-1.5 text-sm font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              {t.delete}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{work.title}</h1>
              <p className="text-xs text-slate-400 mt-1">
                {t.createdAt}: {new Date(work.createdAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
              </p>
            </div>
            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              {t[work.status]}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {cat && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: cat.color }}>
                {cat.icon} {cat.label}
              </div>
            )}
            {env && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: env.color }}>
                {env.icon} {env.label}
              </div>
            )}
            {work.date && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">📅</span>
                <span className="text-slate-700 font-medium text-xs">{formatDate(work.date)}</span>
              </div>
            )}
            {work.duration && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400">⏱️</span>
                <span className="text-slate-700 font-medium text-xs">{work.duration} {t.minutes}</span>
              </div>
            )}
          </div>

          {work.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
              {work.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium border border-violet-100">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Steps */}
        {work.steps && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-[10px]">📋</span>
              {t.howItWasDone}
            </h2>
            <div className="space-y-1.5">
              {work.steps.split('\n').map((line, i) =>
                line.trim()
                  ? <p key={i} className="text-sm text-slate-700 leading-relaxed">{line}</p>
                  : <div key={i} className="h-2" />
              )}
            </div>
          </motion.div>
        )}

        {/* Notes */}
        {work.notes && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📝</span> {t.additionalNotes}
            </h2>
            <div className="space-y-1.5">
              {work.notes.split('\n').map((line, i) =>
                line.trim()
                  ? <p key={i} className="text-sm text-slate-700 leading-relaxed">{line}</p>
                  : <div key={i} className="h-2" />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
