export default function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/10 px-5 py-4 flex-1 min-w-[120px] transition-colors">
      <p
        className={`text-2xl font-display font-bold ${!accent ? 'text-navy-900 dark:text-white' : ''}`}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</p>
    </div>
  )
}