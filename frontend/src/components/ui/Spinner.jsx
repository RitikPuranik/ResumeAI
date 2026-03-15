export default function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin text-brand-400">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeLinecap="round" />
    </svg>
  )
}
