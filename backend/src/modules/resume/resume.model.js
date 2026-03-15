import mongoose from 'mongoose'

// Company is optional throughout - user can add or skip it
const workExperienceSchema = new mongoose.Schema({
  jobTitle:    { type: String, required: true },
  company:     { type: String, default: '' },        // OPTIONAL - user can leave blank
  location:    { type: String, default: '' },
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: 'Present' },
  current:     { type: Boolean, default: false },
  description: [{ type: String }],                   // bullet points
}, { _id: false })

const educationSchema = new mongoose.Schema({
  degree:      { type: String, required: true },
  institution: { type: String, required: true },
  company:     { type: String, default: '' },        // OPTIONAL - e.g. university company/org
  fieldOfStudy:{ type: String, default: '' },
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: 'Present' },
  grade:       { type: String, default: '' },
}, { _id: false })

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, default: '' },        // OPTIONAL - built for a company
  description: [{ type: String }],
  techStack:   [{ type: String }],
  liveUrl:     { type: String, default: '' },
  repoUrl:     { type: String, default: '' },
  startDate:   { type: String, default: '' },
  endDate:     { type: String, default: '' },
}, { _id: false })

const certificationSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  issuingBody:  { type: String, default: '' },       // OPTIONAL - company that issued it
  issueDate:    { type: String, default: '' },
  expiryDate:   { type: String, default: '' },
  credentialUrl:{ type: String, default: '' },
}, { _id: false })

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },

  // Personal Info
  personalInfo: {
    fullName:    { type: String, required: true },
    email:       { type: String, required: true },
    phone:       { type: String, default: '' },
    location:    { type: String, default: '' },
    linkedin:    { type: String, default: '' },
    github:      { type: String, default: '' },
    portfolio:   { type: String, default: '' },
    summary:     { type: String, default: '' },
  },

  // Sections
  workExperience:  [workExperienceSchema],
  education:       [educationSchema],
  skills: {
    technical: [{ type: String }],
    soft:      [{ type: String }],
    languages: [{ type: String }],
    tools:     [{ type: String }],
  },
  projects:        [projectSchema],
  certifications:  [certificationSchema],

  // Meta
  atsScore:   { type: Number, default: null },
  isDefault:  { type: Boolean, default: false },

}, { timestamps: true })

export default mongoose.model('Resume', resumeSchema)
