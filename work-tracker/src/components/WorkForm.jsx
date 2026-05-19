import { useState } from 'react'
import { translations } from '../i18n'

const ENVIRONMENTS = ['webBrowser', 'desktop', 'terminal', 'mobile', 'api', 'database', 'cloud', 'other']
const STATUSES = ['completed', 'inProgress', 'pending']
const DEFAULT_CATEGORIES = ['frontend', 'backend', 'devops', 'design', 'testing', 'documentation', 'analysis', 'management']

const empty = {
  title: '',
  category: '',
  environment: 'webBrowser',
  status: 'completed',
  date: new Date().toISOString().split('T')[0],
  duration: '',
  tags: [],
  steps: '',
  notes: '',
}

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
      if (!form.tags.includes(tag)) {
        set('tags', [...form.tags, tag])
      }
      setTagInput('')
    }
  }

  const removeTag = (tag) => set('tags', form.tags.filter((t) => t !== tag))

  const handleCategoryChange = (e) => {
    const val = e.target.value
    if (val === '__custom__') {
      setUsingCustomCategory(true)
      set('category', customCategory)
    } else {
      setUsingCustomCategory(false)
      set('category', val)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, category: usingCustomCategory ? customCategory : form.category })
  }

  const statusColors = {
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    inProgress: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {initial ? t.editTitle : t.formTitle}
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t.jobTitle} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder={t.jobTitlePlaceholder}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.category}</label>
              <select
                value={usingCustomCategory ? '__custom__' : form.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">—</option>
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{t[c]}</option>
                ))}
                <option value="__custom__">{lang === 'tr' ? 'Diğer (özel)' : 'Other (custom)'}</option>
              </select>
              {usingCustomCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => { setCustomCategory(e.target.value); set('category', e.target.value) }}
                  placeholder={lang === 'tr' ? 'Kategori adı girin' : 'Enter category name'}
                  className="mt-2 w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.status}</label>
              <div className="flex gap-2 flex-wrap">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('status', s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.status === s ? statusColors[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {t[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Environment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.environment}</label>
            <div className="flex flex-wrap gap-2">
              {ENVIRONMENTS.map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => set('environment', env)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.environment === env
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {t[env]}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.date}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.duration}</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder={t.durationPlaceholder}
                min="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.tags}</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              placeholder={t.tagsPlaceholder}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.steps}</label>
            <textarea
              value={form.steps}
              onChange={(e) => set('steps', e.target.value)}
              placeholder={t.stepsPlaceholder}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.notes}</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder={t.notesPlaceholder}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
            >
              {t.save}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
