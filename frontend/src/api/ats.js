import client from './client';

export const atsAPI = {
  // Analyze a saved resume by ID
  analyzeById: (resumeId) =>
    client.post('/ats/analyze', { resumeId }),

  // Analyze an uploaded PDF file
  analyzeFile: (formData) =>
    client.post('/ats/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getHistory: () => client.get('/ats/history'),
};
