import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { translations } from '../i18n'

const ENVIRONMENTS = ['webBrowser', 'desktop', 'terminal', 'mobile', 'api', 'database', 'cloud', 'other']
const STATUSES = ['completed', 'inProgress', 'pending']
const DEFAULT_CATEGORIES = ['frontend', 'backend', 'devops', 'design', 'testing', 'documentation', 'analysis', 'management']

const statusColors = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500',
  inProgress: 'bg-blue-50 text-blue-700 border-blue-300 ring-blue-500',
  pending: 'bg-amber-50 text-amber-700 border-amber-300 ring-amber-500',
}

const empty = {
  title: '', category: '', environment: 'webBrowser', status: 'completed',
  date: new Date().toISOString().split('T')[0], duration: '', tags: [], steps: '', notes: '',
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const input = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
const select = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors appearance-none"

export default function WorkForm({ lang, onSave, onCancel, initial }) {
  const t = translations[lang]
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty)
  const [tagInput, setTagInput] = useState('')
  const [customCategory, setCustomCategory] = useState(
    initial && !DEFAULT_CATEGORIES.includes(initial.category) ? initial.category : ''
  )
  const [usingCustomCategory, setUsingCustomCategory] = useState(
    initial ? !DEFAULT_CATEGORIES.includes(initial.category) : false
  )

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleTagKey = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim()
      if (!form.tags.includes(tag)) set('tags', [...form.tags, tag])
      setTagInput('')
    }
  }

  const removeTag = (tag) => set('tags', form.tags.filter((t) => t !== tag))

  const handleCategoryChange = (e) => {
    const val = e.target.value
    if (val === '__custom__') { setUsingCustomCategory(true); set('category', customCategory) }
    else { setUsingCustomCategory(false); set('category', val) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, category: usingCustomCategory ? customCategory : form.category })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-bold text-slate-800">{initial ? t.editTitle : t.formTitle}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{lang === 'tr' ? 'Tüm alanları doldurun' : 'Fill in all fields'}</p>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors text-lg">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <Field label={t.jobTitle} required>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder={t.jobTitlePlaceholder} className={input} required autoFocus />
          </Field>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.category}>
              <select value={usingCustomCategory ? '__custom__' : form.category} onChange={handleCategoryChange} className={select}>
                <option value="">—</option>
                {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{t[c]}</option>)}
                <option value="__custom__">{lang === 'tr' ? 'Özel...' : 'Custom...'}</option>
              </select>
              {usingCustomCategory && (
                <input type="text" value={customCategory}
                  onChange={(e) => { setCustomCategory(e.target.value); set('category', e.target.value) }}
                  placeholder={lang === 'tr' ? 'Kategori adı' : 'Category name'}
                  className={`${input} mt-2`} />
              )}
            </Field>
            <Field label={t.status}>
              <div className="flex flex-col gap-1.5">
                {STATUSES.map((s) => (
                  <button key={s} type="button" onClick={() => set('status', s)}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left ${
                      form.status === s
                        ? `${statusColors[s]} ring-1 ring-offset-0`
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}>
                    {t[s]}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Environment */}
          <Field label={t.environment}>
            <div className="grid grid-cols-4 gap-1.5">
              {ENVIRONMENTS.map((env) => (
                <button key={env} type="button" onClick={() => set('environment', env)}
                  className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all text-center ${
                    form.environment === env
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}>
                  {t[env]}
                </button>
              ))}
            </div>
          </Field>

          {/* Date + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.date}>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={select} />
            </Field>
            <Field label={t.duration}>
              <input type="number" value={form.duration} onChange={(e) => set('duration', e.target.value)}
                placeholder={t.durationPlaceholder} min="0" className={input} />
            </Field>
          </div>

          {/* Tags */}
          <Field label={t.tags}>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium border border-violet-200">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-violet-900 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey} placeholder={t.tagsPlaceholder} className={input} />
          </Field>

          {/* Steps */}
          <Field label={t.steps}>
            <textarea value={form.steps} onChange={(e) => set('steps', e.target.value)}
              placeholder={t.stepsPlaceholder} rows={5}
              className={`${input} resize-y`} />
          </Field>

          {/* Notes */}
          <Field label={t.notes}>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder={t.notesPlaceholder} rows={3}
              className={`${input} resize-y`} />
          </Field>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="submit"
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all text-sm shadow-sm">
              {t.save}
            </button>
            <button type="button" onClick={onCancel}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">
              {t.cancel}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
