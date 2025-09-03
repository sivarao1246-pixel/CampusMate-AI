
import React, { useState } from 'react'
import axios from 'axios'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{role:'assistant', content:'Hi! I’m your CampusMate AI. Ask me to plan your day, summarize emails, or suggest study tips.'}])
  const [input, setInput] = useState('')

  async function sendMessage(e) {
    e.preventDefault()
    const userMsg = { role: 'user', content: input.trim() }
    if (!userMsg.content) return
    setMessages(prev => [...prev, userMsg])
    setInput('')

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    try {
      if (apiKey) {
        const res = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant for college students. Be concise and specific.' },
            ...messages.slice(-6),
            userMsg
          ]
        }, { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }})
        const reply = res.data.choices?.[0]?.message?.content || 'I had trouble generating a response.'
        setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      } else {
        // Local mock
        setTimeout(() => {
          const reply = "Mock: I'll add this to your plan. (Set VITE_OPENAI_API_KEY to enable real AI.)"
          setMessages(prev => [...prev, { role: 'assistant', content: reply }])
        }, 600)
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting AI. Check API key or network.' }])
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button onClick={() => setOpen(true)} className="rounded-full w-14 h-14 shadow-lg text-white text-xl"
          style={{background: 'linear-gradient(135deg, #2245ff, #5ac8fa)'}} title="Chat with AI">💬</button>
      )}
      {open && (
        <div className="w-[360px] h-[520px] rounded-2xl shadow-2xl bg-white border flex flex-col overflow-hidden">
          <div className="px-4 py-3 text-white flex items-center justify-between"
            style={{background: 'linear-gradient(135deg, #2245ff, #5ac8fa)'}}>
            <div className="font-semibold">CampusMate AI</div>
            <button onClick={() => setOpen(false)} className="bg-white/20 rounded-md px-2 py-1 text-sm">Close</button>
          </div>
          <div className="flex-1 p-3 overflow-auto space-y-2">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role==='assistant' ? 'text-sm bg-slate-100 p-2 rounded-xl' : 'text-sm bg-blue-50 p-2 rounded-xl ml-8'}>
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
            <input className="flex-1 border rounded-xl px-3 py-2" placeholder="Ask anything..."
              value={input} onChange={e=>setInput(e.target.value)} />
            <button className="btn-primary">Send</button>
          </form>
          <div className="p-2 text-[10px] text-slate-500 text-center">
            Tip: set <code>VITE_OPENAI_API_KEY</code> in .env to enable real AI.
          </div>
        </div>
      )}
    </div>
  )
}
