import mongoose from 'mongoose'

const qaSchema = new mongoose.Schema({
  question:    { type: String, required: true },
  answer:      { type: String, default: '' },
  askedAt:     { type: Date, default: Date.now },
  answeredAt:  { type: Date },
}, { _id: false })

const interviewSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume:     { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  role:       { type: String, required: true },
  roundType:  { type: String, enum: ['technical', 'hr', 'mixed'], required: true },
  status:     { type: String, enum: ['setup', 'active', 'completed'], default: 'setup' },
  questions:  [qaSchema],
  totalScore: { type: Number, default: null },
  startedAt:  { type: Date },
  completedAt:{ type: Date },
}, { timestamps: true })

export default mongoose.model('Interview', interviewSchema)
