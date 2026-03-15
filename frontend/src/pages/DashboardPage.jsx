import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { progressAPI } from '../services/api'
import useAuthStore from '../store/authStore'
import StatCard from '../components/ui/StatCard'
import ScoreRing from '../components/ui/ScoreRing'
import { FileText, Mic2, Briefcase, PenLine, TrendingUp, ArrowRight } from 'lucide-react'
import Spinner from '../components/ui/Spinner'

const quickActions = [
  { to: '/resumes/new',   icon: FileText,  label: 'Build Resume',     color: 'green' },
  { to: '/ats',           icon: TrendingUp,label: 'Check ATS Score',  color: 'blue' },
  { to: '/interviews',    icon: Mic2,      label: 'Practice Interview',color: 'yellow' },
  { to: '/job-match',     icon: Briefcase, label: 'Match Job',        color: 'purple' },
  { to: '/cover-letter',  icon: PenLine,   label: 'Cover Letter',     color: 'green' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    progressAPI.dashboard()
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="stagger">
      {/* Header */}
      <div className="page-header">
        <p className="text-brand-400 text-sm font-medium font-mono mb-1">{greeting} 👋</p>
        <h1 className="font-display text-4xl font-bold text-white">{user?.name?.split(' ')[0]}</h1>
        <p className="text-dark-200/50 mt-1 text-sm">Here's your job readiness overview</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size={32} /></div>
      ) : (
        <>
          {/* Readiness banner */}
          {data && (
            <div className="card glow-green mb-8 flex items-center gap-8">
              <ScoreRing score={data.overallReadinessScore} size={110} />
              <div>
                <p className="text-xs text-dark-200/50 font-mono mb-1">OVERALL READINESS</p>
                <h2 className="font-display text-2xl font-bold text-white mb-1">{data.readinessLevel}</h2>
                <p className="text-sm text-dark-200/50">Based on your resume quality, interview performance & job matches</p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="ATS Score"       value={data?.resumeProgress?.latestAtsScore ? `${data.resumeProgress.latestAtsScore}%` : null} icon={FileText}  color="green"  sub="Latest resume" />
            <StatCard label="Avg Interview"   value={data?.interviewProgress?.averageScore ? `${data.interviewProgress.averageScore}%` : null} icon={Mic2}     color="yellow" sub={`${data?.interviewProgress?.totalInterviews || 0} sessions`} />
            <StatCard label="Job Match Avg"   value={data?.jobMatchProgress?.averageMatchScore ? `${data.jobMatchProgress.averageMatchScore}%` : null} icon={Briefcase} color="blue" sub={`${data?.jobMatchProgress?.totalMatches || 0} analyses`} />
            <StatCard label="Cover Letters"   value={data?.coverLettersGenerated ?? 0} icon={PenLine} color="purple" sub="Generated" />
          </div>

          {/* Quick actions */}
          <div className="mb-2">
            <h2 className="section-title mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {quickActions.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className="card-hover flex flex-col items-center gap-3 p-5 text-center group">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                    <Icon size={18} className="text-brand-400" strokeWidth={1.8} />
                  </div>
                  <span className="text-xs font-medium text-dark-200/70 group-hover:text-white transition-colors">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Weak areas */}
          {data?.jobMatchProgress?.mostMissingKeywords?.length > 0 && (
            <div className="card mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white">Most Missing Keywords</h3>
                <Link to="/job-match" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  Run analysis <ArrowRight size={12} />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.jobMatchProgress.mostMissingKeywords.map(kw => (
                  <span key={kw} className="badge bg-red-500/10 text-red-400 border border-red-500/20">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
