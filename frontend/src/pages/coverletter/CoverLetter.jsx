import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Copy, Trash2, Clock, Sparkles, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { coverletterAPI } from '../../api/coverletter';
import { resumeAPI } from '../../api/resume';
import { PageLoader, Badge, Spinner } from '../../components/ui';

export default function CoverLetter() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ resumeId: '', jobTitle: '', company: '', jobDescription: '', tone: 'professional' });
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  const { data: resumes = [] } = useQuery({ queryKey: ['resumes'], queryFn: resumeAPI.getAll });

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['cover-letters'],
    queryFn: () => coverletterAPI.getAll().then((r) => r.data?.data || []),
  });

  const generateMutation = useMutation({
    mutationFn: () => coverletterAPI.generate(form),
    onSuccess: (res) => {
      const letter = res.data?.data || res.data;
      setPreview(letter);
      qc.invalidateQueries(['cover-letters']);
      toast.success('Cover letter generated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Generation failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => coverletterAPI.delete(id),
    onSuccess: () => { toast.success('Deleted'); qc.invalidateQueries(['cover-letters']); },
  });

  const handleCopy = () => {
    if (!preview?.content) return;
    navigator.clipboard.writeText(preview.content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getResumeName = (r) => r.uploadedPdf?.originalName || r.personalInfo?.fullName || r.title || 'Resume';

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-charcoal-800">Cover Letter Generator</h1>
        <p className="text-sm text-sage-400 mt-1">AI-crafted, tailored cover letters in seconds</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Form */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-charcoal-800 text-sm">Generate New</h2>

          <div>
            <label className="label">Resume</label>
            <select value={form.resumeId} onChange={(e) => setForm({ ...form, resumeId: e.target.value })} className="input-field">
              <option value="">Select resume…</option>
              {resumes.map((r) => <option key={r._id} value={r._id}>{getResumeName(r)}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Job Title</label>
            <input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              placeholder="e.g. Frontend Developer" className="input-field" />
          </div>

          <div>
            <label className="label">Company (optional)</label>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Leave blank to use 'your company'" className="input-field" />
          </div>

          <div>
            <label className="label">Tone</label>
            <select value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })} className="input-field">
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="confident">Confident</option>
            </select>
          </div>

          <div>
            <label className="label">Job Description (optional)</label>
            <textarea value={form.jobDescription} onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
              placeholder="Paste the JD for a more tailored letter…" rows={4} className="input-field resize-none" />
          </div>

          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending || !form.resumeId || !form.jobTitle}
            className="btn-primary w-full"
          >
            {generateMutation.isPending
              ? <><Spinner size={16} className="text-white" /> Generating…</>
              : <><Sparkles size={16} /> Generate</>}
          </button>
        </div>

        {/* Preview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-charcoal-800 text-sm">Preview</h2>
            {preview && (
              <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
              </button>
            )}
          </div>
          {preview ? (
            <div>
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <Badge variant="info">{preview.tone}</Badge>
                <Badge variant="default">{preview.wordCount} words</Badge>
                {preview.company && <Badge variant="default">{preview.company}</Badge>}
              </div>
              <div className="bg-cream-50 rounded-xl p-4 text-sm text-sage-700 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {preview.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-sage-300">
              <Mail size={32} className="mb-2" />
              <p className="text-sm">Generated letter will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="font-display text-lg font-semibold text-charcoal-800 mb-4">Saved Letters</h2>
        {isLoading ? <PageLoader /> : letters.length === 0 ? (
          <div className="card p-8 text-center text-sage-400">No letters generated yet</div>
        ) : (
          <div className="space-y-3">
            {letters.map((item) => (
              <div key={item._id} className="card p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-sage-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-800">{item.jobTitle}{item.company ? ` @ ${item.company}` : ''}</p>
                  <p className="text-xs text-sage-400 flex items-center gap-2 mt-0.5">
                    <Clock size={11} /> {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    <span>·</span> {item.wordCount} words <span>·</span> {item.tone}
                  </p>
                </div>
                <button
                  onClick={() => coverletterAPI.getOne(item._id).then((r) => setPreview(r.data?.data || r.data))}
                  className="btn-secondary text-xs py-2"
                >
                  View
                </button>
                <button onClick={() => deleteMutation.mutate(item._id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}