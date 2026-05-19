import { useState, useMemo } from 'react'
import { useStore } from './useStore'
import { translations } from './i18n'
import WorkCard from './components/WorkCard'
import WorkForm from './components/WorkForm'
import WorkDetail from './components/WorkDetail'
import StatsBar from './components/StatsBar'
import './index.css'

const ENVIRONMENTS = ['webBrowser', 'desktop', 'terminal', 'mobile', 'api', 'database', 'cloud', 'other']
const DEFAULT_CATEGORIES = ['frontend', 'backend', 'devops', 'design', 'testing', 'documentation', 'analysis', 'management']

export default function App() {
  const { works, addWork, updateWork, deleteWork, lang, toggleLang } = useStore()
  const t = translations[lang]

  const [view, setView] = useState('list')
  const [showForm, setShowForm] = useState(false)
  const [editingWork, setEditingWork] = useState(null)
  const [selectedWork, setSelectedWork] = useState(null)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterEnv, setFilterEnv] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const allCategories = useMemo(() => {
    const custom = works
      .map((w) => w.category)
      .filter((c) => c && !DEFAULT_CATEGORIES.includes(c))
    return [...new Set(custom)]
  }, [works])

  const filtered = useMemo(() => {
    return works.filter((w) => {
      if (
        search &&
        !w.title.toLowerCase().includes(search.toLowerCase()) &&
        !w.steps?.toLowerCase().includes(search.toLowerCase()) &&
        !w.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      ) return false
      if (filterCategory && w.category !== filterCategory) return false
      if (filterEnv && w.environment !== filterEnv) return false
      if (filterStatus && w.status !== filterStatus) return false
      return true
    })
  }, [works, search, filterCategory, filterEnv, filterStatus])

  const hasFilters = search || filterCategory || filterEnv || filterStatus

  const handleSave = (data) => {
    if (editingWork) {
      updateWork(editingWork.id, data)
      if (selectedWork?.id === editingWork.id) {
        setSelectedWork({ ...editingWork, ...data })
      }
    } else {
      addWork(data)
    }
    setShowForm(false)
    setEditingWork(null)
  }

  const handleEdit = (work) => {
    setEditingWork(work)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    deleteWork(id)
    setView('list')
    setSelectedWork(null)
  }

  const handleCardClick = (work) => {
    setSelectedWork(work)
    setView('detail')
  }

  if (view === 'detail' && selectedWork) {
    return (
      <>
        <WorkDetail
          work={selectedWork}
          lang={lang}
          onBack={() => { setView('list'); setSelectedWork(null) }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {showForm && (
          <WorkForm
            lang={lang}
            initial={editingWork}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingWork(null) }}
          />
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg">
              📋
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">{t.appTitle}</h1>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{t.appSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.language}
            </button>
            <button
              onClick={() => { setEditingWork(null); setShowForm(true) }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">{t.addWork}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <StatsBar works={works} lang={lang} />

        {/* Search + Filters */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 font-medium">{t.filters}:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">{t.allCategories}</option>
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{t[c]}</option>
              ))}
              {allCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterEnv}
              onChange={(e) => setFilterEnv(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">{t.allEnvironments}</option>
              {ENVIRONMENTS.map((e) => (
                <option key={e} value={e}>{t[e]}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">{t.allStatuses}</option>
              <option value="completed">{t.completed}</option>
              <option value="inProgress">{t.inProgress}</option>
              <option value="pending">{t.pending}</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setFilterCategory(''); setFilterEnv(''); setFilterStatus('') }}
                className="px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                × {t.clearFilters}
              </button>
            )}
          </div>
        </div>

        {/* Work Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 font-medium">{t.noWork}</p>
            <p className="text-gray-400 text-sm mt-1">{t.noWorkSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                lang={lang}
                onClick={() => handleCardClick(work)}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <WorkForm
          lang={lang}
          initial={editingWork}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingWork(null) }}
        />
      )}
    </div>
  )
}
