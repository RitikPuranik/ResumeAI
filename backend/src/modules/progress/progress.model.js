import mongoose from 'mongoose'

// Progress is computed dynamically - this model stores snapshots for trend tracking
const progressSnapshotSchema = new mongoose.Schema({
  user:                { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  overallReadiness:    { type: Number },
  readinessLevel:      { type: String },
  atsScoreSnapshot:    { type: Number },
  interviewScoreSnapshot: { type: Number },
  matchScoreSnapshot:  { type: Number },
}, { timestamps: true })

export default mongoose.model('ProgressSnapshot', progressSnapshotSchema)
