import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ResumesPage from './pages/ResumesPage'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import AtsCheckerPage from './pages/AtsCheckerPage'
import InterviewsPage from './pages/InterviewsPage'
import InterviewRoomPage from './pages/InterviewRoomPage'
import JobMatchPage from './pages/JobMatchPage'
import CoverLetterPage from './pages/CoverLetterPage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'
import PricingPage from './pages/PricingPage'

const Protected = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route index                    element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"         element={<DashboardPage />} />
        <Route path="resumes"           element={<ResumesPage />} />
        <Route path="resumes/new"       element={<ResumeBuilderPage />} />
        <Route path="resumes/:id/edit"  element={<ResumeBuilderPage />} />
        <Route path="ats"               element={<AtsCheckerPage />} />
        <Route path="interviews"        element={<InterviewsPage />} />
        <Route path="interviews/:id"    element={<InterviewRoomPage />} />
        <Route path="job-match"         element={<JobMatchPage />} />
        <Route path="cover-letter"      element={<CoverLetterPage />} />
        <Route path="progress"          element={<ProgressPage />} />
        <Route path="profile"           element={<ProfilePage />} />
        <Route path="pricing"           element={<PricingPage />} />
      </Route>
    </Routes>
  )
}
