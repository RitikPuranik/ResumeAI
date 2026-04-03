import mongoose from 'mongoose'

const workExperienceSchema = new mongoose.Schema({
  jobTitle:    { type: String, required: true },
  company:     { type: String, default: '' },
  location:    { type: String, default: '' },
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: 'Present' },
  current:     { type: Boolean, default: false },
  description: [{ type: String }],
}, { _id: false })

const educationSchema = new mongoose.Schema({
  degree:       { type: String, required: true },
  institution:  { type: String, required: true },
  company:      { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  startDate:    { type: String, required: true },
  endDate:      { type: String, default: 'Present' },
  grade:        { type: String, default: '' },
}, { _id: false })

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, default: '' },
  description: [{ type: String }],
  techStack:   [{ type: String }],
  liveUrl:     { type: String, default: '' },
  repoUrl:     { type: String, default: '' },
  startDate:   { type: String, default: '' },
  endDate:     { type: String, default: '' },
}, { _id: false })

const certificationSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  issuingBody:   { type: String, default: '' },
  issueDate:     { type: String, default: '' },
  expiryDate:    { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
}, { _id: false })

const resumeSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },

  // For PDF uploads - stores file metadata and extracted text
  uploadedPdf: {
    originalName:  { type: String, default: '' },
    size:          { type: Number, default: 0 },
    extractedText: { type: String, default: '' },
  },

  // Personal Info (required for builder resumes, optional for uploads)
  personalInfo: {
    fullName:  { type: String, default: '' },
    email:     { type: String, default: '' },
    phone:     { type: String, default: '' },
    location:  { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    github:    { type: String, default: '' },
    portfolio: { type: String, default: '' },
    summary:   { type: String, default: '' },
  },

  workExperience: [workExperienceSchema],
  education:      [educationSchema],
  skills: {
    technical: [{ type: String }],
    soft:      [{ type: String }],
    languages: [{ type: String }],
    tools:     [{ type: String }],
  },
  projects:       [projectSchema],
  certifications: [certificationSchema],

  atsScore:  { type: Number, default: null },
  atsAnalysis: {
    keywordScore:      { type: Number },
    formattingScore:   { type: Number },
    completenessScore: { type: Number },
    lengthScore:       { type: Number },
    matchedKeywords:   [{ type: String }],
    missingSections:   [{ type: String }],
    suggestions:       [{ type: String }],
    verdict:           { type: String },
  },
  isDefault: { type: Boolean, default: false },

}, { timestamps: true })

export default mongoose.model('Resume', resumeSchema)