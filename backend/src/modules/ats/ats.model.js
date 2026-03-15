import mongoose from 'mongoose'

const atsSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  score:  { type: Number, required: true },
  analysis: {
    keywordScore:    { type: Number },
    formattingScore: { type: Number },
    completenessScore: { type: Number },
    lengthScore:     { type: Number },
    matchedKeywords: [{ type: String }],
    missingSections: [{ type: String }],
    suggestions:     [{ type: String }],
    verdict:         { type: String },
  },
}, { timestamps: true })

export default mongoose.model('AtsResult', atsSchema)
