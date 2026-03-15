import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Zap } from 'lucide-react'
import Spinner from '../components/ui/Spinner'

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.register(data)
      setAuth(res.data.data.user, res.data.data.token)
      toast.success('Account created!')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 noise flex items-center justify-center p-4">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-500 rounded-2xl mb-4">
            <Zap size={22} className="text-dark-950" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Get started</h1>
          <p className="text-dark-200/50 text-sm">Create your free CareerForge account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input {...register('name', { required: 'Name required' })} placeholder="John Doe" className="input" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input {...register('email', { required: 'Email required' })} type="email" placeholder="you@example.com" className="input" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                type="password" placeholder="••••••••" className="input" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Spinner size={18} /> : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-dark-200/50 mt-6">
          Have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
