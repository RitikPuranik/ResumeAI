/**
 * Speech module — fully browser-based, zero API keys needed
 *
 * Speech to Text  → Web Speech API (browser built-in, free)
 * Text to Speech  → Web Speech API (browser built-in, free)
 *
 * This backend service is a minimal fallback that just returns
 * the text back — actual TTS/STT happens on the frontend.
 */
import { ApiError } from '../../shared/utils/apiError.js'

export const textToSpeechService = async (text) => {
  if (!text) throw new ApiError(400, 'Text is required')
  // Actual speech synthesis happens in the browser via Web Speech API
  // This endpoint just validates and echoes the text back
  return { text, message: 'Use browser Web Speech API to synthesize' }
}
