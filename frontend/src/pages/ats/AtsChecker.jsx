import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, Upload, FileText, CheckCircle, AlertCircle, Sparkles, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { atsAPI } from '../../api/ats';
import { resumeAPI } from '../../api/resume';
import { ScoreRing, Badge, Spinner, PageLoader } from '../../components/ui';

export default function AtsChecker() {
  const [mode, setMode] = useState('saved'); // 'saved' | 'upload'
  const [selectedResume, setSelectedResume] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { data: resumes = [], isLoading: resumesLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumeAPI.getAll,
  });

  const { data: history = [], isLoading: histLoading, refetch } = useQuery({
    queryKey: ['ats-history'],
    queryFn: () => atsAPI.getHistory().then((r) => r.data?.data || []),
  });

  const getResumeName = (r) => r.uploadedPdf?.originalName || r.personalInfo?.fullName || r.title || 'Resume';

  const handleAnalyze = async () => {
    if (mode === 'saved' && !selectedResume) return toast.error('Select a resume');
    if (mode === 'upload' && !file) return toast.error('Upload a PDF file');
    setLoading(true);
    try {
      let res;
      if (mode === 'saved') {
        res = await atsAPI.analyzeById(selectedResume);
      } else {
        const fd = new FormData();
        fd.append('resume', file);
        res = await atsAPI.analyzeFile(fd);
      }
      setResult(res.data?.data || res.data);
      refetch();
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-charcoal-800">ATS Checker</h1>
        <p className="text-sm text-sage-400 mt-1">Analyse any resume against ATS systems with AI</p>
      </div>

      {/* Input */}
      <div className="card p-6 mb-6">
        <div className="flex gap-3 mb-5">
          {['saved', 'upload'].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === m ? 'bg-sage-500 text-white' : 'bg-cream-100 text-sage-600 hover:bg-cream-200'}`}>
              {m === 'saved' ? <><FileText size={14} className="inline mr-1.5" />Saved Resume</> : <><Upload size={14} className="inline mr-1.5" />Upload PDF</>}
            </button>
          ))}
        </div>

        {mode === 'saved' ? (
          resumesLoading ? <Spinner /> : (
            <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)} className="input-field">
              <option value="">Select a resume…</option>
              {resumes.map((r) => <option key={r._id} value={r._id}>{getResumeName(r)}</option>)}
            </select>
          )
        ) : (
          <div>
            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="input-field" />
            {file && <p className="text-xs text-sage-400 mt-1">{file.name}</p>}
          </div>
        )}

        <button onClick={handleAnalyze} disabled={loading} className="btn-primary mt-4">
          {loading ? <><Spinner size={16} className="text-white" /> Analysing…</> : <><Target size={16} /> Run ATS Check</>}
        </button>
      </div>

      {/* Latest Result */}
      {result && (
        <div className="space-y-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-6">
              <ScoreRing score={result.score} size={100} />
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold text-charcoal-800 mb-1">ATS Score: {result.score}/100</h2>
                {result.analysis?.verdict && <p className="text-sm text-sage-500 mb-3">{result.analysis.verdict}</p>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'Keywords', val: result.analysis?.keywordScore },
                    { label: 'Format', val: result.analysis?.formattingScore },
                    { label: 'Complete', val: result.analysis?.completenessScore },
                    { label: 'Length', val: result.analysis?.lengthScore },
                  ].map(({ label, val }) => val != null && (
                    <div key={label} className="text-center p-2 bg-cream-50 rounded-xl">
                      <p className="font-bold text-charcoal-800">{val}</p>
                      <p className="text-xs text-sage-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {result.analysis?.matchedKeywords?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-sage-500" /> Matched Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.matchedKeywords.map((k) => (
                    <span key={k} className="text-xs px-2.5 py-1 bg-sage-50 text-sage-600 border border-sage-100 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            )}
            {result.analysis?.missingSections?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2 text-sm">
                  <AlertCircle size={16} className="text-warm-500" /> Missing Sections
                </h3>
                <ul className="space-y-1">
                  {result.analysis.missingSections.map((s) => (
                    <li key={s} className="text-sm text-sage-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-warm-400 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {result.analysis?.suggestions?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal-800 mb-3 flex items-center gap-2 text-sm">
                <Sparkles size={16} className="text-sage-500" /> Suggestions
              </h3>
              <div className="space-y-2">
                {result.analysis.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-cream-50 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-sage-600">{i + 1}</div>
                    <p className="text-sm text-sage-600">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div>
        <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-4">Analysis History</h2>
        {histLoading ? <PageLoader /> : history.length === 0 ? (
          <div className="card p-8 text-center text-sage-400">No analyses yet</div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item._id} className="card p-4 flex items-center gap-4">
                <ScoreRing score={item.score} size={52} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal-800">{item.analysis?.verdict || 'ATS Analysis'}</p>
                  <p className="text-xs text-sage-400 flex items-center gap-1 mt-0.5">
                    <Clock size={11} /> {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <Badge variant={item.score >= 70 ? 'success' : item.score >= 40 ? 'warning' : 'danger'}>
                  {item.score}/100
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}