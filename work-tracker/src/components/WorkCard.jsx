import { translations } from '../i18n'

const statusStyles = {
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inProgress: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
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

export default function WorkCard({ work, lang, onClick }) {
  const t = translations[lang]
  const style = statusStyles[work.status] || statusStyles.pending

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
          {work.title}
        </h3>
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {t[work.status]}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {work.category && (
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
            {t[work.category] || work.category}
          </span>
        )}
        {work.environment && (
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium flex items-center gap-1">
            <span>{envIcons[work.environment] || '📦'}</span>
            {t[work.environment] || work.environment}
          </span>
        )}
      </div>

      {work.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {work.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs">
              #{tag}
            </span>
          ))}
          {work.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">+{work.tags.length - 4}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
        <span>📅 {formatDate(work.date)}</span>
        {work.duration && (
          <span>⏱️ {work.duration} {t.minutes}</span>
        )}
        {work.steps && (
          <span className="ml-auto text-indigo-400">
            {lang === 'tr' ? 'Detay →' : 'Detail →'}
          </span>
        )}
      </div>
    </div>
  )
}
