import Interview from './interview.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { generateQuestions } from './interview.questions.js'

export const setupInterviewService = async (userId, { role, roundType, resumeId }) => {
  if (!role || !roundType) throw new ApiError(400, 'Role and roundType are required')
  const questions = await generateQuestions(role, roundType)
  return await Interview.create({
    user: userId,
    resume: resumeId || null,
    role,
    roundType,
    questions: questions.map(q => ({ question: q })),
    status: 'setup',
  })
}

export const startInterviewService = async (interviewId, userId) => {
  const interview = await Interview.findOneAndUpdate(
    { _id: interviewId, user: userId, status: 'setup' },
    { status: 'active', startedAt: new Date() },
    { new: true }
  )
  if (!interview) throw new ApiError(404, 'Interview not found or already started')
  return interview
}

export const submitAnswerService = async (interviewId, userId, { questionIndex, answer }) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId, status: 'active' })
  if (!interview) throw new ApiError(404, 'Active interview not found')
  interview.questions[questionIndex].answer = answer
  interview.questions[questionIndex].answeredAt = new Date()
  await interview.save()
  return interview
}

export const completeInterviewService = async (interviewId, userId) => {
  const interview = await Interview.findOneAndUpdate(
    { _id: interviewId, user: userId, status: 'active' },
    { status: 'completed', completedAt: new Date() },
    { new: true }
  )
  if (!interview) throw new ApiError(404, 'Interview not found')
  return interview
}

export const getInterviewHistoryService = async (userId) => {
  return await Interview.find({ user: userId })
    .select('role roundType status totalScore createdAt completedAt')
    .sort({ createdAt: -1 })
}

export const getInterviewService = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId })
  if (!interview) throw new ApiError(404, 'Interview not found')
  return interview
}
