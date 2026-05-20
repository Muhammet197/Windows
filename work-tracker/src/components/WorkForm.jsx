import { useState } from 'react'
import { motion } from 'framer-motion'
import { translations } from '../i18n'

const STATUSES = ['completed', 'inProgress', 'pending']

const statusColors = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  inProgress: 'bg-blue-50 text-blue-700 border-blue-300',
  pending: 'bg-amber-50 text-amber-700 border-amber-300',
}

const empty = {
  title: '', category: '', environment: '', status: 'completed',
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

const inputCls = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"

export default function WorkForm({ lang, onSave, onCancel, initial, categories, environments }) {
  const t = translations[lang]
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty)
  const [tagInput, setTagInput] = useState('')

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
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
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors text-lg">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <Field label={t.jobTitle} required>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder={t.jobTitlePlaceholder} className={inputCls} required autoFocus />
          </Field>

          {/* Category */}
          <Field label={t.category}>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => set('category', form.category === cat.id ? '' : cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    form.category === cat.id
                      ? 'text-white shadow-sm border-transparent'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                  style={form.category === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Status */}
          <Field label={t.status}>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    form.status === s ? `${statusColors[s]} ring-1 ring-offset-0 ring-current` : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}>
                  {t[s]}
                </button>
              ))}
            </div>
          </Field>

          {/* Environment */}
          <Field label={t.environment}>
            <div className="flex flex-wrap gap-2">
              {environments.map((env) => (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => set('environment', form.environment === env.id ? '' : env.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.environment === env.id
                      ? 'text-white shadow-sm border-transparent'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                  style={form.environment === env.id ? { backgroundColor: env.color, borderColor: env.color } : {}}
                >
                  {env.icon} {env.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Date + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t.date}>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                className={inputCls} />
            </Field>
            <Field label={t.duration}>
              <input type="number" value={form.duration} onChange={(e) => set('duration', e.target.value)}
                placeholder={t.durationPlaceholder} min="0" className={inputCls} />
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
              onKeyDown={handleTagKey} placeholder={t.tagsPlaceholder} className={inputCls} />
          </Field>

          {/* Steps */}
          <Field label={t.steps}>
            <textarea value={form.steps} onChange={(e) => set('steps', e.target.value)}
              placeholder={t.stepsPlaceholder} rows={5} className={`${inputCls} resize-y`} />
          </Field>

          {/* Notes */}
          <Field label={t.notes}>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder={t.notesPlaceholder} rows={3} className={`${inputCls} resize-y`} />
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
