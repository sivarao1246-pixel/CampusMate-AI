import React, { useEffect, useState } from 'react'
import tasksData from '../data/tasks.json'
import { listTasks, insertTask } from '../utils/api'
import { ensureToken, SCOPES } from '../auth/google'

export default function Tasks() {
  // ---- Local Tasks (dummy + localStorage) ----
  const [localTasks, setLocalTasks] = useState([])
  const [localTitle, setLocalTitle] = useState('')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cm_tasks') || 'null')
    setLocalTasks(saved || tasksData)
  }, [])

  function addLocalTask(e) {
    e.preventDefault()
    if (!localTitle) return
    const next = [...localTasks, { title: localTitle, done: false }]
    setLocalTasks(next)
    localStorage.setItem('cm_tasks', JSON.stringify(next))
    setLocalTitle('')
  }

  function toggle(idx) {
    const next = localTasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t)
    setLocalTasks(next)
    localStorage.setItem('cm_tasks', JSON.stringify(next))
  }

  function remove(idx) {
    const next = localTasks.filter((_, i) => i !== idx)
    setLocalTasks(next)
    localStorage.setItem('cm_tasks', JSON.stringify(next))
  }

  // ---- Google Tasks API ----
  const [gTasks, setGTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [gTitle, setGTitle] = useState('')
  const [gNotes, setGNotes] = useState('')

  const loadGoogleTasks = async () => {
    setLoading(true)
    setError('')
    try {
      await ensureToken(SCOPES.tasks)
      const data = await listTasks({ maxResults: 20 })
      setGTasks(data.items || [])
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGoogleTasks() }, [])

  const addGoogleTask = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await ensureToken(SCOPES.tasks)
      await insertTask({ title: gTitle, notes: gNotes })
      setGTitle(''); setGNotes('')
      await loadGoogleTasks()
    } catch (e) {
      setError(String(e))
    }
  }

  // ---- UI Combined ----
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      
      {/* Local Dummy Tasks */}
      <div className="card p-6 bg-white/80">
        <h2 className="text-2xl font-semibold mb-4">Local Tasks & Reminders</h2>
        <form onSubmit={addLocalTask} className="flex gap-3">
          <input
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder="New task..."
            value={localTitle}
            onChange={e => setLocalTitle(e.target.value)}
          />
          <button className="btn-primary">Add</button>
        </form>
        <ul className="mt-4 space-y-2">
          {localTasks.map((t, idx) => (
            <li key={idx} className="flex items-center justify-between p-3 rounded-xl border bg-white">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={t.done} onChange={() => toggle(idx)} />
                <span className={t.done ? 'line-through text-slate-500' : ''}>{t.title}</span>
              </label>
              <button className="text-xs link" onClick={() => remove(idx)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Google Tasks */}
      <div className="card p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-6">Google Tasks</h2>

        <form onSubmit={addGoogleTask} className="grid gap-3 mb-6">
          <input
            className="border p-3 rounded"
            placeholder="Task title"
            value={gTitle}
            onChange={e => setGTitle(e.target.value)}
            required
          />
          <textarea
            className="border p-3 rounded"
            placeholder="Notes"
            value={gNotes}
            onChange={e => setGNotes(e.target.value)}
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
            Add Task
          </button>
        </form>

        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Your Google Tasks</h3>
          <button onClick={loadGoogleTasks} className="px-3 py-1 rounded bg-gray-800 text-white">
            Refresh
          </button>
        </div>

        {loading && <p>Loading…</p>}
        {error && <pre className="text-red-700 whitespace-pre-wrap">{error}</pre>}

        <ul className="space-y-3 text-left">
          {gTasks.map(t => (
            <li key={t.id} className="border p-4 rounded">
              <div className="font-medium">{t.title}</div>
              {t.notes && <div className="text-sm text-gray-600">{t.notes}</div>}
              {t.status && <div className="text-xs text-gray-500">Status: {t.status}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
