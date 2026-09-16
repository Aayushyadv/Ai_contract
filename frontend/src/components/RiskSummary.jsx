import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = { High: '#DC2626', Medium: '#D97706', Low: '#16A34A' }

export default function RiskSummary({ summary }) {
  if (!summary) return null

  const data = [
    { name: 'High', value: summary.high },
    { name: 'Medium', value: summary.medium },
    { name: 'Low', value: summary.low },
  ].filter((d) => d.value > 0)

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-white/10 p-6">
      <h3 className="font-semibold text-navy-900 dark:text-white mb-4">Risk Analysis</h3>
      <div className="flex items-center gap-8 flex-wrap">
        <div className="text-center shrink-0">
          <p className="text-4xl font-display font-extrabold text-navy-900 dark:text-white">
            {summary.overall_score}<span className="text-lg text-slate-400 dark:text-slate-500"> /100</span>
          </p>
          <p
            className="mt-1 inline-block text-xs font-bold tracking-wide px-3 py-1 rounded-full"
            style={{
              color: COLORS[summary.level === 'HIGH' ? 'High' : summary.level === 'MEDIUM' ? 'Medium' : 'Low'],
              backgroundColor:
                summary.level === 'HIGH' ? '#FEE2E2' : summary.level === 'MEDIUM' ? '#FEF3C7' : '#DCFCE7',
            }}
          >
            {summary.level}
          </p>

          <div className="mt-4 space-y-1 text-sm text-left">
            <p><span className="inline-block w-2.5 h-2.5 rounded-full bg-risk-high mr-2" />High Risk <b className="ml-1">{summary.high}</b></p>
            <p><span className="inline-block w-2.5 h-2.5 rounded-full bg-risk-medium mr-2" />Medium Risk <b className="ml-1">{summary.medium}</b></p>
            <p><span className="inline-block w-2.5 h-2.5 rounded-full bg-risk-low mr-2" />Low Risk <b className="ml-1">{summary.low}</b></p>
          </div>
        </div>

        {data.length > 0 && (
          <div className="w-40 h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}