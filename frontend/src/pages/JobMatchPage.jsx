import { useState, useEffect } from 'react'
import { jobmatchAPI, resumeAPI } from '../services/api'
import ScoreRing from '../components/ui/ScoreRing'
import Badge from '../components/ui/Badge'
import { Briefcase, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function JobMatchPage() {
  const [resumes, setResumes]         = useState([])
  const [resumeId, setResumeId]       = useState('')
  const [jobDescription, setJD]       = useState('')
  const [result, setResult]           = useState(null)
  const [history, setHistory]         = useState([])
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    resumeAPI.getAll().then(r => setResumes(r.data.data))
    jobmatchAPI.history().then(r => setHistory(r.data.data))
  }, [])

  const analyze = async () => {
    if (!resumeId || !jobDescription.trim()) return toast.error('Select a resume and paste a job description')
    setLoading(true)
    try {
      const r = await jobmatchAPI.analyze({ resumeId, jobDescription })
      setResult(r.data.data)
      setHistory(prev => [r.data.data, ...prev])
      toast.success('Match analysis done')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s) => s >= 75 ? 'green' : s >= 50 ? 'yellow' : 'red'

  return (
    <div className="stagger max-w-3xl">
      <div className="page-header">
        <h1 className="section-title text-3xl">Job Match</h1>
        <p className="text-dark-200/50 text-sm mt-1">Compare your resume against a job description and see your match score</p>
      </div>

      <div className="card mb-6 space-y-4">
        <div>
          <label className="label">Select Resume *</label>
          <select value={resumeId} onChange={e => setResumeId(e.target.value)} className="input">
            <option value="">— Choose a resume —</option>
            {resumes.map(r => <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Paste Job Description *</label>
          <textarea value={jobDescription} onChange={e => setJD(e.target.value)} rows={8}
            placeholder="Paste the full job description here…" className="input resize-none" />
        </div>
        <button onClick={analyze} disabled={loading || !resumeId || !jobDescription.trim()} className="btn-primary flex items-center gap-2">
          {loading ? <Spinner size={16} /> : <Briefcase size={16} />}
          {loading ? 'Analysing…' : 'Analyse Match'}
        </button>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-up">
          <div className="card flex items-center gap-8 glow-green">
            <ScoreRing score={result.matchScore} size={120} label="Match Score" />
            <div className="flex-1">
              <Badge variant={scoreColor(result.matchScore)} className="mb-2">
                {result.matchScore >= 75 ? 'Strong Match' : result.matchScore >= 50 ? 'Moderate Match' : 'Weak Match'}
              </Badge>
              <p className="text-white font-medium mt-2">{result.verdict}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3"><CheckCircle2 size={15} className="text-brand-400" /><h3 className="font-display font-semibold text-white text-sm">Matched Keywords</h3></div>
              <div className="flex flex-wrap gap-2">{result.matchedKeywords?.map(k => <Badge key={k} variant="green">{k}</Badge>)}</div>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-3"><XCircle size={15} className="text-red-400" /><h3 className="font-display font-semibold text-white text-sm">Missing Keywords</h3></div>
              <div className="flex flex-wrap gap-2">{result.missingKeywords?.map(k => <Badge key={k} variant="red">{k}</Badge>)}</div>
            </div>
          </div>

          {result.suggestions?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4"><Lightbulb size={15} className="text-yellow-400" /><h3 className="font-display font-semibold text-white">How to Improve</h3></div>
              <ul className="space-y-2">{result.suggestions.map((s,i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-dark-200/70">
                  <span className="w-5 h-5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>{s}
                </li>
              ))}</ul>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && !result && (
        <div>
          <h2 className="section-title mb-4">Recent Analyses</h2>
          <div className="space-y-3">
            {history.slice(0,5).map(h => (
              <div key={h._id} className="card flex items-center gap-4">
                <ScoreRing score={h.matchScore} size={60} strokeWidth={5} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{h.verdict}</p>
                  <p className="text-xs text-dark-200/50 mt-0.5">{new Date(h.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={scoreColor(h.matchScore)}>{h.matchScore}%</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
