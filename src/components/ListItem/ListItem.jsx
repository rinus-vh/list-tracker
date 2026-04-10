import cx from 'clsx'
import styles from './ListItem.module.css'
import { COLORS } from '../../constants.js'

export function ListItem({ list, isActive, onSelect, onPin, onEdit, onDelete }) {
  const c = COLORS[list.colorIdx || 0]

  return (
    <div
      className={cx(styles.item, isActive && styles.active, list.pinned && styles.pinned)}
      onClick={onSelect}
    >
      <div className={styles.dot} style={{ background: c.dot }} />
      <span className={styles.name}>{list.name}</span>
      <span className={styles.pin} title={list.pinned ? 'Losgemaakt' : 'Pinnen'}>
        {list.pinned ? '📌' : '📍'}
      </span>
      <div className={styles.actions}>
        <button
          className={styles.actBtn}
          title={list.pinned ? 'Losgemaakt' : 'Pinnen'}
          onClick={e => { e.stopPropagation(); onPin() }}
        >
          {list.pinned ? '📌' : '📍'}
        </button>
        <button
          className={styles.actBtn}
          title="Hernoem"
          onClick={e => { e.stopPropagation(); onEdit() }}
        >
          ✎
        </button>
        <button
          className={styles.actBtn}
          title="Verwijder"
          onClick={e => { e.stopPropagation(); onDelete() }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
