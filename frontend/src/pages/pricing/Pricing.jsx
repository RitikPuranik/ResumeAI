import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentAPI } from '../../api/payment';
import { useAuthStore } from '../../store/authStore';
import { PageLoader, Spinner } from '../../components/ui';

const PLAN_UI = {
  free: { icon: Sparkles, description: 'Perfect for getting started', color: 'border-cream-300', iconBg: 'bg-cream-200', iconColor: 'text-charcoal-800' },
  pro:  { icon: Zap, description: 'Best for active job seekers', color: 'border-sage-400', iconBg: 'bg-sage-100', iconColor: 'text-sage-500', popular: true },
};

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const user = useAuthStore((s) => s.user);

  const { data: subData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => paymentAPI.getSubscription().then((r) => r.data?.data || r.data),
    retry: 1,
  });

  const { data: plansData, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => paymentAPI.getPlans().then((r) => r.data?.data || []),
    retry: 1,
  });

  const currentPlan = subData?.plan || 'free';

  const handleUpgrade = async (planKey) => {
    if (planKey === 'free' || planKey === currentPlan) return;
    setLoadingPlan(planKey);
    try {
      const res = await paymentAPI.createOrder();
      const order = res.data?.data || res.data;

      if (!window.Razorpay) {
        toast.error('Razorpay not loaded. Please refresh and try again.');
        return;
      }

      const options = {
        key:         order.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      order.amount,
        currency:    order.currency || 'INR',
        name:        'ResumeAI',
        description: 'Pro Plan — 30 days unlimited access',
        order_id:    order.orderId,
        prefill:     { name: user?.name, email: user?.email },
        theme:       { color: '#4a7d55' },
        handler: async (response) => {
          try {
            await paymentAPI.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('🎉 Pro plan activated!');
            setTimeout(() => window.location.reload(), 1500);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatLimit = (val) => val === -1 ? 'Unlimited' : val === 0 ? 'Not included' : val;

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-semibold text-charcoal-800 mb-3">Simple, honest pricing</h1>
        <p className="text-sage-400 max-w-md mx-auto">Cancel anytime. No hidden fees. Powered by Razorpay.</p>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {(plansData || []).map((plan) => {
            const ui = PLAN_UI[plan.key] || PLAN_UI.free;
            const Icon = ui.icon;
            const isCurrent = currentPlan === plan.key;
            const isPending = loadingPlan === plan.key;

            return (
              <div key={plan.key} className={`card p-6 relative flex flex-col border-2 ${ui.color} ${ui.popular ? 'shadow-lg' : ''}`}>
                {ui.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-sage-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}

                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${ui.iconBg}`}>
                  <Icon size={20} className={ui.iconColor} />
                </div>

                <h3 className="font-display text-xl font-semibold text-charcoal-800">{plan.name}</h3>
                <p className="text-xs text-sage-400 mt-0.5 mb-4">{ui.description}</p>

                <div className="mb-5">
                  <span className="font-display text-4xl font-bold text-charcoal-800">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-sm text-sage-400 ml-1">/30 days</span>}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {(plan.features || []).map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={10} className="text-sage-600" />
                      </div>
                      <span className="text-sm text-sage-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={isCurrent || isPending || plan.price === 0}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2
                    ${isCurrent ? 'bg-cream-200 text-sage-500 cursor-default' : ui.popular ? 'btn-primary' : 'btn-secondary'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isPending ? <Spinner size={16} className={ui.popular ? 'text-white' : ''} /> :
                   isCurrent ? '✓ Current Plan' : plan.price === 0 ? 'Free Forever' : 'Upgrade to Pro'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {subData?.plan === 'pro' && subData?.currentPeriodEnd && (
        <div className="text-center mt-8">
          <p className="text-sm text-sage-400">
            Your Pro plan is active until{' '}
            <strong>{new Date(subData.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </p>
        </div>
      )}

      <p className="text-center text-xs text-sage-400 mt-10">
        Payments secured by Razorpay. All prices in INR. GST as applicable.
      </p>
    </div>
  );
}