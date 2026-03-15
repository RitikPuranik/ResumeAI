import Evaluation from './evaluation.model.js'
import Interview from '../interview/interview.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { buildEvaluationPrompt } from './evaluation.prompts.js'
import { geminiGenerateJSON } from '../../config/gemini.js'

export const evaluateInterviewService = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId, status: 'completed' })
  if (!interview) throw new ApiError(404, 'Completed interview not found')

  const existing = await Evaluation.findOne({ interview: interviewId })
  if (existing) return existing

  const data = await geminiGenerateJSON(buildEvaluationPrompt(interview))

  const evaluation = await Evaluation.create({
    user: userId,
    interview: interviewId,
    ...data,
  })

  await Interview.findByIdAndUpdate(interviewId, { totalScore: data.overallScore })

  return evaluation
}

export const getEvaluationService = async (interviewId, userId) => {
  const evaluation = await Evaluation.findOne({ interview: interviewId, user: userId })
  if (!evaluation) throw new ApiError(404, 'Evaluation not found')
  return evaluation
}
