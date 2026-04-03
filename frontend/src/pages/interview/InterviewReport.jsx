import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mic2, CheckCircle, AlertCircle, Star, Plus } from 'lucide-react';
import { interviewAPI } from '../../api/interview';
import { PageLoader, ScoreRing, Badge } from '../../components/ui';

export default function InterviewReport() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['interview-report', id],
    queryFn: () => interviewAPI.getReport(id).then((r) => r.data),
    retry: 2,
  });

  // fallback: load session if report not ready
  const { data: sessionData } = useQuery({
    queryKey: ['interview-session', id],
    queryFn: () => interviewAPI.getSession(id).then((r) => r.data),
    enabled: !data,
  });

  if (isLoading) return <PageLoader />;

  const report = data?.report || data;
  const session = sessionData?.session || sessionData;
  const source = report || session;

  if (!source) return <div className="text-center text-sage-400 py-16">Report not found</div>;

  const score = report?.overallScore || report?.score || session?.score;
  const feedback = report?.feedback || report?.summary;
  const qaList = report?.answers || session?.answers || [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/interview" className="p-2 rounded-xl hover:bg-cream-100 text-sage-400">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-charcoal-800">Interview Report</h1>
          <p className="text-xs text-sage-400 mt-0.5">{source?.jobRole || 'Mock Interview'} · {new Date(source.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <Link to="/interview" className="btn-primary text-sm py-2.5">
          <Plus size={16} /> New Session
        </Link>
      </div>

      {/* Score Overview */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-6">
          {score != null ? (
            <ScoreRing score={score} size={100} />
          ) : (
            <div className="w-24 h-24 rounded-full bg-cream-100 flex items-center justify-center">
              <Mic2 size={28} className="text-sage-400" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-charcoal-800 mb-1">
              {score != null ? (score >= 70 ? 'Great performance!' : score >= 40 ? 'Good effort!' : 'Keep practicing!') : 'Interview Complete'}
            </h2>
            {feedback && <p className="text-sm text-sage-500 leading-relaxed">{feedback}</p>}
            <div className="flex gap-2 mt-3">
              <Badge variant={source.status === 'completed' ? 'success' : 'warning'}>
                <CheckCircle size={12} className="inline mr-1" />
                {source.status || 'completed'}
              </Badge>
              {qaList.length > 0 && <Badge variant="info">{qaList.length} questions</Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      {(report?.strengths?.length > 0 || report?.improvements?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          {report?.strengths?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-sage-500" /> What went well
              </h3>
              <ul className="space-y-2">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage-400 mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-sage-600">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report?.improvements?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2 text-sm">
                <AlertCircle size={16} className="text-warm-500" /> Areas to improve
              </h3>
              <ul className="space-y-2">
                {report.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warm-400 mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-sage-600">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Q&A Review */}
      {qaList.length > 0 && (
        <div className="card p-5">
          <h3 className="font-semibold text-charcoal-800 mb-4 text-sm">Question Review</h3>
          <div className="space-y-5">
            {qaList.map((item, i) => (
              <div key={i} className="border-b border-cream-200 pb-5 last:border-0 last:pb-0">
                <div className="flex items-start gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-warm-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-warm-500">{i + 1}</span>
                  </div>
                  <p className="text-sm font-medium text-charcoal-800">{item.question}</p>
                </div>
                <div className="ml-8 space-y-2">
                  <div className="p-3 bg-cream-50 rounded-xl">
                    <p className="text-xs text-sage-400 mb-1 font-medium">Your answer</p>
                    <p className="text-sm text-sage-600">{item.answer}</p>
                  </div>
                  {item.feedback && (
                    <div className="p-3 bg-sage-50 rounded-xl border border-sage-100">
                      <p className="text-xs text-sage-500 mb-1 font-medium flex items-center gap-1">
                        <Star size={11} /> AI Feedback
                      </p>
                      <p className="text-sm text-sage-600">{item.feedback}</p>
                    </div>
                  )}
                  {item.score != null && (
                    <div className="flex items-center gap-2">
                      <Badge variant={item.score >= 7 ? 'success' : item.score >= 4 ? 'warning' : 'danger'}>
                        Score: {item.score}/10
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
