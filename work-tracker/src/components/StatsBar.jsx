import { translations } from '../i18n'

export default function StatsBar({ works, lang }) {
  const t = translations[lang]
  const completed = works.filter((w) => w.status === 'completed').length
  const inProgress = works.filter((w) => w.status === 'inProgress').length
  const totalMinutes = works.reduce((acc, w) => acc + (Number(w.duration) || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  const stats = [
    { label: t.totalWork, value: works.length, color: 'text-gray-900', bg: 'bg-gray-50' },
    { label: t.completed2, value: completed, color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: t.inProgress2, value: inProgress, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: t.totalTime, value: `${totalHours} ${t.hours}`, color: 'text-indigo-700', bg: 'bg-indigo-50' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
