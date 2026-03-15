import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resumeAPI } from '../services/api'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import Spinner from '../components/ui/Spinner'

const STEPS = ['Personal Info', 'Work Experience', 'Education', 'Skills', 'Projects', 'Certifications']

const SectionHeader = ({ title, open, toggle }) => (
  <button type="button" onClick={toggle}
    className="w-full flex items-center justify-between p-4 bg-dark-800/50 rounded-xl border border-dark-200/10 hover:border-brand-500/30 transition-colors">
    <span className="font-display font-semibold text-white">{title}</span>
    {open ? <ChevronUp size={18} className="text-dark-200/50" /> : <ChevronDown size={18} className="text-dark-200/50" />}
  </button>
)

export default function ResumeBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [openSection, setOpenSection] = useState(0)

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', summary: '' },
      workExperience: [],
      education: [],
      skills: { technical: '', soft: '', languages: '', tools: '' },
      projects: [],
      certifications: [],
    }
  })

  const work  = useFieldArray({ control, name: 'workExperience' })
  const edu   = useFieldArray({ control, name: 'education' })
  const projs = useFieldArray({ control, name: 'projects' })
  const certs = useFieldArray({ control, name: 'certifications' })

  useEffect(() => {
    if (id) {
      setLoading(true)
      resumeAPI.getOne(id).then(r => {
        const d = r.data.data
        reset({
          ...d,
          skills: {
            technical: d.skills?.technical?.join(', ') || '',
            soft:      d.skills?.soft?.join(', ') || '',
            languages: d.skills?.languages?.join(', ') || '',
            tools:     d.skills?.tools?.join(', ') || '',
          }
        })
      }).finally(() => setLoading(false))
    }
  }, [id])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        skills: {
          technical: data.skills.technical.split(',').map(s => s.trim()).filter(Boolean),
          soft:      data.skills.soft.split(',').map(s => s.trim()).filter(Boolean),
          languages: data.skills.languages.split(',').map(s => s.trim()).filter(Boolean),
          tools:     data.skills.tools.split(',').map(s => s.trim()).filter(Boolean),
        },
        workExperience: data.workExperience.map(w => ({
          ...w,
          description: w.descriptionRaw?.split('\n').map(s => s.trim()).filter(Boolean) || [],
        })),
        projects: data.projects.map(p => ({
          ...p,
          description: p.descriptionRaw?.split('\n').map(s => s.trim()).filter(Boolean) || [],
          techStack:   p.techStackRaw?.split(',').map(s => s.trim()).filter(Boolean) || [],
        })),
      }
      if (id) {
        await resumeAPI.update(id, payload)
        toast.success('Resume updated')
      } else {
        await resumeAPI.create(payload)
        toast.success('Resume created')
      }
      navigate('/resumes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  const toggle = (i) => setOpenSection(openSection === i ? -1 : i)

  return (
    <div className="stagger max-w-3xl">
      <div className="page-header">
        <h1 className="section-title text-3xl">{id ? 'Edit Resume' : 'Build Resume'}</h1>
        <p className="text-dark-200/50 text-sm mt-1">All fields marked * are required. Company is always optional.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="card">
          <label className="label">Resume Title</label>
          <input {...register('title')} placeholder="e.g. Frontend Developer Resume" className="input" />
        </div>

        {/* Personal Info */}
        <div>
          <SectionHeader title="Personal Information" open={openSection === 0} toggle={() => toggle(0)} />
          {openSection === 0 && (
            <div className="card mt-2 grid grid-cols-2 gap-4">
              {[['fullName','Full Name *'],['email','Email *'],['phone','Phone'],['location','Location'],
                ['linkedin','LinkedIn URL'],['github','GitHub URL'],['portfolio','Portfolio URL']].map(([f,l]) => (
                <div key={f} className={f === 'fullName' || f === 'portfolio' ? 'col-span-2' : ''}>
                  <label className="label">{l}</label>
                  <input {...register(`personalInfo.${f}`, f === 'fullName' || f === 'email' ? { required: true } : {})}
                    className="input" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="label">Professional Summary</label>
                <textarea {...register('personalInfo.summary')} rows={3} placeholder="Brief overview of your background..." className="input resize-none" />
              </div>
            </div>
          )}
        </div>

        {/* Work Experience */}
        <div>
          <SectionHeader title={`Work Experience (${work.fields.length})`} open={openSection === 1} toggle={() => toggle(1)} />
          {openSection === 1 && (
            <div className="mt-2 space-y-3">
              {work.fields.map((f, i) => (
                <div key={f.id} className="card">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-brand-400">Position {i + 1}</span>
                    <button type="button" onClick={() => work.remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Job Title *</label><input {...register(`workExperience.${i}.jobTitle`, { required: true })} className="input" /></div>
                    <div><label className="label">Company <span className="text-dark-200/30 font-normal">(optional)</span></label><input {...register(`workExperience.${i}.company`)} placeholder="Leave blank if not applicable" className="input" /></div>
                    <div><label className="label">Location</label><input {...register(`workExperience.${i}.location`)} className="input" /></div>
                    <div><label className="label">Start Date *</label><input {...register(`workExperience.${i}.startDate`, { required: true })} placeholder="Jan 2022" className="input" /></div>
                    <div><label className="label">End Date</label><input {...register(`workExperience.${i}.endDate`)} placeholder="Present" className="input" /></div>
                    <div className="flex items-center gap-2 pt-5">
                      <input type="checkbox" {...register(`workExperience.${i}.current`)} id={`cur-${i}`} className="accent-brand-500" />
                      <label htmlFor={`cur-${i}`} className="text-sm text-dark-200/70">Currently working here</label>
                    </div>
                    <div className="col-span-2"><label className="label">Description (one bullet per line)</label>
                      <textarea {...register(`workExperience.${i}.descriptionRaw`)} rows={4} placeholder="Built REST APIs using Node.js&#10;Reduced load time by 40%&#10;Led team of 3 engineers" className="input resize-none font-mono text-sm" /></div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => work.append({ jobTitle:'', company:'', location:'', startDate:'', endDate:'Present', current:false, descriptionRaw:'' })}
                className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={15} /> Add Work Experience</button>
            </div>
          )}
        </div>

        {/* Education */}
        <div>
          <SectionHeader title={`Education (${edu.fields.length})`} open={openSection === 2} toggle={() => toggle(2)} />
          {openSection === 2 && (
            <div className="mt-2 space-y-3">
              {edu.fields.map((f, i) => (
                <div key={f.id} className="card">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-brand-400">Degree {i + 1}</span>
                    <button type="button" onClick={() => edu.remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Degree *</label><input {...register(`education.${i}.degree`, { required: true })} placeholder="B.Sc. Computer Science" className="input" /></div>
                    <div><label className="label">Institution *</label><input {...register(`education.${i}.institution`, { required: true })} className="input" /></div>
                    <div><label className="label">Company / Org <span className="text-dark-200/30 font-normal">(optional)</span></label><input {...register(`education.${i}.company`)} placeholder="Leave blank if not applicable" className="input" /></div>
                    <div><label className="label">Field of Study</label><input {...register(`education.${i}.fieldOfStudy`)} className="input" /></div>
                    <div><label className="label">Start Date *</label><input {...register(`education.${i}.startDate`, { required: true })} placeholder="Sep 2018" className="input" /></div>
                    <div><label className="label">End Date</label><input {...register(`education.${i}.endDate`)} placeholder="Jun 2022" className="input" /></div>
                    <div><label className="label">Grade / GPA</label><input {...register(`education.${i}.grade`)} placeholder="3.8 / 4.0" className="input" /></div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => edu.append({ degree:'', institution:'', company:'', fieldOfStudy:'', startDate:'', endDate:'', grade:'' })}
                className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={15} /> Add Education</button>
            </div>
          )}
        </div>

        {/* Skills */}
        <div>
          <SectionHeader title="Skills" open={openSection === 3} toggle={() => toggle(3)} />
          {openSection === 3 && (
            <div className="card mt-2 grid grid-cols-2 gap-4">
              {[['technical','Technical Skills'],['tools','Tools & Technologies'],['soft','Soft Skills'],['languages','Languages']].map(([f,l]) => (
                <div key={f}>
                  <label className="label">{l} <span className="text-dark-200/30 font-normal">(comma separated)</span></label>
                  <input {...register(`skills.${f}`)} placeholder="React, Node.js, Python..." className="input" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div>
          <SectionHeader title={`Projects (${projs.fields.length})`} open={openSection === 4} toggle={() => toggle(4)} />
          {openSection === 4 && (
            <div className="mt-2 space-y-3">
              {projs.fields.map((f, i) => (
                <div key={f.id} className="card">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-brand-400">Project {i + 1}</span>
                    <button type="button" onClick={() => projs.remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Project Title *</label><input {...register(`projects.${i}.title`, { required: true })} className="input" /></div>
                    <div><label className="label">Built for Company <span className="text-dark-200/30 font-normal">(optional)</span></label><input {...register(`projects.${i}.company`)} placeholder="Leave blank if personal project" className="input" /></div>
                    <div><label className="label">Tech Stack <span className="text-dark-200/30 font-normal">(comma separated)</span></label><input {...register(`projects.${i}.techStackRaw`)} placeholder="React, Node.js, MongoDB" className="input" /></div>
                    <div><label className="label">Live URL</label><input {...register(`projects.${i}.liveUrl`)} className="input" /></div>
                    <div className="col-span-2"><label className="label">Description (one bullet per line)</label>
                      <textarea {...register(`projects.${i}.descriptionRaw`)} rows={3} placeholder="Built full-stack application&#10;Implemented real-time features" className="input resize-none font-mono text-sm" /></div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => projs.append({ title:'', company:'', techStackRaw:'', liveUrl:'', descriptionRaw:'' })}
                className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={15} /> Add Project</button>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div>
          <SectionHeader title={`Certifications (${certs.fields.length})`} open={openSection === 5} toggle={() => toggle(5)} />
          {openSection === 5 && (
            <div className="mt-2 space-y-3">
              {certs.fields.map((f, i) => (
                <div key={f.id} className="card">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium text-brand-400">Cert {i + 1}</span>
                    <button type="button" onClick={() => certs.remove(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={15} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Certification Name *</label><input {...register(`certifications.${i}.name`, { required: true })} className="input" /></div>
                    <div><label className="label">Issuing Body <span className="text-dark-200/30 font-normal">(optional)</span></label><input {...register(`certifications.${i}.issuingBody`)} placeholder="AWS, Google, Coursera..." className="input" /></div>
                    <div><label className="label">Issue Date</label><input {...register(`certifications.${i}.issueDate`)} placeholder="Jan 2023" className="input" /></div>
                    <div><label className="label">Expiry Date</label><input {...register(`certifications.${i}.expiryDate`)} placeholder="Jan 2026 or No Expiry" className="input" /></div>
                    <div className="col-span-2"><label className="label">Credential URL</label><input {...register(`certifications.${i}.credentialUrl`)} placeholder="https://..." className="input" /></div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => certs.append({ name:'', issuingBody:'', issueDate:'', expiryDate:'', credentialUrl:'' })}
                className="btn-secondary w-full flex items-center justify-center gap-2"><Plus size={15} /> Add Certification</button>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-4">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <Spinner size={16} /> : <Save size={16} />}
            {id ? 'Save Changes' : 'Create Resume'}
          </button>
          <button type="button" onClick={() => navigate('/resumes')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
