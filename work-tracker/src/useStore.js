import { useState, useEffect } from 'react'

const STORAGE_KEY = 'work-tracker-data'
const LANG_KEY = 'work-tracker-lang'

const defaultWorks = []

export function useStore() {
  const [works, setWorks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultWorks
    } catch {
      return defaultWorks
    }
  })

  const [lang, setLang] = useState(() => {
    return localStorage.getItem(LANG_KEY) || 'tr'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works))
  }, [works])

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
  }, [lang])

  const addWork = (work) => {
    const newWork = {
      ...work,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setWorks((prev) => [newWork, ...prev])
    return newWork
  }

  const updateWork = (id, updates) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    )
  }

  const deleteWork = (id) => {
    setWorks((prev) => prev.filter((w) => w.id !== id))
  }

  const toggleLang = () => {
    setLang((l) => (l === 'tr' ? 'en' : 'tr'))
  }

  return { works, addWork, updateWork, deleteWork, lang, toggleLang }
}
