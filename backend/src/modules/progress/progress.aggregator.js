/**
 * Calculates overall job readiness from three weighted scores
 * ATS score    → 30% weight  (resume quality)
 * Interview avg → 50% weight  (most important signal)
 * Job match avg → 20% weight  (relevance to target roles)
 */
export const calculateReadiness = (atsScore, interviewAvg, matchAvg) => {
  if (!atsScore && !interviewAvg && !matchAvg) return 0
  const weighted = (atsScore * 0.3) + (interviewAvg * 0.5) + (matchAvg * 0.2)
  return Math.round(weighted)
}

export const getReadinessLevel = (score) => {
  if (score >= 80) return 'Job Ready'
  if (score >= 60) return 'Getting There'
  return 'Needs Work'
}
