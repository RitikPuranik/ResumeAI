import mongoose from 'mongoose'

const jobmatchSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume:         { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  jobDescription: { type: String, required: true },
  matchScore:     { type: Number, required: true },
  matchedKeywords:  [{ type: String }],
  missingKeywords:  [{ type: String }],
  suggestions:      [{ type: String }],
  verdict:        { type: String },
}, { timestamps: true })

export default mongoose.model('JobMatch', jobmatchSchema)
