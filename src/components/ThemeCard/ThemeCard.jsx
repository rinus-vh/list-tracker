import { useState } from 'react'
import cx from 'clsx'
import { COLORS } from '../../constants.js'
import { TaskRow } from '../TaskRow/TaskRow.jsx'
import styles from './ThemeCard.module.css'

export function ThemeCard({ theme, listTags, onEdit, onDelete, onToggleTask, onAddTask, onDeleteTask, onAddTag, onRemoveTag, onCreateTag, onSetDeadline }) {
  const [newTask, setNewTask] = useState('')
  const c = COLORS[theme.colorIdx || 0]
  const done = theme.tasks.filter(t => t.done).length
  const pct = theme.tasks.length ? Math.round(done / theme.tasks.length * 100) : 0

  function handleAddTask() {
    const text = newTask.trim()
    if (!text) return
    onAddTask(theme.id, text)
    setNewTask('')
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.dot} style={{ background: c.dot }} />
        <div className={styles.nameWrap}>
          <div className={styles.name}>{theme.name}</div>
          {theme.sub && <div className={styles.sub}>{theme.sub}</div>}
        </div>
        <div className={styles.acts}>
          <button className={styles.iconBtn} onClick={onEdit} title="Bewerk">✎</button>
          <button className={cx(styles.iconBtn, styles.iconBtnDim)} onClick={onDelete} title="Verwijder">✕</button>
        </div>
      </div>

      <div className={styles.barWrap}>
        <div className={styles.barFill} style={{ background: c.dot, width: `${pct}%` }} />
      </div>

      <div className={styles.tasksList}>
        {theme.tasks.length === 0 && (
          <div className={styles.noTasks}>geen taken</div>
        )}
        {theme.tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            themeId={theme.id}
            listTags={listTags}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onCreateTag={onCreateTag}
            onSetDeadline={onSetDeadline}
          />
        ))}
      </div>

      <div className={styles.addRow}>
        <input
          type="text"
          className={styles.addInput}
          placeholder="Taak toevoegen..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTask()}
        />
        <button className={styles.addBtn} onClick={handleAddTask}>+ taak</button>
      </div>
    </div>
  )
}
