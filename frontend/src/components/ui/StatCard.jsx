export default function StatCard({ label, value, sub, icon: Icon, color = 'green' }) {
  const colors = {
    green:  'text-brand-400 bg-brand-500/10 border-brand-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    blue:   'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  }
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-dark-200/60 font-medium mb-1">{label}</p>
          <p className="font-display text-3xl font-bold text-white">{value ?? '—'}</p>
          {sub && <p className="text-xs text-dark-200/50 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  )
}
