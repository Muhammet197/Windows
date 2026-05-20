import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { translations } from '../i18n'
import MarkdownView from './MarkdownView'

const statusConfig = {
  completed: { text: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  inProgress: { text: 'text-blue-800',   bg: 'bg-blue-100',   border: 'border-blue-300' },
  pending:    { text: 'text-amber-800',  bg: 'bg-amber-100',  border: 'border-amber-300' },
}

export default function WorkDetail({
  work, lang, onBack, onEdit, onDelete, categories = [], environments = [],
  checks = {}, onCheck, onResetChecks,
}) {
  const t = translations[lang]
  const cfg = statusConfig[work.status] || statusConfig.pending
  const [workingMode, setWorkingMode] = useState(false)

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

  // Count task list items for progress
  const taskStats = useMemo(() => {
    const lines = (work.steps || '').split('\n')
    let total = 0, done = 0
    lines.forEach((line) => {
      if (/^\s*[-*+]\s*\[[ xX]\]/.test(line)) {
        total++
        const checkboxIdx = total - 1
        const fromMarkdown = /^\s*[-*+]\s*\[[xX]\]/.test(line)
        const fromState = checks[checkboxIdx]
        const isChecked = fromState !== undefined ? fromState : fromMarkdown
        if (isChecked) done++
      }
    })
    return { total, done }
  }, [work.steps, checks])

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="min-h-screen bg-slate-100"
    >
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-colors">
            ← {t.back}
          </button>
          <div className="flex gap-2">
            <button onClick={() => onEdit(work)}
              className="px-3 sm:px-4 py-1.5 text-sm font-semibold text-blue-700 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
              {t.edit}
            </button>
            <button onClick={handleDelete}
              className="px-3 sm:px-4 py-1.5 text-sm font-semibold text-red-600 border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors">
              {t.delete}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 leading-snug">{work.title}</h1>
              <p className="text-xs text-slate-500 mt-1.5">
                {t.createdAt}: {new Date(work.createdAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
              </p>
            </div>
            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border-2 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              {t[work.status]}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {cat && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: cat.color }}>
                {cat.icon} {cat.label}
              </div>
            )}
            {env && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: env.color }}>
                {env.icon} {env.label}
              </div>
            )}
            {work.date && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
                <span>📅</span>
                <span className="text-slate-700 font-semibold text-xs">{formatDate(work.date)}</span>
              </div>
            )}
            {work.duration && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
                <span>⏱️</span>
                <span className="text-slate-700 font-semibold text-xs">{work.duration} {t.minutes}</span>
              </div>
            )}
          </div>

          {work.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
              {work.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-semibold border border-violet-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Steps */}
        {work.steps && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs">📋</span>
                <h2 className="text-base font-bold text-slate-900">{t.howItWasDone}</h2>
                {workingMode && taskStats.total > 0 && (
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                    {taskStats.done} / {taskStats.total}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {workingMode && taskStats.done > 0 && (
                  <button
                    onClick={() => onResetChecks?.(work.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {lang === 'tr' ? '↺ Sıfırla' : '↺ Reset'}
                  </button>
                )}
                <button
                  onClick={() => setWorkingMode((w) => !w)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all ${
                    workingMode
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                  }`}
                >
                  {workingMode
                    ? (lang === 'tr' ? '✓ Çalışma Modu' : '✓ Working Mode')
                    : (lang === 'tr' ? '▶ Çalışma Modu' : '▶ Working Mode')}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            {workingMode && taskStats.total > 0 && (
              <div className="h-1 bg-slate-100">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(taskStats.done / taskStats.total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <div className="px-6 py-5">
              <MarkdownView
                content={work.steps}
                workingMode={workingMode}
                checkState={checks}
                onCheck={(idx, value) => onCheck?.(work.id, idx, value)}
              />
            </div>
          </motion.div>
        )}

        {/* Notes */}
        {work.notes && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-amber-50 rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-amber-200 flex items-center gap-3 bg-amber-100/50">
              <span>📝</span>
              <h2 className="text-sm font-bold text-amber-900">{t.additionalNotes}</h2>
            </div>
            <div className="px-6 py-5">
              <MarkdownView content={work.notes} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
