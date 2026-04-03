import { Loader2 } from 'lucide-react';

export function Spinner({ size = 20, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-sage-500 ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Spinner size={32} className="mx-auto mb-3" />
        <p className="text-sm text-sage-400">Loading...</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center mb-4">
        <Icon size={28} className="text-sage-400" />
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal-800 mb-2">{title}</h3>
      <p className="text-sm text-sage-400 max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = 'sage' }) {
  const colors = {
    sage: 'bg-sage-50 text-sage-500',
    warm: 'bg-warm-50 text-warm-500',
    cream: 'bg-cream-200 text-charcoal-800',
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-sage-400 uppercase tracking-wide mb-1">{label}</p>
          <p className="font-display text-3xl font-semibold text-charcoal-800">{value}</p>
          {trend && <p className="text-xs text-sage-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-cream-200 text-charcoal-800',
    success: 'bg-sage-100 text-sage-700',
    warning: 'bg-warm-100 text-warm-500',
    danger: 'bg-red-50 text-red-500',
    info: 'bg-blue-50 text-blue-600',
  };
  return (
    <span className={`badge ${variants[variant]}`}>{children}</span>
  );
}

export function ScoreRing({ score, size = 80 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#4a7d55' : score >= 40 ? '#d4793a' : '#e05252';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#ede1c8" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute font-display font-semibold text-charcoal-800" style={{ fontSize: size * 0.22 }}>
        {score}
      </span>
    </div>
  );
}
