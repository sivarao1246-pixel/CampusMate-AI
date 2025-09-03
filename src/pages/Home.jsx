import React from 'react'
import Carousel from '../components/Carousel.jsx'
import NewsList from '../components/NewsList.jsx'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Your AI-powered campus companion</h1>
          <p className="text-slate-600">
            Automate scheduling, triage emails, track tasks, and study smarter—through natural language.
          </p>
          <div className="flex gap-3">
            <a href="/schedule" className="btn-primary">View Schedule</a>
            <a href="/tasks" className="px-4 py-2 rounded-xl border">My Tasks</a>
          </div>
        </div>

        {/* 👇 Hero Image */}
        <div className="rounded-2xl overflow-hidden h-56 md:h-72">
          <img 
            src="./src/pages/img/Jarvis.jpeg"   // place your image in public/images/hero.png
            alt="Campus Assistant Illustration" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Carousel Section */}
      <Carousel />

      {/* News + Assistant Section */}
      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NewsList />
        </div>

        {/* Meet the Assistant Card */}
        <div className="card p-6 text-center">
          <img 
            src="./src/pages/img/jarvis.jpg" // place your image in public/images/assistant.png
            alt="AI Assistant" 
            className="w-32 mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">Meet the Assistant</h3>
          <p className="text-slate-600">
            Ask for a daily plan, summarize an email, create flashcards, or draft a study schedule. 
            Click the chat bubble at the bottom right to try it.
          </p>
          <ul className="mt-3 text-sm list-disc list-inside text-slate-600 text-left">
            <li>Understands your intent</li>
            <li>Explains actions and asks confirmation</li>
            <li>Works with Calendar, Emails, and Tasks (connect soon)</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
