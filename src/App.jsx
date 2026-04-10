import { useState, useEffect, useRef } from 'react'
import cx from 'clsx'
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase.js'
import { useAuth } from './hooks/useAuth.js'
import { useLists } from './hooks/useLists.js'
import { uid, formatSize } from './constants.js'
import { Auth } from './components/Auth/Auth.jsx'
import { Aside } from './components/Aside/Aside.jsx'
import { ThemeCard } from './components/ThemeCard/ThemeCard.jsx'
import { Coach } from './components/Coach/Coach.jsx'
import { Notes } from './components/Notes/Notes.jsx'
import { ListModal } from './components/modals/ListModal.jsx'
import { ThemeModal } from './components/modals/ThemeModal.jsx'
import { DeadlineModal } from './components/modals/DeadlineModal.jsx'
import { ConfirmModal } from './components/modals/ConfirmModal.jsx'
import styles from './App.module.css'

export function App() {
  const { user, loading } = useAuth()
  const { listsData } = useLists(user?.uid)
  const [currentListId, setCurrentListId] = useState(null)
  const [activeTab, setActiveTab] = useState('tasks')
  const [coachHistory, setCoachHistory] = useState([])
  const [modal, setModal] = useState(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const titleInputRef = useRef(null)

  const currentList = currentListId ? listsData[currentListId] : null

  // Always read fresh list data to avoid stale-closure overwrites
  function freshList(id = currentListId) {
    return listsData[id]
  }

  useEffect(() => {
    if (user?.uid) ensureDefaultData(user.uid)
  }, [user?.uid])

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [editingTitle])

  async function ensureDefaultData(userId) {
    const ref = doc(db, 'users', userId, 'lists', 'leerdoelen-2026')
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        id: 'leerdoelen-2026',
        name: 'Leerdoelen 2026',
        desc: 'Persoonlijk ontwikkelplan 2026',
        colorIdx: 1,
        pinned: true,
        createdAt: Date.now(),
        tags: [
          { id: 'q1', name: 'Q1', color: '#2563eb' },
          { id: 'q2', name: 'Q2', color: '#16a34a' },
          { id: 'q3', name: 'Q3', color: '#d97706' },
          { id: 'q4', name: 'Q4', color: '#dc2626' },
        ],
        themes: [
          {
            id: 't1', name: 'Technische specialisatie', sub: 'Motion · Rive · ThreeJS', colorIdx: 1, tasks: [
              { id: 'a1', text: "2 kleine Rive demo's bouwen", tags: ['q1'], done: false, deadline: null },
              { id: 'a2', text: 'Rive integreren in React project', tags: ['q2'], done: false, deadline: null },
              { id: 'a3', text: 'Rive in een echt project gebruiken', tags: ['q2'], done: false, deadline: null },
              { id: 'a4', text: 'Interne presentatie Rive + Bol Careers + Bento grid', tags: ['q1'], done: false, deadline: null },
              { id: 'a5', text: 'ThreeJS basics: scene, camera, lighting, shaders', tags: ['q2'], done: false, deadline: null },
              { id: 'a6', text: 'ThreeJS scroll-animatie bouwen', tags: ['q2'], done: false, deadline: null },
              { id: 'a7', text: 'ThreeJS in een echt project (optioneel)', tags: ['q3'], done: false, deadline: null },
              { id: 'a8', text: 'Aanspreekpunt zijn voor motion-vragen', tags: ['q4'], done: false, deadline: null },
            ],
          },
          {
            id: 't2', name: 'Technisch leiderschap', sub: 'Formaliseren · pro-actief delen', colorIdx: 2, tasks: [
              { id: 'b1', text: 'Wekelijks intern delen in tech-overleg', tags: ['q1'], done: false, deadline: null },
              { id: 'b2', text: "Pro-actief collega's helpen als iemand vastloopt", tags: ['q1'], done: false, deadline: null },
              { id: 'b3', text: 'Uitdagingen écht aankaarten zonder mee te gaan', tags: ['q1'], done: false, deadline: null },
              { id: 'b4', text: 'Technische aandachtspunten bij projectstart inbrengen', tags: ['q1'], done: false, deadline: null },
              { id: 'b5', text: 'Korte notities van issues in meetings → Slack', tags: ['q2'], done: false, deadline: null },
              { id: 'b6', text: 'Voorstellen schrijven vanuit kennisbank', tags: ['q2'], done: false, deadline: null },
              { id: 'b7', text: 'Patronen van het jaar documenteren', tags: ['q4'], done: false, deadline: null },
            ],
          },
          {
            id: 't3', name: 'Technische basis', sub: 'React · TypeScript · PHP', colorIdx: 4, tasks: [
              { id: 'c1', text: 'React deep dive starten', tags: ['q1'], done: false, deadline: null },
              { id: 'c2', text: 'Bijhouden welke docs ik blijf openen → studeren', tags: ['q1'], done: false, deadline: null },
              { id: 'c3', text: 'PHP walkthrough plannen met backend developer', tags: ['q1'], done: false, deadline: null },
              { id: 'c4', text: 'PHP basics: routing & basis', tags: ['q1'], done: false, deadline: null },
              { id: 'c5', text: '1 feature bouwen in PHP', tags: ['q2'], done: false, deadline: null },
              { id: 'c6', text: 'Kennisbank / snippet systeem opzetten', tags: ['q1'], done: false, deadline: null },
              { id: 'c7', text: 'Persoonlijke patterns library bouwen', tags: ['q3'], done: false, deadline: null },
              { id: 'c8', text: 'Maandelijkse deep dive bijhouden (1×/maand)', tags: ['q2'], done: false, deadline: null },
            ],
          },
        ],
        notes: '',
        attachments: [],
      })
    }
  }

  function selectList(id) {
    setCurrentListId(id)
    setActiveTab('tasks')
    setCoachHistory([])
    setEditingTitle(false)
    setSidebarOpen(false)
  }

  function listRef(id) {
    return doc(db, 'users', user.uid, 'lists', id)
  }

  async function saveCurrentList(updates) {
    const list = freshList()
    await setDoc(listRef(currentListId), { ...list, ...updates })
  }

  // --- List actions ---
  async function handleSaveList({ name, desc, colorIdx }, listId) {
    const id = listId || uid()
    const existing = listsData[id] || {}
    await setDoc(listRef(id), {
      ...existing,
      id,
      name,
      desc,
      colorIdx,
      createdAt: existing.createdAt || Date.now(),
      tags: existing.tags || [],
      themes: existing.themes || [],
      notes: existing.notes || '',
      attachments: existing.attachments || [],
    })
    if (!listId) selectList(id)
  }

  async function handleTogglePin(id) {
    const list = listsData[id]
    await setDoc(listRef(id), { ...list, pinned: !list.pinned })
  }

  async function handleDeleteList(id) {
    await deleteDoc(listRef(id))
    if (currentListId === id) setCurrentListId(null)
  }

  // --- Title edit ---
  function startEditTitle() {
    setTitleValue(currentList.name)
    setEditingTitle(true)
  }

  async function saveTitle() {
    const name = titleValue.trim()
    setEditingTitle(false)
    if (!name || !currentListId) return
    await saveCurrentList({ name })
  }

  // --- Theme actions ---
  async function handleSaveTheme({ name, sub, colorIdx }, themeId) {
    const themes = themeId
      ? currentList.themes.map(t => t.id === themeId ? { ...t, name, sub, colorIdx } : t)
      : [...(currentList.themes || []), { id: uid(), name, sub, colorIdx, tasks: [] }]
    await saveCurrentList({ themes })
  }

  async function handleDeleteTheme(themeId) {
    await saveCurrentList({ themes: currentList.themes.filter(t => t.id !== themeId) })
  }

  // --- Task actions ---
  async function handleToggleTask(themeId, taskId) {
    const themes = currentList.themes.map(t => {
      if (t.id !== themeId) return t
      return { ...t, tasks: t.tasks.map(task => task.id === taskId ? { ...task, done: !task.done } : task) }
    })
    await saveCurrentList({ themes })
  }

  async function handleAddTask(themeId, text) {
    const themes = currentList.themes.map(t => {
      if (t.id !== themeId) return t
      return { ...t, tasks: [...t.tasks, { id: uid(), text, tags: [], done: false, deadline: null }] }
    })
    await saveCurrentList({ themes })
  }

  async function handleDeleteTask(themeId, taskId) {
    const themes = currentList.themes.map(t => {
      if (t.id !== themeId) return t
      return { ...t, tasks: t.tasks.filter(task => task.id !== taskId) }
    })
    await saveCurrentList({ themes })
  }

  // --- Tag actions ---
  async function handleAddTag(themeId, taskId, tagId) {
    const list = freshList()
    const themes = list.themes.map(t => {
      if (t.id !== themeId) return t
      return {
        ...t,
        tasks: t.tasks.map(task => {
          if (task.id !== taskId) return task
          const tags = task.tags || []
          if (tags.includes(tagId)) return task
          return { ...task, tags: [...tags, tagId] }
        }),
      }
    })
    await setDoc(listRef(currentListId), { ...list, themes })
  }

  async function handleRemoveTag(themeId, taskId, tagId) {
    const list = freshList()
    const themes = list.themes.map(t => {
      if (t.id !== themeId) return t
      return {
        ...t,
        tasks: t.tasks.map(task => {
          if (task.id !== taskId) return task
          return { ...task, tags: (task.tags || []).filter(id => id !== tagId) }
        }),
      }
    })
    await setDoc(listRef(currentListId), { ...list, themes })
  }

  async function handleCreateTag(themeId, taskId, name, color) {
    const list = freshList()
    const newTag = { id: uid(), name, color }
    const themes = list.themes.map(t => {
      if (t.id !== themeId) return t
      return {
        ...t,
        tasks: t.tasks.map(task => {
          if (task.id !== taskId) return task
          return { ...task, tags: [...(task.tags || []), newTag.id] }
        }),
      }
    })
    await setDoc(listRef(currentListId), { ...list, tags: [...(list.tags || []), newTag], themes })
  }

  // --- Deadline ---
  async function handleSaveDeadline(themeId, taskId, date) {
    const themes = currentList.themes.map(t => {
      if (t.id !== themeId) return t
      return {
        ...t,
        tasks: t.tasks.map(task => task.id === taskId ? { ...task, deadline: date || null } : task),
      }
    })
    await saveCurrentList({ themes })
  }

  // --- Notes / attachments ---
  async function handleSaveNotes(notes) {
    await saveCurrentList({ notes })
  }

  async function handleAddAttachment(files) {
    const attachments = [
      ...(currentList.attachments || []),
      ...files.map(f => ({ id: uid(), ...f })),
    ]
    await saveCurrentList({ attachments })
  }

  async function handleDeleteAttachment(id) {
    await saveCurrentList({ attachments: (currentList.attachments || []).filter(a => a.id !== id) })
  }

  // --- Render ---
  if (loading) return null
  if (!user) return <Auth />

  const themes = currentList?.themes || []
  const totalTasks = themes.reduce((n, t) => n + t.tasks.length, 0)
  const doneTasks = themes.reduce((n, t) => n + t.tasks.filter(tk => tk.done).length, 0)
  const pct = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0

  return (
    <div className={styles.app}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <button
        className={styles.hamburger}
        onClick={() => setSidebarOpen(v => !v)}
        aria-label="Menu openen"
      >
        ☰
      </button>

      <Aside
        lists={listsData}
        currentListId={currentListId}
        onSelectList={selectList}
        onNewList={() => setModal({ type: 'list' })}
        onEditList={id => setModal({ type: 'list', listId: id })}
        onDeleteList={id => setModal({
          type: 'confirm',
          message: `Lijst "${listsData[id]?.name}" verwijderen?`,
          onConfirm: () => handleDeleteList(id),
        })}
        onTogglePin={handleTogglePin}
        user={user}
        open={sidebarOpen}
      />

      <main className={styles.main}>
        {currentList ? (
          <>
            <div className={styles.mainHeader}>
              <div className={styles.titleWrap}>
                {editingTitle ? (
                  <input
                    ref={titleInputRef}
                    className={styles.titleInput}
                    value={titleValue}
                    onChange={e => setTitleValue(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={e => e.key === 'Enter' && saveTitle()}
                  />
                ) : (
                  <span className={styles.titleDisplay}>{currentList.name}</span>
                )}
                <button className={styles.editTitleBtn} onClick={startEditTitle} title="Hernoem lijst">✎</button>
              </div>
            </div>

            <div className={styles.tabs}>
              {[['tasks', 'Taken'], ['coach', 'Coach'], ['notes', 'Notities']].map(([key, label]) => (
                <button
                  key={key}
                  className={cx(styles.tab, activeTab === key && styles.tabActive)}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className={styles.content}>
              {activeTab === 'tasks' && (
                <>
                  <div className={styles.statsRow}>
                    <div className={styles.stat}><div className={styles.statVal}>{doneTasks}</div><div className={styles.statLbl}>afgerond</div></div>
                    <div className={styles.stat}><div className={styles.statVal}>{pct}%</div><div className={styles.statLbl}>voortgang</div></div>
                    <div className={styles.stat}><div className={styles.statVal}>{totalTasks - doneTasks}</div><div className={styles.statLbl}>open</div></div>
                  </div>
                  {themes.map(theme => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      listTags={currentList.tags || []}
                      onEdit={() => setModal({ type: 'theme', themeId: theme.id })}
                      onDelete={() => setModal({
                        type: 'confirm',
                        message: `Groep "${theme.name}" en alle taken verwijderen?`,
                        onConfirm: () => handleDeleteTheme(theme.id),
                      })}
                      onToggleTask={handleToggleTask}
                      onAddTask={handleAddTask}
                      onDeleteTask={(themeId, taskId) => setModal({
                        type: 'confirm',
                        message: `Taak verwijderen?`,
                        onConfirm: () => handleDeleteTask(themeId, taskId),
                      })}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                      onCreateTag={handleCreateTag}
                      onSetDeadline={(themeId, taskId, current) => setModal({ type: 'deadline', themeId, taskId, current })}
                    />
                  ))}
                  <button
                    className={styles.addThemeBtn}
                    onClick={() => setModal({ type: 'theme' })}
                  >
                    + groep toevoegen
                  </button>
                </>
              )}
              {activeTab === 'coach' && (
                <Coach
                  list={currentList}
                  user={user}
                  history={coachHistory}
                  onHistoryUpdate={setCoachHistory}
                />
              )}
              {activeTab === 'notes' && (
                <Notes
                  key={currentListId}
                  list={currentList}
                  onSave={handleSaveNotes}
                  onAddAttachment={handleAddAttachment}
                  onDeleteAttachment={handleDeleteAttachment}
                />
              )}
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>←</div>
            <div className={styles.emptyText}>selecteer een lijst</div>
          </div>
        )}
      </main>

      {modal?.type === 'list' && (
        <ListModal
          list={modal.listId ? listsData[modal.listId] : null}
          onSave={data => handleSaveList(data, modal.listId || null)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'theme' && (
        <ThemeModal
          theme={modal.themeId ? currentList?.themes.find(t => t.id === modal.themeId) : null}
          onSave={data => handleSaveTheme(data, modal.themeId || null)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'deadline' && (
        <DeadlineModal
          current={modal.current}
          onSave={date => handleSaveDeadline(modal.themeId, modal.taskId, date)}
          onClear={() => handleSaveDeadline(modal.themeId, modal.taskId, null)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'confirm' && (
        <ConfirmModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
