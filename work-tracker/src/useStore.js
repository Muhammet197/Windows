import { useState, useEffect } from 'react'

const STORAGE_KEY = 'work-tracker-data'
const LANG_KEY = 'work-tracker-lang'
const CATEGORIES_KEY = 'work-tracker-categories'
const ENVIRONMENTS_KEY = 'work-tracker-environments'
const CHECKSTATE_KEY = 'work-tracker-checkstate'

const DEFAULT_CATEGORIES = [
  { id: 'frontend',      label: 'Frontend',       icon: '💻', color: '#3b82f6', isDefault: true },
  { id: 'backend',       label: 'Backend',         icon: '⚙️', color: '#10b981', isDefault: true },
  { id: 'devops',        label: 'DevOps',          icon: '🚀', color: '#f97316', isDefault: true },
  { id: 'design',        label: 'Tasarım',         icon: '🎨', color: '#ec4899', isDefault: true },
  { id: 'testing',       label: 'Test',            icon: '🧪', color: '#8b5cf6', isDefault: true },
  { id: 'documentation', label: 'Dokümantasyon',   icon: '📄', color: '#64748b', isDefault: true },
  { id: 'analysis',      label: 'Analiz',          icon: '📊', color: '#6366f1', isDefault: true },
  { id: 'management',    label: 'Yönetim',         icon: '👔', color: '#0f172a', isDefault: true },
]

const DEFAULT_ENVIRONMENTS = [
  { id: 'webBrowser', label: 'Web Tarayıcı',   icon: '🌐', color: '#2563eb', isDefault: true },
  { id: 'desktop',    label: 'Masaüstü',        icon: '🖥️', color: '#475569', isDefault: true },
  { id: 'terminal',   label: 'Terminal / CLI',  icon: '⌨️', color: '#1e293b', isDefault: true },
  { id: 'mobile',     label: 'Mobil',           icon: '📱', color: '#7c3aed', isDefault: true },
  { id: 'api',        label: 'API / Servis',    icon: '🔌', color: '#ea580c', isDefault: true },
  { id: 'database',   label: 'Veritabanı',      icon: '🗄️', color: '#059669', isDefault: true },
  { id: 'cloud',      label: 'Cloud',           icon: '☁️', color: '#0ea5e9', isDefault: true },
  { id: 'other',      label: 'Diğer',           icon: '📦', color: '#94a3b8', isDefault: true },
]

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function useStore() {
  const [works, setWorks] = useState(() => loadFromStorage(STORAGE_KEY, []))
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'tr')
  const [categories, setCategories] = useState(() => loadFromStorage(CATEGORIES_KEY, DEFAULT_CATEGORIES))
  const [environments, setEnvironments] = useState(() => loadFromStorage(ENVIRONMENTS_KEY, DEFAULT_ENVIRONMENTS))
  const [checkState, setCheckState] = useState(() => loadFromStorage(CHECKSTATE_KEY, {}))

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(works)) }, [works])
  useEffect(() => { localStorage.setItem(LANG_KEY, lang) }, [lang])
  useEffect(() => { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem(ENVIRONMENTS_KEY, JSON.stringify(environments)) }, [environments])
  useEffect(() => { localStorage.setItem(CHECKSTATE_KEY, JSON.stringify(checkState)) }, [checkState])

  // Works
  const addWork = (work) => {
    const newWork = { ...work, id: Date.now().toString(), createdAt: new Date().toISOString() }
    setWorks((prev) => [newWork, ...prev])
    return newWork
  }
  const updateWork = (id, updates) => setWorks((prev) => prev.map((w) => w.id === id ? { ...w, ...updates } : w))
  const deleteWork = (id) => setWorks((prev) => prev.filter((w) => w.id !== id))

  // Lang
  const toggleLang = () => setLang((l) => l === 'tr' ? 'en' : 'tr')

  // Categories
  const addCategory = (item) => {
    const newItem = { ...item, id: Date.now().toString(), isDefault: false }
    setCategories((prev) => [...prev, newItem])
  }
  const updateCategory = (id, data) => setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...data } : c))
  const deleteCategory = (id) => setCategories((prev) => prev.filter((c) => c.id !== id))

  // Environments
  const addEnvironment = (item) => {
    const newItem = { ...item, id: Date.now().toString(), isDefault: false }
    setEnvironments((prev) => [...prev, newItem])
  }
  const updateEnvironment = (id, data) => setEnvironments((prev) => prev.map((e) => e.id === id ? { ...e, ...data } : e))
  const deleteEnvironment = (id) => setEnvironments((prev) => prev.filter((e) => e.id !== id))

  // Checklist state per work
  const getChecksFor = (workId) => checkState[workId] || {}
  const setCheckFor = (workId, idx, value) => {
    setCheckState((prev) => ({
      ...prev,
      [workId]: { ...(prev[workId] || {}), [idx]: value },
    }))
  }
  const resetChecksFor = (workId) => {
    setCheckState((prev) => {
      const next = { ...prev }
      delete next[workId]
      return next
    })
  }

  return {
    works, addWork, updateWork, deleteWork,
    lang, toggleLang,
    categories, addCategory, updateCategory, deleteCategory,
    environments, addEnvironment, updateEnvironment, deleteEnvironment,
    getChecksFor, setCheckFor, resetChecksFor,
  }
}
