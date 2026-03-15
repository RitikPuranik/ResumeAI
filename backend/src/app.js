import express from 'express'
import cors from 'cors'
import { errorMiddleware } from './shared/middlewares/error.middleware.js'

import authRoutes         from './modules/auth/auth.routes.js'
import userRoutes         from './modules/user/user.routes.js'
import resumeRoutes       from './modules/resume/resume.routes.js'
import atsRoutes          from './modules/ats/ats.routes.js'
import interviewRoutes    from './modules/interview/interview.routes.js'
import evaluationRoutes   from './modules/evaluation/evaluation.routes.js'
import speechRoutes       from './modules/speech/speech.routes.js'
import jobmatchRoutes     from './modules/jobmatch/jobmatch.routes.js'
import coverletterRoutes  from './modules/coverletter/coverletter.routes.js'
import progressRoutes     from './modules/progress/progress.routes.js'
import subscriptionRoutes from './modules/subscription/subscription.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth',         authRoutes)
app.use('/api/users',        userRoutes)
app.use('/api/resumes',      resumeRoutes)
app.use('/api/ats',          atsRoutes)
app.use('/api/interviews',   interviewRoutes)
app.use('/api/evaluation',   evaluationRoutes)
app.use('/api/speech',       speechRoutes)
app.use('/api/jobmatch',     jobmatchRoutes)
app.use('/api/coverletter',  coverletterRoutes)
app.use('/api/progress',     progressRoutes)
app.use('/api/subscription', subscriptionRoutes)

app.get('/', (req, res) => res.json({ message: 'CareerForge API running' }))

app.use(errorMiddleware)

export default app
