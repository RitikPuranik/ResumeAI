import client from './client';

export const resumeAPI = {
  getAll: async () => {
    const response = await client.get('/resumes');
    console.log('Raw resume response:', response.data);
    
    // Extract the array from response.data.data
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Fallback for other structures
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Check for resumes property
    if (response.data?.resumes && Array.isArray(response.data.resumes)) {
      return response.data.resumes;
    }
    
    // Always return an array
    return [];
  },
  
  getOne: (id) => client.get(`/resumes/${id}`),
  analyze: (id) => client.post(`/resumes/${id}/analyze`),
  delete: (id) => client.delete(`/resumes/${id}`),
  getAnalysis: (id) => client.get(`/resumes/${id}/analysis`),
  update: (id, data) => client.put(`/resumes/${id}`, data),
  download: (id) => client.get(`/resumes/${id}/download`, { responseType: 'blob' }),
  setDefault: (id) => client.patch(`/resumes/${id}/default`),
};