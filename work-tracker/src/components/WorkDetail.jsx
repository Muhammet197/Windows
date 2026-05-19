import { translations } from '../i18n'

const statusStyles = {
  completed: 'bg-emerald-100 text-emerald-800',
  inProgress: 'bg-blue-100 text-blue-800',
  pending: 'bg-amber-100 text-amber-800',
}

const envIcons = {
  webBrowser: '🌐',
  desktop: '🖥️',
  terminal: '⌨️',
  mobile: '📱',
  api: '🔌',
  database: '🗄️',
  cloud: '☁️',
  other: '📦',
}

export default function WorkDetail({ work, lang, onBack, onEdit, onDelete }) {
  const t = translations[lang]

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleDelete = () => {
    if (window.confirm(t.confirmDelete)) onDelete(work.id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← {t.back}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(work)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {t.edit}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              {t.delete}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Title & Status */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{work.title}</h1>
            <span className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium ${statusStyles[work.status] || statusStyles.pending}`}>
              {t[work.status]}
            </span>
          </div>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2">
            {work.category && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm">
                <span className="text-gray-500">🎯</span>
                <span className="text-gray-700 font-medium">{t[work.category] || work.category}</span>
              </div>
            )}
            {work.environment && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm">
                <span>{envIcons[work.environment] || '📦'}</span>
                <span className="text-gray-700 font-medium">{t[work.environment] || work.environment}</span>
              </div>
            )}
            {work.date && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm">
                <span>📅</span>
                <span className="text-gray-700">{formatDate(work.date)}</span>
              </div>
            )}
            {work.duration && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm">
                <span>⏱️</span>
                <span className="text-gray-700">{work.duration} {t.minutes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {work.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Steps */}
        {work.steps && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs">📋</span>
              {t.howItWasDone}
            </h2>
            <div className="prose prose-sm max-w-none">
              {work.steps.split('\n').map((line, i) => (
                <p key={i} className={`text-gray-700 leading-relaxed ${line.trim() === '' ? 'h-2' : ''}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {work.notes && (
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📝</span>
              {t.additionalNotes}
            </h2>
            <div>
              {work.notes.split('\n').map((line, i) => (
                <p key={i} className={`text-gray-700 leading-relaxed ${line.trim() === '' ? 'h-2' : ''}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Created at */}
        <p className="text-xs text-gray-400 text-center">
          {t.createdAt}: {new Date(work.createdAt).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
        </p>
      </div>
    </div>
  )
}
