import { useState } from 'react'
import { translations } from '../i18n'

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f97316', '#ec4899',
  '#8b5cf6', '#64748b', '#6366f1', '#0f172a',
  '#ef4444', '#14b8a6', '#f59e0b', '#84cc16',
]

const PRESET_ICONS = [
  '💻','⚙️','🚀','🎨','🧪','📄','📊','👔',
  '🌐','🖥️','⌨️','📱','🔌','🗄️','☁️','📦',
  '🔧','📝','🎯','🏗️','🔍','💡','🤖','🛡️',
]

export default function ConfigItemForm({ lang, onSave, onCancel, initial }) {
  const t = translations[lang]
  const [label, setLabel] = useState(initial?.label || '')
  const [icon, setIcon] = useState(initial?.icon || '📦')
  const [color, setColor] = useState(initial?.color || '#3b82f6')
  const [customIcon, setCustomIcon] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!label.trim()) return
    onSave({ label: label.trim(), icon, color })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
      {/* Label */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {t.itemLabel}
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t.itemLabelPlaceholder}
          autoFocus
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Icon picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {t.itemIcon}
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_ICONS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setIcon(em)}
              className={`w-8 h-8 text-base rounded-lg flex items-center justify-center transition-all ${
                icon === em ? 'bg-blue-100 ring-2 ring-blue-500 ring-offset-1' : 'bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {em}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={customIcon}
          onChange={(e) => { setCustomIcon(e.target.value); if (e.target.value) setIcon(e.target.value) }}
          placeholder={lang === 'tr' ? 'Başka emoji yaz...' : 'Type another emoji...'}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {t.itemColor}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full transition-all ${
                color === c ? 'ring-2 ring-offset-2 ring-slate-500 scale-110' : 'hover:scale-105'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-slate-200 p-0.5 bg-white"
          />
          <span className="text-xs text-slate-500 font-mono">{color}</span>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
        <span className="text-xs text-slate-400">{lang === 'tr' ? 'Önizleme:' : 'Preview:'}</span>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {icon} {label || (lang === 'tr' ? 'İsim' : 'Name')}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {t.saveItem}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors"
        >
          {t.cancelEdit}
        </button>
      </div>
    </form>
  )
}
