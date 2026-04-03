import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../../api/resume';
import { Spinner } from '../../components/ui';

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDropRejected: (files) => {
      const err = files[0]?.errors[0];
      if (err?.code === 'file-too-large') toast.error('File too large. Max 10MB.');
      else toast.error('Only PDF files are accepted.');
    },
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await resumeAPI.upload(formData);
      const id = res.data?.resume?._id || res.data?._id;
      toast.success('Resume uploaded successfully!');
      navigate(id ? `/resumes/${id}` : '/resumes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-charcoal-800">Upload Resume</h1>
        <p className="text-sm text-sage-400 mt-1">Upload your PDF resume for AI-powered analysis</p>
      </div>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive
            ? 'border-sage-400 bg-sage-50 scale-[1.01]'
            : file
            ? 'border-sage-300 bg-sage-50'
            : 'border-cream-300 bg-white hover:border-sage-300 hover:bg-cream-50'
          }
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-sage-100 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-sage-500" />
            </div>
            <p className="font-medium text-charcoal-800 mb-1">{file.name}</p>
            <p className="text-xs text-sage-400 mb-4">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500"
            >
              <X size={14} /> Remove file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-sage-100' : 'bg-cream-200'}`}>
              <Upload size={28} className={isDragActive ? 'text-sage-500' : 'text-sage-400'} />
            </div>
            <p className="font-medium text-charcoal-800 mb-1">
              {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
            </p>
            <p className="text-sm text-sage-400 mb-3">or click to browse</p>
            <p className="text-xs text-sage-300">PDF only · Max 10MB</p>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div className="card p-5 mt-5">
        <h3 className="text-sm font-semibold text-charcoal-800 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-sage-500" /> What happens after upload
        </h3>
        <div className="space-y-2.5">
          {[
            'Your PDF is securely stored in the cloud',
            'AI extracts your skills, experience & education',
            'You get an instant ATS score and detailed feedback',
            'Personalized suggestions to improve your resume',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-sage-600">{i + 1}</span>
              </div>
              <p className="text-xs text-sage-500">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="btn-primary w-full mt-5 py-4 text-base"
      >
        {uploading ? (
          <><Spinner size={18} className="text-white" /> Uploading & analyzing...</>
        ) : (
          <><FileText size={18} /> Upload & Analyze Resume</>
        )}
      </button>
    </div>
  );
}
