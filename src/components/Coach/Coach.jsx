import { useState, useRef, useEffect } from 'react'
import { WORKER_URL } from '../../constants.js'
import styles from './Coach.module.css'

export function Coach({ list, user, history, onHistoryUpdate }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const msgsRef = useRef(null)

  useEffect(() => {
    if (history.length === 0) return
    scrollToBottom()
  }, [history])

  function scrollToBottom() {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }

  async function sendMsg(text) {
    if (!text?.trim() || loading) return
    const userMsg = text.trim()
    setInput('')

    const newHistory = [...history, { role: 'user', content: userMsg }]
    onHistoryUpdate(newHistory)
    setLoading(true)
    scrollToBottom()

    const progress = (list?.themes || []).map(t => {
      const done = t.tasks.filter(x => x.done).length
      return `${t.name}: ${done}/${t.tasks.length} taken`
    }).join(', ')
    const upcoming = (list?.themes || [])
      .flatMap(t => t.tasks.filter(tk => tk.deadline && !tk.done))
      .map(tk => `"${tk.text}" (${tk.deadline})`)
      .join(', ')

    const systemPrompt = `Je bent een persoonlijke coach voor een frontend developer. Lijst: "${list?.name || ''}". Beschrijving: "${list?.desc || ''}". Voortgang: ${progress}. Aankomende deadlines: ${upcoming || 'geen'}. Antwoord in het Nederlands, direct en concreet, max 3-4 zinnen.`

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newHistory,
        }),
      })
      const data = await res.json()
      const reply = data.content?.find(b => b.type === 'text')?.text || 'Geen antwoord.'
      onHistoryUpdate([...newHistory, { role: 'assistant', content: reply }])
    } catch {
      onHistoryUpdate([...newHistory, { role: 'assistant', content: 'Kon de coach niet bereiken. Controleer of de Cloudflare Worker actief is.' }])
    } finally {
      setLoading(false)
    }
  }

  const messages = history.length === 0
    ? [{ role: 'coach', content: 'Hey! Ik ken je lijst en je voortgang. Stel me een vraag of laat me je toetsen. 👋' }]
    : history

  return (
    <div className={styles.wrap}>
      <div className={styles.msgs} ref={msgsRef}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? styles.msgUser : styles.msgCoach}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className={styles.msgCoach}>
            <span className={styles.dotLoader}>
              <span className={styles.dl} />
              <span className={styles.dl} />
              <span className={styles.dl} />
            </span>
          </div>
        )}
      </div>

      <div className={styles.quickBtns}>
        {['Hoe sta ik ervoor?', 'Toets mij op mijn voortgang', 'Geef me een uitdaging voor deze week', 'Wat heeft de hoogste prioriteit nu?'].map(q => (
          <button key={q} className={styles.qbtn} onClick={() => sendMsg(q)}>{q}</button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Stel een vraag of geef een update..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
        />
        <button className={styles.sendBtn} onClick={() => sendMsg(input)}>→</button>
      </div>
    </div>
  )
}
