import { useState } from 'react'
import { COLORS } from '../../constants.js'
import styles from './Modal.module.css'

export function ThemeModal({ theme, onSave, onClose }) {
  const [name, setName] = useState(theme?.name || '')
  const [sub, setSub] = useState(theme?.sub || '')
  const [colorIdx, setColorIdx] = useState(theme?.colorIdx ?? 0)

  function handleSave() {
    if (!name.trim()) return
    onSave({ name: name.trim(), sub: sub.trim(), colorIdx })
    onClose()
  }

  return (
    <div className={styles.bg} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h3>{theme ? 'Groep bewerken' : 'Nieuwe groep'}</h3>

        <label>Naam</label>
        <input
          type="text"
          placeholder="Bijv. Technische specialisatie"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        <label>Omschrijving</label>
        <input
          type="text"
          placeholder="Kort: wat ga je leren?"
          value={sub}
          onChange={e => setSub(e.target.value)}
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
