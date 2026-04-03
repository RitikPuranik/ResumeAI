import client from './client';

export const interviewAPI = {
  startSession: (data) => client.post('/interview/start', data),
  getSessions: () => client.get('/interview/sessions'),
  getSession: (id) => client.get(`/interview/sessions/${id}`),
  submitAnswer: (sessionId, data) =>
    client.post(`/interview/sessions/${sessionId}/answer`, data),
  endSession: (sessionId) =>
    client.post(`/interview/sessions/${sessionId}/end`),
  getReport: (sessionId) =>
    client.get(`/interview/sessions/${sessionId}/report`),
};
