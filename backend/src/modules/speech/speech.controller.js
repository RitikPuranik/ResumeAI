import { asyncHandler } from '../../shared/utils/asyncHandler.js'
import { ApiResponse } from '../../shared/utils/apiResponse.js'
import { textToSpeechService } from './speech.service.js'

export const textToSpeech = asyncHandler(async (req, res) => {
  const result = await textToSpeechService(req.body.text)
  res.status(200).json(new ApiResponse(200, result, 'TTS ready'))
})
