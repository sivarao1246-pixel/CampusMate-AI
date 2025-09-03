
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.svg'

const NavItem = ({to, children}) => (
  <NavLink to={to} className={({isActive}) => 'px-3 py-2 rounded-lg ' + (isActive ? 'bg-white/70 text-slate-900' : 'text-white/90 hover:bg-white/20')}>
    {children}
  </NavLink>
)

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 shadow-sm" style={{background: 'linear-gradient(135deg, #2245ff 0%, #5ac8fa 100%)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CampusMate AI" className="w-8 h-8" />
            <span className="text-white font-semibold text-lg">CampusMate AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/schedule">Schedule</NavItem>
            <NavItem to="/emails">Emails</NavItem>
            <NavItem to="/study">Study Suggestions</NavItem>
            <NavItem to="/tasks">Tasks & Reminders</NavItem>
            <NavItem to="/about">About</NavItem>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-white/90 hover:text-white">Login</Link>
            <a href="#" className="hidden sm:inline-block btn-primary">Start Organizing</a>
          </div>
        </div>
      </div>
    </header>
  )
}
