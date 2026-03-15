import { useState, useEffect } from 'react'
import { atsAPI, resumeAPI } from '../services/api'
import ScoreRing from '../components/ui/ScoreRing'
import Badge from '../components/ui/Badge'
import { ScanText, Upload, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function AtsCheckerPage() {
  const [resumes, setResumes]   = useState([])
  const [resumeId, setResumeId] = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)

  useEffect(() => { resumeAPI.getAll().then(r => setResumes(r.data.data)) }, [])

  const analyze = async () => {
    if (!resumeId) return toast.error('Select a resume')
    setLoading(true)
    try {
      const r = await atsAPI.analyze({ resumeId })
      setResult(r.data.data)
      toast.success('Analysis complete')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s) => s >= 75 ? 'green' : s >= 50 ? 'yellow' : 'red'

  return (
    <div className="stagger max-w-3xl">
      <div className="page-header">
        <h1 className="section-title text-3xl">ATS Checker</h1>
        <p className="text-dark-200/50 text-sm mt-1">Analyse how well your resume performs in Applicant Tracking Systems</p>
      </div>

      <div className="card mb-6">
        <h2 className="font-display font-semibold text-white mb-4">Select Resume to Analyse</h2>
        <div className="space-y-3">
          <select value={resumeId} onChange={e => setResumeId(e.target.value)} className="input">
            <option value="">— Choose a resume —</option>
            {resumes.map(r => <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>)}
          </select>
          <button onClick={analyze} disabled={loading || !resumeId} className="btn-primary flex items-center gap-2">
            {loading ? <Spinner size={16} /> : <ScanText size={16} />}
            {loading ? 'Analysing…' : 'Run ATS Analysis'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-up">
          {/* Score overview */}
          <div className="card flex items-center gap-8">
            <ScoreRing score={result.score} size={120} label="ATS Score" />
            <div className="flex-1">
              <Badge variant={scoreColor(result.score)} className="mb-2">
                {result.score >= 75 ? 'Excellent' : result.score >= 50 ? 'Needs Work' : 'Poor'}
              </Badge>
              <p className="text-white font-medium mt-2">{result.analysis?.verdict}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  ['Keywords',    result.analysis?.keywordScore],
                  ['Formatting',  result.analysis?.formattingScore],
                  ['Completeness',result.analysis?.completenessScore],
                  ['Length',      result.analysis?.lengthScore],
                ].map(([label, score]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-dark-200/60">{label}</span>
                      <span className="text-white font-mono">{score}%</span>
                    </div>
                    <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, background: score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-brand-400" />
                <h3 className="font-display font-semibold text-white text-sm">Matched Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.analysis?.matchedKeywords?.map(k => <Badge key={k} variant="green">{k}</Badge>)}
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={16} className="text-red-400" />
                <h3 className="font-display font-semibold text-white text-sm">Missing Sections</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.analysis?.missingSections?.length
                  ? result.analysis.missingSections.map(k => <Badge key={k} variant="red">{k}</Badge>)
                  : <span className="text-xs text-dark-200/50">All sections present 🎉</span>}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {result.analysis?.suggestions?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-yellow-400" />
                <h3 className="font-display font-semibold text-white">Improvement Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {result.analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-dark-200/70">
                    <span className="w-5 h-5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
