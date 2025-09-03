
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Schedule from './pages/Schedule.jsx'
import Emails from './pages/Emails.jsx'
import Tasks from './pages/Tasks.jsx'
import StudySuggestions from './pages/StudySuggestions.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col body-gradient">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/emails" element={<Emails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/study" element={<StudySuggestions />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
