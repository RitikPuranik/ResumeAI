import mongoose from 'mongoose'

const evaluationSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview', required: true },
  overallScore: { type: Number },
  breakdown: {
    technicalKnowledge:  { type: Number },
    communicationClarity:{ type: Number },
    answerCompleteness:  { type: Number },
    confidence:          { type: Number },
  },
  strengths:   [{ type: String }],
  weaknesses:  [{ type: String }],
  suggestions: [{ type: String }],
  perQuestion: [{ question: String, score: Number, feedback: String }],
}, { timestamps: true })

export default mongoose.model('Evaluation', evaluationSchema)
