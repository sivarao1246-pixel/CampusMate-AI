
import React from 'react'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h2 className="text-2xl font-semibold">About CampusMate AI</h2>
      <p className="text-slate-700">CampusMate AI is a lightweight assistant built to help college students automate routine digital tasks—scheduling, email sorting, reminders, and study suggestions—so you can focus on real learning.</p>
      <div className="card p-6">
        <h3 className="font-semibold">Who is it for?</h3>
        <p className="text-slate-600">Students who want clarity in their day, fewer tabs, and smarter study habits.</p>
      </div>
      <div className="card p-6">
        <h3 className="font-semibold">Contact</h3>
        <p className="text-slate-600">Email: hello@campusmate.ai</p>
      </div>
    </div>
  )
}
