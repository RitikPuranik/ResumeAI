import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { interviewAPI, resumeAPI } from '../services/api'
import { Mic2, Plus, Clock, CheckCircle2, Circle } from 'lucide-react'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const ROLES = ['Frontend Developer','Backend Developer','Full Stack Developer','Data Analyst','Data Scientist','Software Engineer','DevOps Engineer','Mobile Developer','UI/UX Designer','Product Manager','QA Engineer','Machine Learning Engineer']
const ROUNDS = [{ v:'technical', l:'Technical' },{ v:'hr', l:'HR' },{ v:'mixed', l:'Mixed' }]

export default function InterviewsPage() {
  const [history, setHistory] = useState([])
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [setting, setSetting] = useState(false)
  const [form, setForm] = useState({ role: '', roundType: 'mixed', resumeId: '' })
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      interviewAPI.history().then(r => setHistory(r.data.data)),
      resumeAPI.getAll().then(r => setResumes(r.data.data)),
    ]).finally(() => setLoading(false))
  }, [])

  const start = async () => {
    if (!form.role) return toast.error('Select a role')
    setSetting(true)
    try {
      const r = await interviewAPI.setup({ ...form, resumeId: form.resumeId || undefined })
      const iv = r.data.data
      await interviewAPI.start(iv._id)
      navigate(`/interviews/${iv._id}`)
    } finally {
      setSetting(false)
    }
  }

  const statusBadge = (s) => s === 'completed' ? <Badge variant="green"><CheckCircle2 size={10}/>Completed</Badge>
    : s === 'active' ? <Badge variant="yellow"><Clock size={10}/>Active</Badge>
    : <Badge variant="gray"><Circle size={10}/>Setup</Badge>

  return (
    <div className="stagger">
      <div className="page-header">
        <h1 className="section-title text-3xl">Interview Practice</h1>
        <p className="text-dark-200/50 text-sm mt-1">Simulate real interviews and get AI-powered feedback</p>
      </div>

      {/* Setup card */}
      <div className="card mb-8">
        <h2 className="font-display font-semibold text-white mb-4">Start New Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="label">Job Role *</label>
            <select value={form.role} onChange={e => setForm({...form, role:e.target.value})} className="input">
              <option value="">— Select role —</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Interview Round *</label>
            <select value={form.roundType} onChange={e => setForm({...form, roundType:e.target.value})} className="input">
              {ROUNDS.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Resume <span className="text-dark-200/30 font-normal">(optional)</span></label>
            <select value={form.resumeId} onChange={e => setForm({...form, resumeId:e.target.value})} className="input">
              <option value="">— No resume —</option>
              {resumes.map(r => <option key={r._id} value={r._id}>{r.title || 'Untitled'}</option>)}
            </select>
          </div>
        </div>
        <button onClick={start} disabled={setting || !form.role} className="btn-primary flex items-center gap-2">
          {setting ? <Spinner size={16} /> : <Plus size={16} />}
          {setting ? 'Setting up…' : 'Begin Interview'}
        </button>
      </div>

      {/* History */}
      <h2 className="section-title mb-4">Interview History</h2>
      {loading ? (
        <div className="flex justify-center py-10"><Spinner size={28} /></div>
      ) : history.length === 0 ? (
        <EmptyState icon={Mic2} title="No interviews yet" desc="Complete your first mock interview to see results here" />
      ) : (
        <div className="space-y-3">
          {history.map(iv => (
            <Link key={iv._id} to={`/interviews/${iv._id}`}
              className="card-hover flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <Mic2 size={18} className="text-brand-400" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-white truncate">{iv.role}</h3>
                <p className="text-xs text-dark-200/50 mt-0.5 capitalize">{iv.roundType} round • {new Date(iv.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {iv.totalScore != null && (
                  <span className="font-mono text-sm font-semibold text-brand-400">{iv.totalScore}%</span>
                )}
                {statusBadge(iv.status)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
