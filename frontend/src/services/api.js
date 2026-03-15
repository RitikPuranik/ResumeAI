import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    toast.error(msg)
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
}
export const userAPI = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}
export const resumeAPI = {
  create:     (data)     => api.post('/resumes', data),
  getAll:     ()         => api.get('/resumes'),
  getOne:     (id)       => api.get(`/resumes/${id}`),
  update:     (id, data) => api.put(`/resumes/${id}`, data),
  delete:     (id)       => api.delete(`/resumes/${id}`),
  download:   (id)       => api.get(`/resumes/${id}/download`, { responseType: 'blob' }),
  setDefault: (id)       => api.patch(`/resumes/${id}/default`),
}
export const atsAPI = {
  analyze: (data) => api.post('/ats/analyze', data),
  history: ()     => api.get('/ats/history'),
}
export const interviewAPI = {
  setup:    (data)     => api.post('/interviews/setup', data),
  start:    (id)       => api.patch(`/interviews/${id}/start`),
  answer:   (id, data) => api.patch(`/interviews/${id}/answer`, data),
  complete: (id)       => api.patch(`/interviews/${id}/complete`),
  history:  ()         => api.get('/interviews/history'),
  getOne:   (id)       => api.get(`/interviews/${id}`),
}
export const evaluationAPI = {
  evaluate: (id) => api.post(`/evaluation/evaluate/${id}`),
  get:      (id) => api.get(`/evaluation/${id}`),
}
export const jobmatchAPI = {
  analyze: (data) => api.post('/jobmatch/analyze', data),
  history: ()     => api.get('/jobmatch/history'),
}
export const coverletterAPI = {
  generate: (data) => api.post('/coverletter/generate', data),
  getAll:   ()     => api.get('/coverletter'),
  getOne:   (id)   => api.get(`/coverletter/${id}`),
  delete:   (id)   => api.delete(`/coverletter/${id}`),
}
export const progressAPI = {
  dashboard: () => api.get('/progress/dashboard'),
  history:   () => api.get('/progress/history'),
}
export const subscriptionAPI = {
  getPlans:          ()     => api.get('/subscription/plans'),
  getMySubscription: ()     => api.get('/subscription/me'),
  getUsage:          ()     => api.get('/subscription/usage'),
  createOrder:       ()     => api.post('/subscription/create-order'),
  verifyPayment:     (data) => api.post('/subscription/verify', data),
  cancelSubscription:()     => api.post('/subscription/cancel'),
}

export default api
