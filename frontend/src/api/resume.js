import client from './client';

export const resumeAPI = {
  upload: (formData) =>
    client.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => client.get('/resume'),
  getOne: (id) => client.get(`/resume/${id}`),
  analyze: (id) => client.post(`/resume/${id}/analyze`),
  delete: (id) => client.delete(`/resume/${id}`),
  getAnalysis: (id) => client.get(`/resume/${id}/analysis`),
};
