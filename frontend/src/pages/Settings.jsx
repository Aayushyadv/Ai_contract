import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="max-w-xl mx-auto py-14 px-6">
      <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white mb-1">Settings</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Preferences for this device.</p>

      <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/10 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-white/10 flex items-center justify-center">
            {isDark ? (
              <Moon size={17} className="text-indigo-400" />
            ) : (
              <Sun size={17} className="text-indigo-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-navy-900 dark:text-white">Appearance</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isDark ? 'Dark mode is on' : 'Light mode is on'}
            </p>
          </div>
        </div>

        <button
          role="switch"
          aria-checked={isDark}
          onClick={toggleTheme}
          className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${
            isDark ? 'bg-indigo-600' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              isDark ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
        Saved on this device only — it applies next time you open ContractAI here.
      </p>
    </div>
  )
}