import { NavLink } from 'react-router-dom'
import { Home, FileText, BarChart3, Search, History, Settings } from 'lucide-react'

const items = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/analyze', label: 'Analyze Contract', icon: FileText },
  { to: '/results', label: 'Risk Analysis', icon: BarChart3 },
  { to: '/results?tab=ask', label: 'Ask Contract', icon: Search },
  { to: '/history', label: 'History', icon: History },
]

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-navy-900 text-slate-300 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="font-display font-semibold text-white">Navigation</span>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
