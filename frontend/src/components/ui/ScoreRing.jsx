export default function ScoreRing({ score, size = 120, strokeWidth = 8, label = 'Score' }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct  = Math.max(0, Math.min(100, score || 0))
  const dash = (pct / 100) * circ
  const color = pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={circ - dash}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-2xl text-white">{pct}</span>
          <span className="text-xs text-dark-200/60 font-mono">%</span>
        </div>
      </div>
      <span className="text-xs text-dark-200/60 font-medium">{label}</span>
    </div>
  )
}
