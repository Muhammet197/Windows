import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const TOOLBAR = [
  { key: 'h2',     label: 'H',   tip: 'Başlık',     wrap: { before: '## ', after: '', block: true } },
  { key: 'h3',     label: 'h',   tip: 'Alt Başlık', wrap: { before: '### ', after: '', block: true } },
  { key: 'bold',   label: 'B',   tip: 'Kalın',      wrap: { before: '**', after: '**' } },
  { key: 'italic', label: 'I',   tip: 'İtalik',     wrap: { before: '_', after: '_' } },
  { key: 'code',   label: '<>',  tip: 'Kod',        wrap: { before: '`', after: '`' } },
  { key: 'codeb',  label: '{}',  tip: 'Kod Bloğu',  wrap: { before: '```\n', after: '\n```', block: true } },
  { key: 'list',   label: '•',   tip: 'Liste',      wrap: { before: '- ', after: '', block: true } },
  { key: 'ordered',label: '1.',  tip: 'Numaralı',   wrap: { before: '1. ', after: '', block: true } },
  { key: 'check',  label: '☐',   tip: 'Görev',      wrap: { before: '- [ ] ', after: '', block: true } },
  { key: 'link',   label: '🔗',  tip: 'Link',       wrap: { before: '[', after: '](https://)' } },
  { key: 'quote',  label: '"',   tip: 'Alıntı',     wrap: { before: '> ', after: '', block: true } },
]

export default function MarkdownEditor({ value, onChange, placeholder, lang, rows = 10 }) {
  const [tab, setTab] = useState('edit')   // 'edit' | 'preview' | 'split'
  const ref = useRef(null)

  const applyWrap = (wrap) => {
    const ta = ref.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const v = value || ''
    const selected = v.slice(start, end)

    let newText, newStart, newEnd
    if (wrap.block) {
      // Apply to line start
      const lineStart = v.lastIndexOf('\n', start - 1) + 1
      newText = v.slice(0, lineStart) + wrap.before + v.slice(lineStart)
      newStart = newEnd = start + wrap.before.length
    } else {
      newText = v.slice(0, start) + wrap.before + selected + wrap.after + v.slice(end)
      if (selected) {
        newStart = start + wrap.before.length
        newEnd = newStart + selected.length
      } else {
        newStart = newEnd = start + wrap.before.length
      }
    }

    onChange(newText)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(newStart, newEnd)
    }, 0)
  }

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <div className="flex flex-wrap gap-0.5">
          {TOOLBAR.map((tool) => (
            <button
              key={tool.key}
              type="button"
              title={tool.tip}
              onClick={() => applyWrap(tool.wrap)}
              className="w-7 h-7 text-xs font-bold text-slate-700 rounded hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
            >
              {tool.label}
            </button>
          ))}
        </div>
        <div className="flex gap-0.5 bg-white rounded border border-slate-200 p-0.5">
          {[
            { key: 'edit',    label: lang === 'tr' ? 'Yaz' : 'Edit' },
            { key: 'preview', label: lang === 'tr' ? 'Önizle' : 'Preview' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                tab === t.key ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview */}
      {tab === 'edit' ? (
        <textarea
          ref={ref}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          className="w-full px-3 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y font-mono leading-relaxed"
          style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
        />
      ) : (
        <div className="p-4 markdown-body min-h-[120px]">
          {value?.trim()
            ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            : <p className="text-slate-400 italic text-sm">{lang === 'tr' ? 'Önizleme için bir şeyler yazın...' : 'Write something to preview...'}</p>
          }
        </div>
      )}
    </div>
  )
}
