import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { resumeAPI } from '../services/api'
import { FileText, Plus, Download, Edit2, Trash2, Star } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ResumesPage() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => resumeAPI.getAll().then(r => setResumes(r.data.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleDownload = async (id, e) => {
    e.preventDefault()
    try {
      const res = await resumeAPI.download(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      Object.assign(document.createElement('a'), { href: url, download: 'resume.pdf' }).click()
      URL.revokeObjectURL(url)
    } catch {}
  }

  const handleDelete = async (id, e) => {
    e.preventDefault()
    if (!confirm('Delete this resume?')) return
    await resumeAPI.delete(id)
    toast.success('Resume deleted')
    load()
  }

  const handleSetDefault = async (id, e) => {
    e.preventDefault()
    await resumeAPI.setDefault(id)
    toast.success('Default resume set')
    load()
  }

  const scoreColor = (s) => !s ? 'gray' : s >= 75 ? 'green' : s >= 50 ? 'yellow' : 'red'

  return (
    <div className="stagger">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="section-title text-3xl">My Resumes</h1>
          <p className="text-dark-200/50 text-sm mt-1">Build and manage your ATS-optimised resumes</p>
        </div>
        <Link to="/resumes/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Resume
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : resumes.length === 0 ? (
        <EmptyState icon={FileText} title="No resumes yet"
          desc="Create your first ATS-friendly resume to get started"
          action={<Link to="/resumes/new" className="btn-primary inline-flex items-center gap-2"><Plus size={16}/>Build Resume</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map(r => (
            <div key={r._id} className="card-hover group relative">
              {r.isDefault && (
                <div className="absolute top-3 right-3">
                  <Badge variant="green"><Star size={10} className="fill-brand-400" /> Default</Badge>
                </div>
              )}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-brand-400" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-white truncate">{r.title || 'Untitled Resume'}</h3>
                  <p className="text-xs text-dark-200/50 mt-0.5">{new Date(r.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              {r.atsScore != null && (
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={scoreColor(r.atsScore)}>ATS {r.atsScore}%</Badge>
                </div>
              )}
              <div className="flex items-center gap-2 pt-4 border-t border-dark-200/10">
                <Link to={`/resumes/${r._id}/edit`} className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5">
                  <Edit2 size={13} /> Edit
                </Link>
                <button onClick={(e) => handleDownload(r._id, e)} className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5">
                  <Download size={13} /> PDF
                </button>
                {!r.isDefault && (
                  <button onClick={(e) => handleSetDefault(r._id, e)} className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5">
                    <Star size={13} /> Set Default
                  </button>
                )}
                <button onClick={(e) => handleDelete(r._id, e)} className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 ml-auto">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
