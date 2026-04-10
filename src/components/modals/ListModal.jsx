import { useState } from 'react'
import { COLORS } from '../../constants.js'
import styles from './Modal.module.css'

export function ListModal({ list, onSave, onClose }) {
  const [name, setName] = useState(list?.name || '')
  const [desc, setDesc] = useState(list?.desc || '')
  const [colorIdx, setColorIdx] = useState(list?.colorIdx ?? 0)

  function handleSave() {
    if (!name.trim()) return
    onSave({ name: name.trim(), desc: desc.trim(), colorIdx })
    onClose()
  }

  return (
    <div className={styles.bg} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h3>{list ? 'Lijst bewerken' : 'Nieuwe lijst'}</h3>

        <label>Naam</label>
        <input
          type="text"
          placeholder="Bijv. Leerdoelen 2026"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        <label>Beschrijving</label>
        <input
          type="text"
          placeholder="Optioneel"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />

        <label>Kleur</label>
        <div className={styles.colorRow}>
          {COLORS.map((c, i) => (
            <div
              key={i}
              className={`${styles.swatch}${i === colorIdx ? ` ${styles.swatchSelected}` : ''}`}
              style={{ background: c.dot }}
              onClick={() => setColorIdx(i)}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>Annuleer</button>
          <button className={styles.btnSave} onClick={handleSave}>Opslaan</button>
        </div>
      </div>
    </div>
  )
}
