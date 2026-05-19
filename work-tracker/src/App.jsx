import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
    const custom = works.map((w) => w.category).filter((c) => c && !DEFAULT_CATEGORIES.includes(c))
    return [...new Set(custom)]
  }, [works])

  const filtered = useMemo(() => works.filter((w) => {
    if (search &&
      !w.title.toLowerCase().includes(search.toLowerCase()) &&
      !w.steps?.toLowerCase().includes(search.toLowerCase()) &&
      !w.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))) return false
    if (filterCategory && w.category !== filterCategory) return false
    if (filterEnv && w.environment !== filterEnv) return false
    if (filterStatus && w.status !== filterStatus) return false
    return true
  }), [works, search, filterCategory, filterEnv, filterStatus])

  const hasFilters = search || filterCategory || filterEnv || filterStatus

  const handleSave = (data) => {
    if (editingWork) {
      updateWork(editingWork.id, data)
      if (selectedWork?.id === editingWork.id) setSelectedWork({ ...editingWork, ...data })
    } else {
      addWork(data)
    }
    setShowForm(false)
    setEditingWork(null)
  }

  const handleEdit = (work) => { setEditingWork(work); setShowForm(true) }
  const handleDelete = (id) => { deleteWork(id); setView('list'); setSelectedWork(null) }
  const handleCardClick = (work) => { setSelectedWork(work); setView('detail') }

  if (view === 'detail' && selectedWork) {
    return (
      <>
        <WorkDetail
          work={selectedWork} lang={lang}
          onBack={() => { setView('list'); setSelectedWork(null) }}
          onEdit={handleEdit} onDelete={handleDelete}
        />
        <AnimatePresence>
          {showForm && (
            <WorkForm lang={lang} initial={editingWork} onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingWork(null) }} />
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-0 flex items-stretch">
          {/* Brand */}
          <div className="flex items-center gap-3 py-3 pr-6 border-r border-slate-100">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
              WT
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-none">{t.appTitle}</h1>
              <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">{t.appSubtitle}</p>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2 py-3">
            <button onClick={toggleLang}
              className="px-3 py-1.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors tracking-wider">
              {t.language}
            </button>
            <button
              onClick={() => { setEditingWork(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-[0.97] transition-all shadow-sm"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">{t.addWork}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <StatsBar works={works} lang={lang} />

        {/* Search + Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t.filters}</span>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="">{t.allCategories}</option>
              {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{t[c]}</option>)}
              {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterEnv} onChange={(e) => setFilterEnv(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="">{t.allEnvironments}</option>
              {ENVIRONMENTS.map((e) => <option key={e} value={e}>{t[e]}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="">{t.allStatuses}</option>
              <option value="completed">{t.completed}</option>
              <option value="inProgress">{t.inProgress}</option>
              <option value="pending">{t.pending}</option>
            </select>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setSearch(''); setFilterCategory(''); setFilterEnv(''); setFilterStatus('') }}
                className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                × {t.clearFilters}
              </motion.button>
            )}
            <span className="ml-auto text-xs text-slate-400 font-medium">
              {filtered.length} {lang === 'tr' ? 'kayıt' : 'records'}
            </span>
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-24">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-slate-500 font-semibold">{t.noWork}</p>
              <p className="text-slate-400 text-sm mt-1">{t.noWorkSub}</p>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((work, i) => (
                <WorkCard key={work.id} work={work} lang={lang} index={i} onClick={() => handleCardClick(work)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showForm && (
          <WorkForm lang={lang} initial={editingWork} onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingWork(null) }} />
        )}
      </AnimatePresence>
    </div>
  )
}
