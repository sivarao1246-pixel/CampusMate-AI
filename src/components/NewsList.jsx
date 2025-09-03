
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import newsFallback from '../data/news.json'

export default function NewsList() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const endpoint = import.meta.env.VITE_NEWS_ENDPOINT // e.g., your proxy to daily.dev
    async function load() {
      try {
        if (endpoint) {
          const res = await axios.get(endpoint)
          const articles = (res.data?.articles || res.data?.data || res.data) ?? []
          const normalized = articles.slice(0,8).map((a, idx) => ({
            id: a.id || a._id || idx,
            title: a.title || a.summary || 'Untitled',
            url: a.url || a.link || '#',
            source: a.source || a.site || 'daily.dev',
          }))
          setItems(normalized)
        } else {
          setItems(newsFallback.slice(0,8))
        }
      } catch (e) {
        setError('Could not fetch live news; showing sample items.')
        setItems(newsFallback.slice(0,8))
      }
    }
    load()
  }, [])

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Trending for Students</h3>
        <span className="text-xs text-slate-500">{error || 'Live (or sample) headlines'}</span>
      </div>
      <ul className="grid md:grid-cols-2 gap-3">
        {items.map(it => (
          <li key={it.id} className="p-4 rounded-xl border bg-white hover:bg-slate-50 transition">
            <a className="font-medium link" href={it.url} target="_blank" rel="noreferrer">{it.title}</a>
            <div className="text-xs text-slate-500 mt-1">{it.source}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
