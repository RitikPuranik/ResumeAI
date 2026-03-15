import { useEffect, useState } from 'react'
import { userAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import { useForm } from 'react-hook-form'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [saving, setSaving]  = useState(false)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: { name: '', phone: '', location: '' }
  })

  useEffect(() => {
    userAPI.getProfile().then(r => {
      const u = r.data.data
      reset({ name: u.name || '', phone: u.phone || '', location: u.location || '' })
    })
  }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const res = await userAPI.updateProfile(data)
      updateUser(res.data.data)
      toast.success('Profile updated')
      reset(data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="stagger max-w-xl">
      <div className="page-header">
        <h1 className="section-title text-3xl">Profile</h1>
        <p className="text-dark-200/50 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar block */}
      <div className="card mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-display font-bold text-2xl shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-lg">{user?.name}</h2>
          <p className="text-sm text-dark-200/50">{user?.email}</p>
        </div>
      </div>

      {/* Edit form */}
      <div className="card">
        <h2 className="font-display font-semibold text-white mb-5">Personal Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="label flex items-center gap-1.5">
              <User size={13} className="text-dark-200/40" /> Full Name
            </label>
            <input {...register('name', { required: 'Name is required' })}
              placeholder="John Doe" className="input" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Mail size={13} className="text-dark-200/40" /> Email
            </label>
            <input value={user?.email || ''} disabled
              className="input opacity-40 cursor-not-allowed" />
            <p className="text-xs text-dark-200/30 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Phone size={13} className="text-dark-200/40" /> Phone <span className="text-dark-200/30 font-normal">(optional)</span>
            </label>
            <input {...register('phone')} placeholder="+91 98765 43210" className="input" />
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <MapPin size={13} className="text-dark-200/40" /> Location <span className="text-dark-200/30 font-normal">(optional)</span>
            </label>
            <input {...register('location')} placeholder="Mumbai, India" className="input" />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving || !isDirty}
              className="btn-primary flex items-center gap-2">
              {saving ? <Spinner size={15} /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Account info */}
      <div className="card mt-4">
        <h2 className="font-display font-semibold text-white mb-4">Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-dark-200/10">
            <span className="text-dark-200/50">Member since</span>
            <span className="text-white font-mono text-xs">—</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-dark-200/50">Account type</span>
            <span className="text-brand-400 font-medium text-xs">Free</span>
          </div>
        </div>
      </div>
    </div>
  )
}
