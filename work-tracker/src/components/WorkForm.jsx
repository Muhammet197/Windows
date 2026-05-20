import { useState } from 'react'
import { motion } from 'framer-motion'
import { translations } from '../i18n'
import MarkdownEditor from './MarkdownEditor'

const STATUSES = ['completed', 'inProgress', 'pending']

const statusColors = {
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-400',
  inProgress: 'bg-blue-100 text-blue-800 border-blue-400',
  pending: 'bg-amber-100 text-amber-800 border-amber-400',
}

const empty = {
  title: '', category: '', environment: '', status: 'completed',
  date: new Date().toISOString().split('T')[0], duration: '', tags: [], steps: '', notes: '',
}

function Field({ label, required, children, hint }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"

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
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl my-auto max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 rounded-t-2xl flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">{initial ? t.editTitle : t.formTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'tr' ? 'İşin nasıl yapıldığını adım adım kaydedin' : 'Document the process step by step'}
            </p>
          </div>
          <button onClick={onCancel}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <Field label={t.jobTitle} required>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder={t.jobTitlePlaceholder} className={inputCls} required autoFocus />
          </Field>

          {/* Category */}
          <Field label={t.category}>
            <div className="flex flex-wrap gap-2">
              {categories.length === 0 && (
                <span className="text-xs text-slate-500 italic">
                  {lang === 'tr' ? 'Önce Ayarlar\'dan kategori ekleyin' : 'Add categories in Settings first'}
                </span>
              )}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => set('category', form.category === cat.id ? '' : cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    form.category === cat.id
                      ? 'text-white shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                  style={form.category === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                >
                  {cat.icon} {cat.label}
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                    form.environment === env.id
                      ? 'text-white shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                  style={form.environment === env.id ? { backgroundColor: env.color, borderColor: env.color } : {}}
                >
                  {env.icon} {env.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Status + Date + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label={t.status}>
              <div className="flex flex-col gap-1.5">
                {STATUSES.map((s) => (
                  <button key={s} type="button" onClick={() => set('status', s)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all text-left ${
                      form.status === s ? statusColors[s] : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                    }`}>
                    {t[s]}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t.date}>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} />
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
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-800 rounded-full text-xs font-semibold border border-violet-200">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-violet-950 ml-0.5 text-sm">×</button>
                  </span>
                ))}
              </div>
            )}
            <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey} placeholder={t.tagsPlaceholder} className={inputCls} />
          </Field>

          {/* Steps - Markdown */}
          <Field
            label={t.steps}
            hint={lang === 'tr' ? 'Markdown: **kalın**, - liste, `kod`, - [ ] görev' : 'Markdown supported'}
          >
            <MarkdownEditor
              value={form.steps}
              onChange={(v) => set('steps', v)}
              placeholder={lang === 'tr'
                ? '## Adımlar\n\n- [ ] İlk adımı yaz\n- [ ] İkinci adım\n\n```bash\nexample-command\n```'
                : '## Steps\n\n- [ ] First step\n- [ ] Second step\n\n```bash\nexample-command\n```'}
              lang={lang}
              rows={12}
            />
          </Field>

          {/* Notes - Markdown */}
          <Field label={t.notes}>
            <MarkdownEditor
              value={form.notes}
              onChange={(v) => set('notes', v)}
              placeholder={t.notesPlaceholder}
              lang={lang}
              rows={4}
            />
          </Field>
        </form>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex gap-3 rounded-b-2xl shrink-0">
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-white transition-colors text-sm">
            {t.cancel}
          </button>
          <button type="submit" onClick={handleSubmit}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all text-sm shadow-sm">
            {t.save}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
