import { useEffect, useState } from 'react'
import { subscriptionAPI } from '../services/api'
import { Check, X, Crown, Zap } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function PricingPage() {
  const [sub, setSub]         = useState(null)
  const [usage, setUsage]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    Promise.all([
      subscriptionAPI.getMySubscription().then(r => setSub(r.data.data)),
      subscriptionAPI.getUsage().then(r => setUsage(r.data.data)),
    ]).finally(() => setLoading(false))

    // Load Razorpay checkout script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      // Step 1 — create order on backend
      const res = await subscriptionAPI.createOrder()
      const { orderId, amount, currency, keyId } = res.data.data

      // Step 2 — open Razorpay checkout
      const options = {
        key:      keyId,
        amount,
        currency,
        order_id: orderId,
        name:        'CareerForge',
        description: 'Pro Plan — ₹999 / 30 days',
        theme:       { color: '#22c55e' },

        handler: async (response) => {
          // Step 3 — verify payment on backend, upgrade user instantly
          try {
            await subscriptionAPI.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            toast.success('🎉 Pro activated! Welcome to CareerForge Pro.')
            // Refresh subscription state
            const updated = await subscriptionAPI.getMySubscription()
            setSub(updated.data.data)
            const updatedUsage = await subscriptionAPI.getUsage()
            setUsage(updatedUsage.data.data)
          } catch {
            toast.error('Payment verification failed. Contact support.')
          }
        },

        modal: {
          ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch {
    } finally {
      setUpgrading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Cancel your Pro subscription? You keep Pro access until your 30-day period ends.')) return
    setCancelling(true)
    try {
      await subscriptionAPI.cancelSubscription()
      toast.success('Subscription cancelled. Pro access continues until period end.')
      setSub(prev => ({ ...prev, cancelAtPeriodEnd: true }))
    } finally {
      setCancelling(false)
    }
  }

  const isPro = sub?.plan === 'pro' && sub?.status === 'active'

  const freeFeatures = [
    { label: '1 resume',             ok: true },
    { label: '3 ATS checks / day',   ok: true },
    { label: '2 interviews / day',   ok: true },
    { label: '1 job match / day',    ok: true },
    { label: '1 cover letter / day', ok: true },
    { label: 'PDF downloads',        ok: false },
    { label: 'Progress tracking',    ok: false },
    { label: 'Priority AI',          ok: false },
  ]

  const proFeatures = [
    { label: 'Unlimited resumes',       ok: true },
    { label: 'Unlimited ATS checks',    ok: true },
    { label: 'Unlimited interviews',    ok: true },
    { label: 'Unlimited job matches',   ok: true },
    { label: 'Unlimited cover letters', ok: true },
    { label: 'PDF downloads',           ok: true },
    { label: 'Progress tracking',       ok: true },
    { label: 'Priority AI responses',   ok: true },
  ]

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  return (
    <div className="stagger max-w-4xl">
      <div className="page-header text-center">
        <h1 className="section-title text-4xl mb-2">Simple Pricing</h1>
        <p className="text-dark-200/50">Start free. Upgrade when you're ready.</p>
      </div>

      {/* Current plan banner */}
      {sub && (
        <div className={`card mb-8 flex items-center gap-4 ${isPro ? 'border-brand-500/30 glow-green' : ''}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPro ? 'bg-brand-500/15 border border-brand-500/30' : 'bg-dark-800 border border-dark-200/10'}`}>
            {isPro ? <Crown size={18} className="text-brand-400" /> : <Zap size={18} className="text-dark-200/50" />}
          </div>
          <div className="flex-1">
            <p className="font-display font-semibold text-white capitalize">
              {sub.plan} Plan &nbsp;
              {isPro && <Badge variant="green">Active</Badge>}
            </p>
            {isPro && sub.currentPeriodEnd && (
              <p className="text-xs text-dark-200/50 mt-0.5">
                {sub.cancelAtPeriodEnd
                  ? `Access ends ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`
                  : `Valid until ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`}
              </p>
            )}
          </div>
          {isPro && !sub.cancelAtPeriodEnd && (
            <button onClick={handleCancel} disabled={cancelling}
              className="btn-ghost text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
              {cancelling ? <Spinner size={14} /> : 'Cancel Plan'}
            </button>
          )}
        </div>
      )}

      {/* Usage meters */}
      {!isPro && usage && (
        <div className="card mb-8">
          <h3 className="font-display font-semibold text-white mb-4">Today's Usage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(usage.usage)
              .filter(([k]) => k !== 'pdfDownloads')
              .map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-dark-200/50 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className={`font-mono font-semibold ${val.percentage >= 100 ? 'text-red-400' : 'text-white'}`}>
                      {val.unlimited ? '∞' : `${val.used}/${val.limit}`}
                    </span>
                  </div>
                  {!val.unlimited && (
                    <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(val.percentage, 100)}%`,
                          background: val.percentage >= 100 ? '#ef4444' : val.percentage >= 75 ? '#f59e0b' : '#22c55e',
                        }} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Free */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-xl font-bold text-white">Free</h2>
            {!isPro && <Badge variant="green">Current Plan</Badge>}
          </div>
          <div className="mb-6">
            <span className="font-display text-4xl font-bold text-white">₹0</span>
            <span className="text-dark-200/50 text-sm ml-2">forever</span>
          </div>
          <ul className="space-y-3 mb-6">
            {freeFeatures.map(({ label, ok }) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                {ok
                  ? <Check size={15} className="text-brand-400 shrink-0" />
                  : <X     size={15} className="text-dark-200/25 shrink-0" />}
                <span className={ok ? 'text-dark-100/80' : 'text-dark-200/30 line-through'}>{label}</span>
              </li>
            ))}
          </ul>
          <div className="btn-secondary text-center text-sm font-medium opacity-40 cursor-default rounded-xl py-3">
            Current Plan
          </div>
        </div>

        {/* Pro */}
        <div className="card border-brand-500/40 glow-green relative">
          <div className="absolute top-4 right-4">
            <Badge variant="green"><Crown size={10} className="mr-1" />Popular</Badge>
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-2">Pro</h2>
          <div className="mb-6">
            <span className="font-display text-4xl font-bold text-white">₹999</span>
            <span className="text-dark-200/50 text-sm ml-2">/ 30 days</span>
          </div>
          <ul className="space-y-3 mb-6">
            {proFeatures.map(({ label }) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                <Check size={15} className="text-brand-400 shrink-0" />
                <span className="text-dark-100/80">{label}</span>
              </li>
            ))}
          </ul>
          {isPro ? (
            <div className="btn-primary text-center text-sm rounded-xl py-3 opacity-75 cursor-default">
              ✓ Active
            </div>
          ) : (
            <button onClick={handleUpgrade} disabled={upgrading}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {upgrading ? <Spinner size={16} /> : <Crown size={15} />}
              {upgrading ? 'Opening payment…' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
