import { useState, useRef } from 'react'
import { formatSize, fileIcon } from '../../constants.js'
import styles from './Notes.module.css'

export function Notes({ list, onSave, onAddAttachment, onDeleteAttachment }) {
  const [notes, setNotes] = useState(list.notes || '')
  const [dragover, setDragover] = useState(false)
  const timerRef = useRef(null)

  function handleNotesChange(e) {
    setNotes(e.target.value)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onSave(e.target.value), 800)
  }

  function handleFiles(files) {
    onAddAttachment(Array.from(files).map(f => ({
      name: f.name,
      size: formatSize(f.size),
      type: f.type,
    })))
  }

  const attachments = list.attachments || []

  return (
    <div className={styles.area}>
      <div>
        <div className={styles.label}>Beschrijving</div>
        <textarea
          className={styles.textarea}
          placeholder="Schrijf een beschrijving voor deze lijst..."
          value={notes}
          onChange={handleNotesChange}
        />
      </div>

      <div className={styles.attachSection}>
        <div className={styles.attachHeader}>
          <span>Bijlagen</span>
          <span className={styles.attachCount}>
            {attachments.length} bestand{attachments.length !== 1 ? 'en' : ''}
          </span>
        </div>

        {attachments.length > 0 && (
          <div className={styles.attachList}>
            {attachments.map(a => (
              <div key={a.id} className={styles.attachItem}>
                <span className={styles.attachIcon}>{fileIcon(a.name)}</span>
                <span className={styles.attachName}>{a.name}</span>
                <span className={styles.attachSize}>{a.size}</span>
                <button className={styles.attachDel} onClick={() => onDeleteAttachment(a.id)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <label
          className={`${styles.dropZone}${dragover ? ` ${styles.dragover}` : ''}`}
          onDragOver={e => { e.preventDefault(); setDragover(true) }}
          onDragLeave={() => setDragover(false)}
          onDrop={e => { e.preventDefault(); setDragover(false); handleFiles(e.dataTransfer.files) }}
        >
          <input type="file" multiple onChange={e => handleFiles(e.target.files)} />
          <div>+ sleep bestanden hierheen of klik om te uploaden</div>
          <div className={styles.dropSub}>bestandsnaam &amp; grootte worden opgeslagen</div>
        </label>
      </div>
    </div>
  )
}
