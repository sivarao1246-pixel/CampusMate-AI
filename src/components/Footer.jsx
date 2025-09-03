
import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} CampusMate AI. For students, by students.</p>
        <div className="flex gap-6">
          <a className="link" href="mailto:hello@campusmate.ai">Contact</a>
          <a className="link" href="#">Privacy</a>
          <a className="link" href="#">Terms</a>
        </div>
      </div>
    </footer>
  )
}
