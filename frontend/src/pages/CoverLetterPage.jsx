import { useState, useEffect } from 'react'
import { coverletterAPI, resumeAPI } from '../services/api'
import { PenLine, Copy, Trash2, Check } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

const TONES = ['professional','friendly','confident']

export default function CoverLetterPage() {
  const [resumes, setResumes]   = useState([])
  const [letters, setLetters]   = useState([])
  const [selected, setSelected] = useState(null)
  const [copied, setCopied]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [form, setForm] = useState({ resumeId:'', jobTitle:'', company:'', jobDescription:'', tone:'professional' })

  useEffect(() => {
    resumeAPI.getAll().then(r => setResumes(r.data.data))
    coverletterAPI.getAll().then(r => setLetters(r.data.data))
  }, [])

  const generate = async () => {
    if (!form.resumeId || !form.jobTitle) return toast.error('Resume and Job Title are required')
    setLoading(true)
    try {
      const r = await coverletterAPI.generate(form)
      setLetters(prev => [r.data.data, ...prev])
      setSelected(r.data.data)
      toast.success('Cover letter generated')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(selected?.content || '')
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const deleteLetter = async (id) => {
    await coverletterAPI.delete(id)
    setLetters(prev => prev.filter(l => l._id !== id))
    if (selected?._id === id) setSelected(null)
    toast.success('Deleted')
  }

  const viewFull = async (id) => {
    const r = await coverletterAPI.getOne(id)
    setSelected(r.data.data)
  }

  return (
    <div className="stagger max-w-5xl">
      <div className="page-header">
        <h1 className="section-title text-3xl">Cover Letter Generator</h1>
        <p className="text-dark-200/50 text-sm mt-1">Generate tailored cover letters in seconds using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator */}
        <div className="space-y-4">
          <div className="card space-y-4">
            <h2 className="font-display font-semibold text-white">Generate New</h2>
            <div>
              <label className="label">Resume *</label>
              <select value={form.resumeId} onChange={e => setForm({...form,resumeId:e.target.value})} className="input">
                <option value="">— Select resume —</option>
                {resumes.map(r => <option key={r._id} value={r._id}>{r.title||'Untitled'}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Job Title *</label>
              <input value={form.jobTitle} onChange={e => setForm({...form,jobTitle:e.target.value})} placeholder="Frontend Developer" className="input" />
            </div>
            <div>
              <label className="label">Company <span className="text-dark-200/30 font-normal">(optional)</span></label>
              <input value={form.company} onChange={e => setForm({...form,company:e.target.value})} placeholder="Leave blank if unknown" className="input" />
            </div>
            <div>
              <label className="label">Job Description <span className="text-dark-200/30 font-normal">(optional but improves quality)</span></label>
              <textarea value={form.jobDescription} onChange={e => setForm({...form,jobDescription:e.target.value})} rows={4} className="input resize-none" placeholder="Paste the job description…" />
            </div>
            <div>
              <label className="label">Tone</label>
              <div className="flex gap-2">
                {TONES.map(t => (
                  <button key={t} type="button" onClick={() => setForm({...form,tone:t})}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border transition-all ${
                      form.tone === t ? 'bg-brand-500/15 text-brand-400 border-brand-500/30' : 'border-dark-200/10 text-dark-200/50 hover:border-dark-200/30'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generate} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Spinner size={16} /> : <PenLine size={16} />}
              {loading ? 'Generating…' : 'Generate Cover Letter'}
            </button>
          </div>

          {/* History list */}
          {letters.length > 0 && (
            <div className="card">
              <h3 className="font-display font-semibold text-white mb-3">Previous Letters</h3>
              <div className="space-y-2">
                {letters.map(l => (
                  <div key={l._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?._id===l._id ? 'border-brand-500/30 bg-brand-500/5' : 'border-dark-200/10 hover:border-dark-200/20'}`}
                    onClick={() => viewFull(l._id)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{l.jobTitle}</p>
                      <p className="text-xs text-dark-200/50">{l.company || 'No company'} · <span className="capitalize">{l.tone}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="gray">{l.wordCount}w</Badge>
                      <button onClick={(e) => { e.stopPropagation(); deleteLetter(l._id) }}
                        className="text-dark-200/30 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div>
          {selected ? (
            <div className="card h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-white">{selected.jobTitle}</h3>
                  <p className="text-xs text-dark-200/50">{selected.company || 'No company'} · <span className="capitalize">{selected.tone}</span> · {selected.wordCount} words</p>
                </div>
                <button onClick={copy} className="btn-ghost flex items-center gap-1.5 text-xs">
                  {copied ? <><Check size={13} className="text-brand-400" /> Copied!</> : <><Copy size={13} /> Copy</>}
                </button>
              </div>
              <div className="bg-dark-950/50 rounded-xl p-5 border border-dark-200/10">
                <pre className="text-sm text-dark-100/80 font-body whitespace-pre-wrap leading-relaxed">{selected.content}</pre>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center">
              <EmptyState icon={PenLine} title="No letter selected" desc="Generate a new cover letter or click one from your history to preview it" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
