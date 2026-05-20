import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './useStore'
import { translations } from './i18n'
import Sidebar from './components/Sidebar'
import WorkCard from './components/WorkCard'
import WorkForm from './components/WorkForm'
import WorkDetail from './components/WorkDetail'
import StatsBar from './components/StatsBar'
import SettingsPage from './pages/SettingsPage'
import './index.css'

export default function App() {
  const store = useStore()
  const {
    works, addWork, updateWork, deleteWork, lang, toggleLang,
    categories, addCategory, updateCategory, deleteCategory,
    environments, addEnvironment, updateEnvironment, deleteEnvironment,
    getChecksFor, setCheckFor, resetChecksFor,
  } = store
  const t = translations[lang]

  const [page, setPage] = useState('works')   // 'works' | 'settings'
  const [detailWork, setDetailWork] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingWork, setEditingWork] = useState(null)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterEnv, setFilterEnv] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

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
      if (detailWork?.id === editingWork.id) setDetailWork({ ...editingWork, ...data })
    } else {
      addWork(data)
    }
    setShowForm(false)
    setEditingWork(null)
  }

  const handleEdit = (work) => { setEditingWork(work); setShowForm(true) }
  const handleDelete = (id) => { deleteWork(id); setDetailWork(null) }
  const handleNavigate = (p) => { setPage(p); setDetailWork(null) }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar page={page} onNavigate={handleNavigate} lang={lang} onToggleLang={toggleLang} />

      {/* Main content area — offset for sidebar on desktop */}
      <main className="md:pl-56 pb-20 md:pb-0 min-h-screen">

        {/* Settings page */}
        {page === 'settings' && (
          <SettingsPage
            lang={lang}
            works={works}
            categories={categories}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            environments={environments}
            addEnvironment={addEnvironment}
            updateEnvironment={updateEnvironment}
            deleteEnvironment={deleteEnvironment}
          />
        )}

        {/* Works page */}
        {page === 'works' && (
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Page header */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t.navWorks}</h1>
                <p className="text-sm text-slate-600 mt-0.5">{t.appSubtitle}</p>
              </div>
              <button
                onClick={() => { setEditingWork(null); setShowForm(true) }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-sm whitespace-nowrap"
              >
                <span className="text-base leading-none">+</span>
                <span className="hidden sm:inline">{t.addWork}</span>
              </button>
            </div>

            {/* Stats */}
            <StatsBar works={works} lang={lang} />

            {/* Search + Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">{t.filters}</span>

                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="">{t.allCategories}</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>

                <select value={filterEnv} onChange={(e) => setFilterEnv(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="">{t.allEnvironments}</option>
                  {environments.map((e) => <option key={e.id} value={e.id}>{e.icon} {e.label}</option>)}
                </select>

                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  <option value="">{t.allStatuses}</option>
                  <option value="completed">{t.completed}</option>
                  <option value="inProgress">{t.inProgress}</option>
                  <option value="pending">{t.pending}</option>
                </select>

                {hasFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => { setSearch(''); setFilterCategory(''); setFilterEnv(''); setFilterStatus('') }}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                    × {t.clearFilters}
                  </motion.button>
                )}

                <span className="ml-auto text-xs text-slate-600 font-semibold">
                  {filtered.length} {t.records}
                </span>
              </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-24">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-slate-700 font-semibold">{t.noWork}</p>
                  <p className="text-slate-500 text-sm mt-1">{t.noWorkSub}</p>
                </motion.div>
              ) : (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((work, i) => (
                    <WorkCard
                      key={work.id} work={work} lang={lang} index={i}
                      categories={categories} environments={environments}
                      onClick={() => setDetailWork(work)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Detail overlay - covers entire screen above sidebar offset */}
      <AnimatePresence>
        {detailWork && (
          <div className="fixed inset-0 md:left-56 bg-slate-100 z-40 overflow-y-auto">
            <WorkDetail
              work={detailWork}
              lang={lang}
              categories={categories}
              environments={environments}
              checks={getChecksFor(detailWork.id)}
              onCheck={setCheckFor}
              onResetChecks={resetChecksFor}
              onBack={() => setDetailWork(null)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Work form modal */}
      <AnimatePresence>
        {showForm && (
          <WorkForm
            lang={lang}
            initial={editingWork}
            categories={categories}
            environments={environments}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingWork(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
