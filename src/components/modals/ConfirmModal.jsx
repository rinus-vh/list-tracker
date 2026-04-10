import styles from './Modal.module.css'

export function ConfirmModal({ message, onConfirm, onClose }) {
  function handleConfirm() {
    onConfirm()
    onClose()
  }

  return (
    <div className={styles.bg} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h3>Weet je het zeker?</h3>
        <p className={styles.confirmText}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>Annuleer</button>
          <button className={styles.btnDanger} onClick={handleConfirm}>Verwijder</button>
        </div>
      </div>
    </div>
  )
}
