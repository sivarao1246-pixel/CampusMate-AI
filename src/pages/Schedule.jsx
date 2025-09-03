import React, { useEffect, useState } from 'react'
import scheduleData from '../data/schedule.json'
import { listCalendarEvents, createCalendarEvent } from '../utils/api'
import { ensureToken, SCOPES } from '../auth/google'

export default function Schedule() {
  // ---- Local Dummy Schedule (from JSON/localStorage) ----
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cm_schedule') || 'null')
    setItems(saved || scheduleData)
  }, [])

  function addItem(e) {
    e.preventDefault()
    if (!title || !time) return
    const next = [...items, { title, time }]
    setItems(next)
    localStorage.setItem('cm_schedule', JSON.stringify(next))
    setTitle(''); setTime('')
  }

  // ---- Google Calendar API Integration ----
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    summary: '',
    description: '',
    start: '',
    end: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      await ensureToken(SCOPES.calendar)
      const data = await listCalendarEvents({ maxResults: 10, timeMin: new Date() })
      setEvents(data.items || [])
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await ensureToken(SCOPES.calendar)
      await createCalendarEvent({
        summary: form.summary,
        description: form.description,
        startISO: new Date(form.start).toISOString(),
        endISO: new Date(form.end).toISOString(),
        timeZone: form.timeZone
      })
      setForm({ ...form, summary: '', description: '', start: '', end: '' })
      await load()
    } catch (e) {
      setError(String(e))
    }
  }

  // ---- UI Combined ----
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Local Dummy Schedule */}
      <div className="card p-6 bg-white/80">
        <h2 className="text-xl font-semibold mb-2">Today at a glance (Local)</h2>
        <ul className="divide-y">
          {items.map((it, idx) => (
            <li key={idx} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-slate-500">Time: {it.time}</div>
              </div>
              <button
                className="text-xs link"
                onClick={() => {
                  const next = items.filter((_, i) => i !== idx)
                  setItems(next)
                  localStorage.setItem('cm_schedule', JSON.stringify(next))
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={addItem} className="mt-4 grid sm:grid-cols-3 gap-3">
          <input
            placeholder="Title (e.g., Math Lecture)"
            className="border rounded-xl px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            placeholder="Time (e.g., 10:00–11:00)"
            className="border rounded-xl px-3 py-2"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
          <button className="btn-primary">Add</button>
        </form>
      </div>

      {/* Google Calendar Integration */}
      <div className="card p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Google Calendar</h2>

        <form onSubmit={submit} className="grid gap-3 mb-6">
          <input
            className="border p-2 rounded"
            placeholder="Event title"
            value={form.summary}
            onChange={e => setForm({ ...form, summary: e.target.value })}
            required
          />
          <textarea
            className="border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <label className="text-sm text-left">Start</label>
          <input
            className="border p-2 rounded"
            type="datetime-local"
            value={form.start}
            onChange={e => setForm({ ...form, start: e.target.value })}
            required
          />
          <label className="text-sm text-left">End</label>
          <input
            className="border p-2 rounded"
            type="datetime-local"
            value={form.end}
            onChange={e => setForm({ ...form, end: e.target.value })}
            required
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
            Create Event
          </button>
        </form>

        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Upcoming Google Events</h3>
          <button onClick={load} className="px-3 py-1 rounded bg-gray-800 text-white">
            Refresh
          </button>
        </div>

        {loading && <p>Loading…</p>}
        {error && <pre className="text-red-700 whitespace-pre-wrap">{error}</pre>}
        <ul className="space-y-2 text-left">
          {events.map(ev => (
            <li key={ev.id} className="border p-3 rounded">
              <div className="font-medium">{ev.summary || '(no title)'}</div>
              <div className="text-sm">
                {ev.start?.dateTime || ev.start?.date} → {ev.end?.dateTime || ev.end?.date}
              </div>
              {ev.location && <div className="text-sm opacity-80">{ev.location}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
