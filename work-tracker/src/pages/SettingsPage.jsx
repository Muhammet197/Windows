import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { translations } from '../i18n'
import ConfigItemForm from '../components/ConfigItemForm'

function ConfigSection({ title, addLabel, items, works, lang, onAdd, onUpdate, onDelete, t }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const countUsage = (itemId) => works.filter((w) => w.category === itemId || w.environment === itemId).length

  const handleDelete = (item) => {
    const count = countUsage(item.id)
    const msg = count > 0
      ? `"${item.label}" ${count} ${t.usedInWorks}. ${t.confirmDeleteConfig}`
      : t.confirmDeleteConfig
    if (window.confirm(msg)) onDelete(item.id)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null) }}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          {addLabel}
        </button>
      </div>

      <div className="divide-y divide-slate-50">
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              key="add-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-4 bg-slate-50"
            >
              <ConfigItemForm
                lang={lang}
                onSave={(data) => { onAdd(data); setShowAddForm(false) }}
                onCancel={() => setShowAddForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {items.length === 0 && (
          <p className="px-6 py-8 text-slate-400 text-sm text-center">{t.noItemsYet}</p>
        )}

        {items.map((item, i) => {
          const usage = countUsage(item.id)
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              {editingId === item.id ? (
                <div className="px-6 py-4 bg-slate-50">
                  <ConfigItemForm
                    lang={lang}
                    initial={item}
                    onSave={(data) => { onUpdate(item.id, data); setEditingId(null) }}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                  {/* Color dot + icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
                    style={{ backgroundColor: item.color + '22', border: `2px solid ${item.color}44` }}
                  >
                    {item.icon}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 truncate">{item.label}</span>
                      {item.isDefault && (
                        <span className="shrink-0 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">
                          {t.defaultBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-400 font-mono">{item.color}</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{usage} {t.usageCount}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setEditingId(item.id)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function SettingsPage({
  lang, works,
  categories, addCategory, updateCategory, deleteCategory,
  environments, addEnvironment, updateEnvironment, deleteEnvironment,
}) {
  const t = translations[lang]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-2xl mx-auto px-4 py-8 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.settingsTitle}</h1>
        <p className="text-slate-500 text-sm mt-1">{t.settingsSubtitle}</p>
      </div>

      <ConfigSection
        title={t.categoriesSection}
        addLabel={t.addCategory}
        items={categories}
        works={works}
        lang={lang}
        t={t}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />

      <ConfigSection
        title={t.environmentsSection}
        addLabel={t.addEnvironment}
        items={environments}
        works={works}
        lang={lang}
        t={t}
        onAdd={addEnvironment}
        onUpdate={updateEnvironment}
        onDelete={deleteEnvironment}
      />
    </motion.div>
  )
}
