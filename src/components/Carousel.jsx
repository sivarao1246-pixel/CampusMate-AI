import React, { useState, useEffect } from 'react'

const slides = [
  { title: 'Smart Scheduling', desc: 'Auto-plan your day with Calendar awareness.', cta: 'Go to Schedule', href: '/schedule', img: './src/components/img/Schedule.jpeg' },
  { title: 'AI Email Sorting', desc: 'See what matters—first.', cta: 'Check Emails', href: '/emails', img: '/src/components/img/Gmail.jpeg' },
  { title: 'Personal Study Tips', desc: 'Get tactics that fit your pace.', cta: 'Study Suggestions', href: '/study', img: '/src/components/img/Library.jpeg' },
  { title: 'Tasks & Reminders', desc: 'Capture, prioritize, and finish.', cta: 'View Tasks', href: '/tasks', img: '/src/components/img/Task.jpeg' },
]

export default function Carousel() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI(prev => (prev+1)%slides.length), 4000)
    return () => clearInterval(id)
  }, [])
  const slide = slides[i]
  return (
    <div className="card p-8 bg-white/60">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold">{slide.title}</h3>
          <p className="text-slate-600 mt-2">{slide.desc}</p>
          <a href={slide.href} className="btn-primary inline-block mt-4">{slide.cta}</a>
        </div>
        <div className="flex-1 w-full h-48 md:h-64 rounded-xl overflow-hidden">
          <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {slides.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setI(idx)} 
            className={'w-2.5 h-2.5 rounded-full ' + (idx===i ? 'bg-slate-800' : 'bg-slate-300')} 
          />
        ))}
      </div>
    </div>
  )
}
