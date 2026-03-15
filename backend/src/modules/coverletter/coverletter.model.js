import mongoose from 'mongoose'

const coverLetterSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume:      { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  jobTitle:    { type: String, required: true },
  company:     { type: String, default: '' },   // OPTIONAL - user may not know company name
  jobDescription: { type: String, default: '' },
  tone:        { type: String, enum: ['professional', 'friendly', 'confident'], default: 'professional' },
  content:     { type: String, required: true },
  wordCount:   { type: Number },
}, { timestamps: true })

export default mongoose.model('CoverLetter', coverLetterSchema)
