import { Link } from 'react-router-dom'
import { Crown, Zap } from 'lucide-react'

/**
 * Shown when API returns 403 (usage limit reached)
 * Usage: render this when error.response?.status === 403
 */
export default function UpgradePrompt({ feature }) {
  return (
    <div className="card border-brand-500/30 glow-green text-center py-8">
      <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
        <Zap size={22} className="text-brand-400" strokeWidth={1.8} />
      </div>
      <h3 className="font-display font-bold text-white text-lg mb-2">Daily limit reached</h3>
      <p className="text-sm text-dark-200/50 mb-5 max-w-xs mx-auto">
        You've used all your free {feature} for today. Upgrade to Pro for unlimited access.
      </p>
      <Link to="/pricing" className="btn-primary inline-flex items-center gap-2">
        <Crown size={15} /> Upgrade to Pro — ₹999/month
      </Link>
      <p className="text-xs text-dark-200/30 mt-3">Resets tomorrow at midnight</p>
    </div>
  )
}
