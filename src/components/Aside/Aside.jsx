import cx from 'clsx'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase.js'
import { ListItem } from '../ListItem/ListItem.jsx'
import styles from './Aside.module.css'

export function Aside({ lists, currentListId, onSelectList, onNewList, onEditList, onDeleteList, onTogglePin, user, open }) {
  const sorted = Object.values(lists).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  const pinned = sorted.filter(l => l.pinned)
  const unpinned = sorted.filter(l => !l.pinned)

  async function handleSignOut() {
    if (confirm('Uitloggen?')) await signOut(auth)
  }

  return (
    <aside className={cx(styles.aside, open && styles.open)}>
      <div className={styles.header}>
        <span className={styles.logo}>list tracker</span>
        <div className={styles.avatar} onClick={handleSignOut} title="Uitloggen">
          {user?.photoURL
            ? <img src={user.photoURL} alt="" />
            : user?.displayName?.[0] || '?'
          }
        </div>
      </div>

      <div className={styles.scroll}>
        {pinned.length > 0 && (
          <>
            <div className={styles.section}>Gepind</div>
            {pinned.map(l => (
              <ListItem
                key={l.id}
                list={l}
                isActive={l.id === currentListId}
                onSelect={() => onSelectList(l.id)}
                onPin={() => onTogglePin(l.id)}
                onEdit={() => onEditList(l.id)}
                onDelete={() => onDeleteList(l.id)}
              />
            ))}
          </>
        )}
        <div className={styles.section}>Lijsten</div>
        {unpinned.map(l => (
          <ListItem
            key={l.id}
            list={l}
            isActive={l.id === currentListId}
            onSelect={() => onSelectList(l.id)}
            onPin={() => onTogglePin(l.id)}
            onEdit={() => onEditList(l.id)}
            onDelete={() => onDeleteList(l.id)}
          />
        ))}
      </div>

      <div className={styles.bottom}>
        <button className={styles.addBtn} onClick={onNewList}>+ nieuwe lijst</button>
      </div>
    </aside>
  )
}
