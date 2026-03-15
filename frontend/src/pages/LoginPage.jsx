import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Zap, Eye, EyeOff } from 'lucide-react'
import Spinner from '../components/ui/Spinner'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.login(data)
      setAuth(res.data.data.user, res.data.data.token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 noise flex items-center justify-center p-4">
      {/* bg blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-64 h-64 bg-brand-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-500 rounded-2xl mb-4">
            <Zap size={22} className="text-dark-950" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-dark-200/50 text-sm">Sign in to your CareerForge account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input {...register('email', { required: 'Email required' })}
                type="email" placeholder="you@example.com" className="input" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input {...register('password', { required: 'Password required' })}
                  type={showPw ? 'text' : 'password'} placeholder="••••••••" className="input pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-200/40 hover:text-dark-200">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Spinner size={18} /> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-dark-200/50 mt-6">
          No account? <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  )
}
