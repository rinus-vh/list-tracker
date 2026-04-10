import { useState } from 'react'
import styles from './Modal.module.css'

export function DeadlineModal({ current, onSave, onClear, onClose }) {
  const [date, setDate] = useState(current || '')

  return (
    <div className={styles.bg} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h3>Deadline instellen</h3>

        <label>Datum</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          autoFocus
        />

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>Annuleer</button>
          <button className={`${styles.btnCancel} ${styles.btnCancelRed}`} onClick={() => { onClear(); onClose() }}>
            Verwijder
          </button>
          <button className={styles.btnSave} onClick={() => { onSave(date); onClose() }}>Opslaan</button>
        </div>
      </div>
    </div>
  )
}
