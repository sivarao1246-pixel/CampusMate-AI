import React, { useEffect, useMemo, useState } from 'react'
import emailsData from '../data/emails.json'
import { listGmailMessages, sendGmail } from '../utils/api'
import { ensureToken, SCOPES } from '../auth/google'

export default function Emails() {
  // ---- Local Dummy Emails ----
  const [emails, setEmails] = useState([])
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('important')

  useEffect(() => {
    setEmails(emailsData)
  }, [])

  const filteredLocal = useMemo(() => {
    return emails.filter(e => {
      const isTab = tab === 'important' ? e.important : !e.important
      return (
        isTab &&
        (e.subject.toLowerCase().includes(query.toLowerCase()) ||
          e.sender.toLowerCase().includes(query.toLowerCase()))
      )
    })
  }, [emails, query, tab])

  // ---- Gmail API ----
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' })

  const loadGmail = async () => {
    setLoading(true)
    setError('')
    try {
      await ensureToken(SCOPES.gmail)
      const data = await listGmailMessages({ maxResults: 5 })
      setMessages(data)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGmail() }, [])

  const onSend = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await ensureToken(SCOPES.gmail)
      await sendGmail(compose)
      setCompose({ to: '', subject: '', body: '' })
      await loadGmail()
    } catch (e) {
      setError(String(e))
    }
  }

  // ---- UI Combined ----
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Local Dummy Emails */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">Local Emails</h2>
          <div className="text-sm text-slate-600">Sample data (JSON). Search & filter below.</div>
        </div>
        <div className="card p-4 bg-white/80">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 border rounded-xl px-3 py-2"
              placeholder="Search subject or sender..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="rounded-xl p-1 bg-slate-100">
              <button
                onClick={() => setTab('important')}
                className={'px-3 py-1 rounded-lg ' + (tab === 'important' ? 'bg-white shadow' : '')}
              >
                Important
              </button>
              <button
                onClick={() => setTab('other')}
                className={'px-3 py-1 rounded-lg ' + (tab === 'other' ? 'bg-white shadow' : '')}
              >
                Other
              </button>
            </div>
          </div>
          <ul className="mt-4 divide-y">
            {filteredLocal.map((m, idx) => (
              <li key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.subject}</div>
                  <div className="text-xs text-slate-500">From: {m.sender} • {m.time}</div>
                </div>
                <button className="text-xs link">Open</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gmail Integration */}
      <div className="card p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Gmail Dashboard</h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Gmail Messages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recent Gmail</h3>
              <button
                onClick={loadGmail}
                className="px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                Refresh
              </button>
            </div>
            {loading && <p className="text-gray-500">Loading…</p>}
            {error && <pre className="text-red-700 whitespace-pre-wrap">{error}</pre>}
            <ul className="space-y-3">
              {messages.map(m => (
                <li key={m.id} className="border p-4 rounded hover:bg-gray-100 transition">
                  <div className="text-sm text-gray-500">{m.from}</div>
                  <div className="font-medium">{m.subject}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{m.snippet}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Gmail Compose */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Compose Email</h3>
            <form onSubmit={onSend} className="grid gap-4">
              <input
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="To"
                value={compose.to}
                onChange={e => setCompose({ ...compose, to: e.target.value })}
                required
              />
              <input
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Subject"
                value={compose.subject}
                onChange={e => setCompose({ ...compose, subject: e.target.value })}
                required
              />
              <textarea
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Body"
                rows="6"
                value={compose.body}
                onChange={e => setCompose({ ...compose, body: e.target.value })}
                required
              />
              <button
                className="bg-blue-600 text-white px-4 py-3 rounded font-medium hover:bg-blue-500 transition"
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
