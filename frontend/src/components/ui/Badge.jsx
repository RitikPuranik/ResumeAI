const variants = {
  green:  'bg-brand-500/10 text-brand-400 border-brand-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  red:    'bg-red-500/10 text-red-400 border-red-500/20',
  blue:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  gray:   'bg-dark-200/10 text-dark-200/60 border-dark-200/20',
}
export default function Badge({ children, variant = 'gray' }) {
  return (
    <span className={`badge border ${variants[variant]}`}>{children}</span>
  )
}
