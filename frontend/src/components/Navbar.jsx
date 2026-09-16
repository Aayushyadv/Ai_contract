import { useState, useRef, useEffect } from 'react'
import { Scale, User, Sun, Moon, Bell, ChevronDown, Info, Cpu, Users, Mail, HelpCircle } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const ABOUT_ITEMS = [
  { label: 'About ContractAI', icon: Info, hash: '#about' },
  { label: 'Technology', icon: Cpu, hash: '#technology' },
  { label: 'Team', icon: Users, hash: '#team' },
  { label: 'Contact', icon: Mail, hash: '#contact' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [aboutOpen, setAboutOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const aboutRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target)) setAboutOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'text-navy-900 dark:text-white'
        : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
    }`

  const goAbout = (hash) => {
    setAboutOpen(false)
    navigate(`/about${hash}`)
  }

  return (
    <header className="h-20 shrink-0 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 transition-colors relative z-20">
      <Link to="/" className="flex items-center gap-2.5 shrink-0">
        <Scale size={30} className="text-indigo-600 dark:text-indigo-400" />
        <span className="font-display font-extrabold text-2xl text-navy-900 dark:text-white">ContractAI</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/" className={linkClass('/')}>Dashboard</Link>
        <Link to="/analyze" className={linkClass('/analyze')}>Analyze</Link>
        <Link to="/history" className={linkClass('/history')}>History</Link>

        {/* About dropdown */}
        <div className="relative" ref={aboutRef}>
          <button
            onClick={() => setAboutOpen((v) => !v)}
            className={`flex items-center gap-1 text-sm font-medium transition-colors ${
              location.pathname === '/about'
                ? 'text-navy-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
            }`}
          >
            About
            <ChevronDown size={14} className={`transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
          </button>

          {aboutOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg py-2">
              {ABOUT_ITEMS.map(({ label, icon: Icon, hash }) => (
                <button
                  key={label}
                  onClick={() => goAbout(hash)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-navy-900 dark:hover:text-white transition-colors text-left"
                >
                  <Icon size={15} className="text-indigo-600 dark:text-indigo-400" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/help" className={`flex items-center gap-1 ${linkClass('/help')}`}>
          <HelpCircle size={15} />
          Help
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-risk-high" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg py-3 px-4">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">
                Notifications
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No new notifications. Analysis alerts will show up here.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
          <div className="w-8 h-8 rounded-full bg-navy-900 dark:bg-indigo-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </nav>
    </header>
  )
}