import client from './client';

export const interviewAPI = {
  // Setup + auto-start a session
  startSession: async (data) => {
    const payload = {
      role:      data.jobRole,
      roundType: data.roundType,
      resumeId:  data.resumeId || null,
    };
    return client.post('/interviews/setup', payload);
  },

  // Get all sessions (returns array directly)
  getSessions: async () => {
    const res = await client.get('/interviews/history');
    const data = res.data?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(res.data)) return res.data;
    return [];
  },

  getSession:   (id)           => client.get(`/interviews/${id}`),
  submitAnswer: (id, data)     => client.patch(`/interviews/${id}/answer`, data),
  endSession:   (id)           => client.patch(`/interviews/${id}/complete`),
  getReport:    (id)           => client.get(`/interviews/${id}/report`),
  evaluate:     (interviewId)  => client.post(`/evaluation/evaluate/${interviewId}`),
  getEvaluation:(interviewId)  => client.get(`/evaluation/${interviewId}`),
};