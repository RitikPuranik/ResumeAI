import { useQuery } from '@tanstack/react-query';
import { TrendingUp, FileText, Mic2, Brain, Mail, Award } from 'lucide-react';
import { progressAPI } from '../../api/progress';
import { PageLoader, ScoreRing } from '../../components/ui';

function SimpleBarChart({ data, color = '#4a7d55' }) {
  if (!data?.length) return <div className="text-xs text-sage-400 text-center py-4">No data yet</div>;
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm transition-all duration-500" style={{ height: `${(val / max) * 80}px`, backgroundColor: color, minHeight: 2 }} />
          <span className="text-[9px] text-sage-400">{val}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleLineChart({ data }) {
  if (!data?.length || data.length < 2) return <div className="text-xs text-sage-400 text-center py-4">Need more data points</div>;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 300; const h = 80;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <polyline fill="none" stroke="#4a7d55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - ((v - min) / range) * h} r="3" fill="#4a7d55" />
      ))}
    </svg>
  );
}

export default function Progress() {
  const { data, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressAPI.getDashboard().then((r) => r.data?.data || r.data),
  });

  const { data: history = [] } = useQuery({
    queryKey: ['progress-history'],
    queryFn: () => progressAPI.getHistory().then((r) => r.data?.data || []),
  });

  if (isLoading) return <PageLoader />;
  if (!data) return <div className="text-center text-sage-400 py-16">No progress data yet</div>;

  const { resumeProgress, interviewProgress, jobMatchProgress, coverLettersGenerated, overallReadinessScore, readinessLevel } = data;
  const trendData = history.map((h) => h.overallReadiness);

  const readinessColor = readinessLevel === 'Job Ready' ? 'text-sage-600 bg-sage-100' :
    readinessLevel === 'Getting There' ? 'text-warm-500 bg-warm-100' : 'text-red-500 bg-red-50';

  return (
    <div className="max-w-5xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-charcoal-800">Progress Tracker</h1>
        <p className="text-sm text-sage-400 mt-1">Your career readiness dashboard</p>
      </div>

      {/* Overall Score */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-sage-50 to-cream-50 border-sage-200">
        <div className="flex items-center gap-6">
          <ScoreRing score={overallReadinessScore} size={110} />
          <div className="flex-1">
            <p className="text-xs font-medium text-sage-500 uppercase tracking-wide mb-1">Overall Job Readiness</p>
            <h2 className="font-display text-3xl font-bold text-charcoal-800 mb-2">{overallReadinessScore}%</h2>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${readinessColor}`}>{readinessLevel}</span>
            <p className="text-xs text-sage-400 mt-3">Weighted: 30% ATS · 50% Interview · 20% Job Match</p>
          </div>
          {resumeProgress?.improvement !== 'N/A' && (
            <div className="text-center p-4 bg-white rounded-2xl border border-sage-200">
              <p className="text-2xl font-bold text-sage-600">{resumeProgress.improvement}</p>
              <p className="text-xs text-sage-400">improvement</p>
            </div>
          )}
        </div>
      </div>

      {/* Score Trend */}
      {trendData.length > 1 && (
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-charcoal-800 mb-4 text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-sage-500" /> Readiness Trend
          </h3>
          <SimpleLineChart data={trendData} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Resumes', value: resumeProgress?.totalResumes || 0, icon: FileText, color: 'text-sage-500 bg-sage-50' },
          { label: 'Interviews', value: interviewProgress?.totalInterviews || 0, icon: Mic2, color: 'text-warm-500 bg-warm-50' },
          { label: 'Job Matches', value: jobMatchProgress?.totalMatches || 0, icon: Brain, color: 'text-charcoal-800 bg-cream-200' },
          { label: 'Cover Letters', value: coverLettersGenerated || 0, icon: Mail, color: 'text-sage-500 bg-sage-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="font-display text-2xl font-bold text-charcoal-800">{value}</p>
            <p className="text-xs text-sage-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* ATS History */}
        <div className="card p-5">
          <h3 className="font-semibold text-charcoal-800 mb-1 text-sm">ATS Score History</h3>
          <p className="text-xs text-sage-400 mb-4">Latest: {resumeProgress?.latestAtsScore || 0}</p>
          <SimpleBarChart data={resumeProgress?.atsScoreHistory} />
        </div>

        {/* Interview History */}
        <div className="card p-5">
          <h3 className="font-semibold text-charcoal-800 mb-1 text-sm">Interview Scores</h3>
          <p className="text-xs text-sage-400 mb-4">Avg: {interviewProgress?.averageScore || 0}</p>
          <SimpleBarChart data={interviewProgress?.scoreHistory} color="#d4793a" />
        </div>

        {/* Job Match History */}
        <div className="card p-5">
          <h3 className="font-semibold text-charcoal-800 mb-1 text-sm">Job Match Scores</h3>
          <p className="text-xs text-sage-400 mb-4">Avg: {jobMatchProgress?.averageMatchScore || 0}%</p>
          <SimpleBarChart data={jobMatchProgress?.matchScoreHistory} color="#6d9e76" />
        </div>
      </div>

      {/* Missing Keywords */}
      {jobMatchProgress?.mostMissingKeywords?.length > 0 && (
        <div className="card p-5 mt-5">
          <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2 text-sm">
            <Award size={16} className="text-warm-500" /> Most Commonly Missing Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {jobMatchProgress.mostMissingKeywords.map((k) => (
              <span key={k} className="text-xs px-3 py-1 bg-warm-50 text-warm-500 border border-warm-200 rounded-full">{k}</span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Interviews */}
      {interviewProgress?.recentInterviews?.length > 0 && (
        <div className="card p-5 mt-5">
          <h3 className="font-semibold text-charcoal-800 mb-3 text-sm">Recent Interviews</h3>
          <div className="space-y-2">
            {interviewProgress.recentInterviews.map((i, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
                <Mic2 size={14} className="text-warm-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal-800">{i.role}</p>
                  <p className="text-xs text-sage-400 capitalize">{i.roundType}</p>
                </div>
                {i.score != null && (
                  <span className={`text-sm font-bold ${i.score >= 70 ? 'text-sage-600' : i.score >= 40 ? 'text-warm-500' : 'text-red-500'}`}>
                    {i.score}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}