import { motion } from 'framer-motion'
import { translations } from '../i18n'

const NAV = [
  { key: 'works',    icon: '📋', labelKey: 'navWorks' },
  { key: 'settings', icon: '⚙️', labelKey: 'navSettings' },
]

export default function Sidebar({ page, onNavigate, lang, onToggleLang }) {
  const t = translations[lang]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-900 min-h-screen fixed left-0 top-0 z-50">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
              WT
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">{t.appTitle}</p>
              <p className="text-slate-500 text-[10px] mt-0.5">{t.appSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = page === item.key
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {t[item.labelKey]}
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom: language toggle */}
        <div className="px-4 py-4 border-t border-slate-800">
          <button
            onClick={onToggleLang}
            className="w-full px-3 py-2 text-xs font-bold text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors tracking-wider"
          >
            {t.language}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex">
        {NAV.map((item) => {
          const active = page === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                active ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {t[item.labelKey]}
              {active && <div className="w-4 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          )
        })}
        <button
          onClick={onToggleLang}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold text-slate-400"
        >
          <span className="text-xl leading-none">🌍</span>
          {t.language}
        </button>
      </nav>
    </>
  )
}
