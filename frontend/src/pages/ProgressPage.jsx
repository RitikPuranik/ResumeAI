import { useEffect, useState } from 'react'
import { progressAPI } from '../services/api'
import ScoreRing from '../components/ui/ScoreRing'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import { TrendingUp, FileText, Mic2, Briefcase, PenLine } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-800 border border-dark-200/10 rounded-xl px-3 py-2 text-xs">
      <p className="text-dark-200/50 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono font-semibold">{p.value}%</p>
      ))}
    </div>
  )
}

export default function ProgressPage() {
  const [data, setData]       = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      progressAPI.dashboard().then(r => setData(r.data.data)),
      progressAPI.history().then(r => setHistory(r.data.data)),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  // Build chart data from history snapshots
  const chartData = history.slice(-10).map((h, i) => ({
    session:   `#${i + 1}`,
    Readiness: h.overallReadiness     || 0,
    ATS:       h.atsScoreSnapshot     || 0,
    Interview: h.interviewScoreSnapshot || 0,
  }))

  const scoreColor = (s) => !s ? 'gray' : s >= 75 ? 'green' : s >= 50 ? 'yellow' : 'red'

  return (
    <div className="stagger">
      <div className="page-header">
        <h1 className="section-title text-3xl">Progress Tracker</h1>
        <p className="text-dark-200/50 text-sm mt-1">Track your improvement over time across all features</p>
      </div>

      {/* Overall readiness */}
      {data && (
        <div className="card glow-green mb-8 flex items-center gap-8">
          <ScoreRing score={data.overallReadinessScore} size={120} label="Readiness" />
          <div className="flex-1">
            <p className="text-xs text-dark-200/50 font-mono mb-1">OVERALL JOB READINESS</p>
            <h2 className="font-display text-3xl font-bold text-white mb-1">{data.readinessLevel}</h2>
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge variant={scoreColor(data.resumeProgress?.latestAtsScore)}>
                ATS {data.resumeProgress?.latestAtsScore ?? '—'}%
              </Badge>
              <Badge variant={scoreColor(data.interviewProgress?.averageScore)}>
                Interview avg {data.interviewProgress?.averageScore ?? '—'}%
              </Badge>
              <Badge variant={scoreColor(data.jobMatchProgress?.averageMatchScore)}>
                Match avg {data.jobMatchProgress?.averageMatchScore ?? '—'}%
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      {data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Resumes Created"    value={data.resumeProgress?.totalResumes}         icon={FileText}   color="green"  sub={`ATS improvement: ${data.resumeProgress?.improvement || 'N/A'}`} />
          <StatCard label="Interviews Done"    value={data.interviewProgress?.totalInterviews}    icon={Mic2}       color="yellow" sub={`Improvement: ${data.interviewProgress?.improvement || 'N/A'}`} />
          <StatCard label="Job Matches Run"    value={data.jobMatchProgress?.totalMatches}        icon={Briefcase}  color="blue"   sub={`Avg match: ${data.jobMatchProgress?.averageMatchScore ?? '—'}%`} />
          <StatCard label="Cover Letters"      value={data.coverLettersGenerated}                 icon={PenLine}    color="purple" sub="Generated" />
        </div>
      )}

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="card mb-8">
          <h2 className="font-display font-semibold text-white mb-6">Score Trends</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="session" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Readiness" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
              <Line type="monotone" dataKey="ATS"       stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
              <Line type="monotone" dataKey="Interview" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center">
            {[['#22c55e','Readiness'],['#3b82f6','ATS Score'],['#f59e0b','Interview']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                <span className="text-xs text-dark-200/50">{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS score history */}
      {data?.resumeProgress?.atsScoreHistory?.length > 0 && (
        <div className="card mb-4">
          <h3 className="font-display font-semibold text-white mb-4">ATS Score History</h3>
          <div className="flex items-end gap-2 h-16">
            {data.resumeProgress.atsScoreHistory.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-mono text-dark-200/50">{s}%</span>
                <div className="w-full rounded-t-md transition-all"
                  style={{ height: `${s}%`, background: s >= 75 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444', minHeight: 4 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {data?.jobMatchProgress?.mostMissingKeywords?.length > 0 && (
        <div className="card">
          <h3 className="font-display font-semibold text-white mb-3">Consistently Missing Keywords</h3>
          <p className="text-xs text-dark-200/50 mb-3">These keywords keep appearing in job descriptions but are missing from your resume</p>
          <div className="flex flex-wrap gap-2">
            {data.jobMatchProgress.mostMissingKeywords.map(kw => (
              <Badge key={kw} variant="red">{kw}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* No data state */}
      {!loading && !data?.resumeProgress?.totalResumes && !data?.interviewProgress?.totalInterviews && (
        <div className="card text-center py-12">
          <TrendingUp size={32} className="text-dark-200/20 mx-auto mb-3" strokeWidth={1.5} />
          <h3 className="font-display font-semibold text-white mb-1">No data yet</h3>
          <p className="text-sm text-dark-200/50">Complete a resume check or mock interview to start tracking your progress</p>
        </div>
      )}
    </div>
  )
}
