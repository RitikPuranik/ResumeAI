import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { interviewAPI, evaluationAPI } from '../services/api'
import { Mic, MicOff, ChevronRight, CheckCircle2, Volume2, VolumeX } from 'lucide-react'
import ScoreRing from '../components/ui/ScoreRing'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import toast from 'react-hot-toast'

/**
 * Speech to Text  → browser Web Speech API  (free, no API key)
 * Text to Speech  → browser SpeechSynthesis  (free, no API key)
 */

// Browser TTS — speak text aloud
const speakText = (text) => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate  = 0.92
  utterance.pitch = 1
  utterance.lang  = 'en-US'
  window.speechSynthesis.speak(utterance)
}

const stopSpeaking = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

export default function InterviewRoomPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [interview,   setInterview]   = useState(null)
  const [eval_,       setEval]        = useState(null)
  const [qIndex,      setQIndex]      = useState(0)
  const [answer,      setAnswer]      = useState('')
  const [recording,   setRecording]   = useState(false)
  const [isSpeaking,  setIsSpeaking]  = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [evaluating,  setEvaluating]  = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    interviewAPI.getOne(id).then(r => {
      const iv = r.data.data
      setInterview(iv)
      const first = iv.questions.findIndex(q => !q.answer)
      setQIndex(first === -1 ? iv.questions.length - 1 : first)
      if (iv.status === 'completed') {
        evaluationAPI.get(id).then(e => setEval(e.data.data)).catch(() => {})
      }
    }).finally(() => setLoading(false))

    // Cleanup speech on unmount
    return () => {
      stopSpeaking()
      recognitionRef.current?.stop()
    }
  }, [id])

  // Browser Speech to Text
  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser — type your answer instead')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous     = true
    recognition.interimResults = true
    recognition.lang           = 'en-US'

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('')
      setAnswer(transcript)
    }

    recognition.onerror = (e) => {
      if (e.error !== 'aborted') toast.error('Mic error: ' + e.error)
      setRecording(false)
    }

    recognition.onend = () => setRecording(false)

    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setRecording(false)
  }

  // Browser Text to Speech
  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
      return
    }
    setIsSpeaking(true)
    speakText(text)
    // Estimate duration then reset icon
    const duration = Math.max(2000, text.length * 60)
    setTimeout(() => setIsSpeaking(false), duration)
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please provide an answer')
    setSubmitting(true)
    stopSpeaking()
    try {
      await interviewAPI.answer(id, { questionIndex: qIndex, answer })
      const updated = await interviewAPI.getOne(id)
      setInterview(updated.data.data)
      setAnswer('')

      if (qIndex + 1 < interview.questions.length) {
        setQIndex(qIndex + 1)
      } else {
        await interviewAPI.complete(id)
        toast.success('Interview complete! Generating feedback…')
        setEvaluating(true)
        const ev = await evaluationAPI.evaluate(id)
        setEval(ev.data.data)
        setEvaluating(false)
        const refreshed = await interviewAPI.getOne(id)
        setInterview(refreshed.data.data)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>
  if (!interview) return null

  const completed = interview.status === 'completed'
  const q = interview.questions[qIndex]

  // Evaluation report
  if (completed && eval_) return (
    <div className="stagger max-w-2xl">
      <div className="page-header">
        <Badge variant="green" className="mb-2"><CheckCircle2 size={10} /> Completed</Badge>
        <h1 className="section-title text-3xl mt-2">Interview Feedback</h1>
        <p className="text-dark-200/50 text-sm">{interview.role} — {interview.roundType} round</p>
      </div>

      <div className="card flex items-center gap-8 mb-6 glow-green">
        <ScoreRing score={eval_.overallScore} size={110} label="Overall" />
        <div className="grid grid-cols-2 gap-4 flex-1">
          {Object.entries(eval_.breakdown || {}).map(([key, val]) => (
            <div key={key}>
              <p className="text-xs text-dark-200/50 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(val / 10) * 100}%` }} />
                </div>
                <span className="font-mono text-xs text-white">{val}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card">
          <h3 className="font-display font-semibold text-brand-400 text-sm mb-3">Strengths</h3>
          <ul className="space-y-2">{eval_.strengths?.map((s, i) => (
            <li key={i} className="text-sm text-dark-200/70 flex gap-2"><span className="text-brand-400 mt-0.5">+</span>{s}</li>
          ))}</ul>
        </div>
        <div className="card">
          <h3 className="font-display font-semibold text-red-400 text-sm mb-3">Areas to Improve</h3>
          <ul className="space-y-2">{eval_.weaknesses?.map((s, i) => (
            <li key={i} className="text-sm text-dark-200/70 flex gap-2"><span className="text-red-400 mt-0.5">−</span>{s}</li>
          ))}</ul>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-display font-semibold text-white mb-3">Suggestions</h3>
        <ul className="space-y-2">{eval_.suggestions?.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-dark-200/70">
            <span className="w-5 h-5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs flex items-center justify-center shrink-0">{i + 1}</span>
            {s}
          </li>
        ))}</ul>
      </div>

      <div className="card mb-6">
        <h3 className="font-display font-semibold text-white mb-3">Per Question Breakdown</h3>
        <div className="space-y-3">
          {eval_.perQuestion?.map((pq, i) => (
            <div key={i} className="border-l-2 border-dark-200/20 pl-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-dark-200/50">Q{i + 1}: {pq.question}</p>
                <span className="font-mono text-xs text-brand-400 shrink-0 ml-2">{pq.score}/10</span>
              </div>
              <p className="text-sm text-dark-200/70">{pq.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigate('/interviews')} className="btn-secondary">← Back to Interviews</button>
    </div>
  )

  // Evaluating state
  if (evaluating) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Spinner size={40} />
      <p className="font-display text-white text-lg">Generating your feedback…</p>
      <p className="text-dark-200/50 text-sm">This takes about 10 seconds</p>
    </div>
  )

  // Active interview room
  return (
    <div className="stagger max-w-2xl">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="yellow"><Mic size={10} /> Live Interview</Badge>
          <span className="text-xs text-dark-200/50">{interview.role} — {interview.roundType}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-200/50">Question</span>
          <span className="font-mono text-brand-400 font-semibold">{qIndex + 1}</span>
          <span className="text-sm text-dark-200/50">of {interview.questions.length}</span>
        </div>
        <div className="h-1 bg-dark-800 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${(qIndex / interview.questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="card mb-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-white text-lg font-medium leading-relaxed">{q?.question}</p>
          <button onClick={() => handleSpeak(q?.question)}
            title={isSpeaking ? 'Stop speaking' : 'Read question aloud'}
            className={`shrink-0 p-2 rounded-lg transition-colors ${
              isSpeaking
                ? 'bg-brand-500/20 text-brand-400'
                : 'bg-dark-800 hover:bg-brand-500/10 text-dark-200/50 hover:text-brand-400'
            }`}>
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Answer area */}
      <div className="card mb-4">
        <label className="label">Your Answer</label>
        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          rows={6}
          placeholder="Type your answer here, or click the mic to speak…"
          className="input resize-none mb-4"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              recording
                ? 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse-slow'
                : 'btn-secondary'
            }`}>
            {recording
              ? <><MicOff size={15} /> Stop Recording</>
              : <><Mic size={15} /> Record Answer</>}
          </button>

          <button
            onClick={submitAnswer}
            disabled={submitting || !answer.trim()}
            className="btn-primary flex items-center gap-2 ml-auto">
            {submitting ? <Spinner size={15} /> : <ChevronRight size={15} />}
            {qIndex + 1 === interview.questions.length ? 'Submit & Finish' : 'Next Question'}
          </button>
        </div>

        {/* Browser support note */}
        {!window.SpeechRecognition && !window.webkitSpeechRecognition && (
          <p className="text-xs text-yellow-400/60 mt-3">
            ⚠ Voice recording not supported in this browser. Please type your answers or use Chrome.
          </p>
        )}
      </div>

      {/* Previous answers */}
      {interview.questions.some((q, i) => q.answer && i < qIndex) && (
        <div className="card">
          <h3 className="font-display font-semibold text-white text-sm mb-3">Previous Answers</h3>
          <div className="space-y-3">
            {interview.questions.filter((q, i) => q.answer && i < qIndex).map((q, i) => (
              <div key={i} className="border-l-2 border-dark-200/20 pl-3">
                <p className="text-xs text-dark-200/50 mb-1">Q{i + 1}: {q.question}</p>
                <p className="text-sm text-dark-200/70">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
