import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, Trash2, Eye, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../../api/resume';
import { PageLoader, EmptyState, Badge } from '../../components/ui';

export default function ResumeList() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeAPI.getAll().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => resumeAPI.delete(id),
    onSuccess: () => {
      toast.success('Resume deleted');
      qc.invalidateQueries(['resumes']);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const resumes = data?.resumes || data || [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-charcoal-800">My Resumes</h1>
          <p className="text-sm text-sage-400 mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <Link to="/resumes/upload" className="btn-primary text-sm py-2.5">
          <Plus size={16} /> Upload New
        </Link>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Upload your first resume to get AI-powered analysis and scoring."
          action={
            <Link to="/resumes/upload" className="btn-primary text-sm">
              <Plus size={16} /> Upload Resume
            </Link>
          }
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {resumes.map((resume) => (
            <div key={resume._id} className="card p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-sage-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-charcoal-800 truncate text-sm">
                    {resume.filename || resume.originalName || 'Resume.pdf'}
                  </h3>
                  <p className="text-xs text-sage-400 mt-0.5">
                    {new Date(resume.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                {resume.score != null && (
                  <Badge variant={resume.score >= 70 ? 'success' : resume.score >= 40 ? 'warning' : 'danger'}>
                    Score: {resume.score}
                  </Badge>
                )}
              </div>

              {resume.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {resume.skills.slice(0, 4).map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-cream-100 text-sage-600 rounded-full border border-cream-300">
                      {s}
                    </span>
                  ))}
                  {resume.skills.length > 4 && (
                    <span className="text-xs px-2 py-0.5 bg-cream-100 text-sage-400 rounded-full">
                      +{resume.skills.length - 4}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Link to={`/resumes/${resume._id}`} className="flex-1 btn-secondary text-xs py-2">
                  <Eye size={14} /> View Analysis
                </Link>
                {!resume.analysis && (
                  <Link to={`/resumes/${resume._id}`} className="flex-1 btn-primary text-xs py-2">
                    <Sparkles size={14} /> Analyze
                  </Link>
                )}
                <button
                  onClick={() => {
                    if (confirm('Delete this resume?')) deleteMutation.mutate(resume._id);
                  }}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
