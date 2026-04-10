import { useState, useRef, useEffect } from 'react'
import cx from 'clsx'
import { COLORS } from '../../constants.js'
import styles from './TaskRow.module.css'

export function TaskRow({ task, themeId, listTags, onToggle, onDelete, onAddTag, onRemoveTag, onCreateTag, onSetDeadline }) {
  const [showTagDd, setShowTagDd] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColorIdx, setNewTagColorIdx] = useState(0)
  const ddRef = useRef(null)

  useEffect(() => {
    if (!showTagDd) return
    function handleClick(e) {
      if (ddRef.current && !ddRef.current.contains(e.target)) setShowTagDd(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [showTagDd])

  function handleCreateTag() {
    if (!newTagName.trim()) return
    onCreateTag(themeId, task.id, newTagName.trim(), COLORS[newTagColorIdx].dot)
    setNewTagName('')
    setNewTagColorIdx(0)
    setShowTagDd(false)
  }

  return (
    <div className={styles.row}>
      <div
        className={cx(styles.cb, task.done && styles.checked)}
        onClick={() => onToggle(themeId, task.id)}
      />
      <div className={styles.body}>
        <div
          className={cx(styles.text, task.done && styles.done)}
          onClick={() => onToggle(themeId, task.id)}
        >
          {task.text}
        </div>
        {((task.tags?.length > 0) || task.deadline) && (
          <div className={styles.meta}>
            {(task.tags || []).map(tid => {
              const tag = listTags.find(t => t.id === tid)
              if (!tag) return null
              return (
                <button
                  key={tid}
                  className={styles.tagPill}
                  style={{ background: tag.color + '22', color: tag.color }}
                  onClick={() => onRemoveTag(themeId, task.id, tid)}
                >
                  {tag.name}<span className={styles.tagDel}>×</span>
                </button>
              )
            })}
            {task.deadline && <DeadlineBadge dateStr={task.deadline} />}
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div style={{ position: 'relative' }}>
          <button
            className={styles.metaBtn}
            title="Tag toevoegen"
            onClick={e => { e.stopPropagation(); setShowTagDd(v => !v) }}
          >
            🏷
          </button>
          {showTagDd && (
            <div className={styles.tagDd} ref={ddRef}>
              <div className={styles.ddTitle}>Tags</div>
              {listTags.map(tag => {
                const has = (task.tags || []).includes(tag.id)
                return (
                  <div
                    key={tag.id}
                    className={styles.tagOption}
                    onClick={() => {
                      if (has) onRemoveTag(themeId, task.id, tag.id)
                      else onAddTag(themeId, task.id, tag.id)
                      setShowTagDd(false)
                    }}
                  >
                    <div className={styles.tagDot} style={{ background: tag.color }} />
                    <span>{tag.name}</span>
                    {has && <span className={styles.tagCheck}>✓</span>}
                  </div>
                )
              })}
              <div className={styles.ddSep} />
              <div className={styles.ddTitle}>Nieuwe tag</div>
              <div className={styles.newTagRow}>
                <input
                  className={styles.tagInput}
                  placeholder="Tag naam..."
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateTag()}
                />
                <div className={styles.colorPicker}>
                  {COLORS.slice(0, 6).map((c, i) => (
                    <div
                      key={i}
                      className={cx(styles.colorDot, i === newTagColorIdx && styles.colorDotSelected)}
                      style={{ background: c.dot }}
                      onClick={() => setNewTagColorIdx(i)}
                    />
                  ))}
                </div>
              </div>
              <button className={styles.createTagBtn} onClick={handleCreateTag}>
                + tag aanmaken
              </button>
            </div>
          )}
        </div>
        <button
          className={styles.metaBtn}
          title="Deadline instellen"
          onClick={() => onSetDeadline(themeId, task.id, task.deadline || '')}
        >
          📅
        </button>
        <button className={styles.delBtn} onClick={() => onDelete(themeId, task.id)}>✕</button>
      </div>
    </div>
  )
}

function DeadlineBadge({ dateStr }) {
  const d = new Date(dateStr)
  const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24))
  const label = diff < 0 ? `${Math.abs(diff)}d te laat` : diff === 0 ? 'vandaag' : `${diff}d`
  return (
    <span className={cx(styles.deadlineBadge, diff < 0 && styles.overdue, diff >= 0 && diff <= 7 && styles.soon)}>
      📅 {d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} · {label}
    </span>
  )
}
