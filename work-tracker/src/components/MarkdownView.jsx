import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * MarkdownView - renders markdown.
 * When `workingMode` is true and `checkState`/`onCheck` are provided,
 * task-list items become interactive checkboxes that persist via onCheck(index, value).
 */
export default function MarkdownView({ content, workingMode = false, checkState = {}, onCheck }) {
  // Build a stable index for each task-list checkbox by scanning the source
  const taskIndexMap = useMemo(() => {
    const map = []
    const lines = (content || '').split('\n')
    let idx = 0
    lines.forEach((line, lineNo) => {
      if (/^\s*[-*+]\s*\[[ xX]\]/.test(line)) {
        map.push({ lineNo, idx })
        idx++
      }
    })
    return map
  }, [content])

  let renderedIndex = 0

  const components = {
    input: (props) => {
      if (props.type === 'checkbox') {
        const i = renderedIndex
        renderedIndex++
        if (workingMode && onCheck) {
          const checked = checkState[i] ?? props.checked
          return (
            <input
              type="checkbox"
              checked={!!checked}
              onChange={(e) => onCheck(i, e.target.checked)}
              disabled={false}
            />
          )
        }
        return <input type="checkbox" checked={!!props.checked} disabled readOnly />
      }
      return <input {...props} />
    },
    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content || ''}
      </ReactMarkdown>
    </div>
  )
}
