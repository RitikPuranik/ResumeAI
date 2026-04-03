import pdfParse from 'pdf-parse'
import AtsResult from './ats.model.js'
import Resume from '../resume/resume.model.js'
import { ApiError } from '../../shared/utils/apiError.js'
import { atsAnalysisPrompt } from './ats.analyzer.js'
import { groqGenerateJSON } from '../../config/groq.js'

export const analyzeResumeService = async (userId, resumeId, file) => {
  let resumeText = ''

  if (file) {
    const parsed = await pdfParse(file.buffer)
    resumeText = parsed.text || ''
  } else if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, user: userId })
    if (!resume) throw new ApiError(404, 'Resume not found')
    if (resume.uploadedPdf?.extractedText) {
      resumeText = resume.uploadedPdf.extractedText
    } else {
      const r = resume.toObject()
      resumeText = JSON.stringify(r)
    }
  } else {
    throw new ApiError(400, 'Provide a resume file or resumeId')
  }

  if (!resumeText.trim()) throw new ApiError(400, 'Could not extract text from the resume')

  const data = await groqGenerateJSON(atsAnalysisPrompt(resumeText))

  const result = await AtsResult.create({
    user:   userId,
    resume: resumeId || null,
    score:  data.score,
    analysis: {
      keywordScore:      data.keywordScore,
      formattingScore:   data.formattingScore,
      completenessScore: data.completenessScore,
      lengthScore:       data.lengthScore,
      matchedKeywords:   data.matchedKeywords || [],
      missingSections:   data.missingSections || [],
      suggestions:       data.suggestions || [],
      verdict:           data.verdict || '',
    },
  })

  if (resumeId) {
    // Store ATS analysis on the resume itself for quick access
    await Resume.findByIdAndUpdate(resumeId, {
      atsScore: data.score,
      atsAnalysis: {
        keywordScore:      data.keywordScore,
        formattingScore:   data.formattingScore,
        completenessScore: data.completenessScore,
        lengthScore:       data.lengthScore,
        matchedKeywords:   data.matchedKeywords || [],
        missingSections:   data.missingSections || [],
        suggestions:       data.suggestions || [],
        verdict:           data.verdict || '',
      },
    })
  }

  return result
}

export const getAtsHistoryService = async (userId) => {
  return await AtsResult.find({ user: userId }).sort({ createdAt: -1 })
}
