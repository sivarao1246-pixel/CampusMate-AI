
import React, { useEffect, useState } from 'react'
import tipsData from '../data/tips.json'

export default function StudySuggestions() {
  const [tips, setTips] = useState([])
  const [text, setText] = useState('')

  useEffect(() => { setTips(tipsData) }, [])

  function addTip(e){
    e.preventDefault()
    if(!text) return
    const next = [...tips, { title: text, tag: 'custom' }]
    setTips(next); setText('')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-2xl font-semibold">Study Suggestions</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 bg-white/80">
          <h3 className="font-semibold mb-4">Popular Methods</h3>
          <ul className="space-y-3">
            {tips.map((t, i) => (
              <li key={i} className="p-3 rounded-xl border bg-white">
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-slate-500">{t.tag}</div>
              </li>
            ))}
          </ul>
          <form onSubmit={addTip} className="mt-4 flex gap-3">
            <input className="flex-1 border rounded-xl px-3 py-2" placeholder="Add your own tip..." value={text} onChange={e=>setText(e.target.value)} />
            <button className="btn-primary">Add</button>
          </form>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Ask the AI for tips</h3>
          <p className="text-sm text-slate-600">Open the chat (bottom-right) and ask: “Create a 2-hour study plan for Calculus with Pomodoro.”</p>
        </div>
      </div>
    </div>
  )
}
