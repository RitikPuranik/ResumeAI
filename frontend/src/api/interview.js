import client from './client';

export const interviewAPI = {
  startSession: async (data) => {
    console.log('Raw data received from form:', data);
    
    // Map frontend field names to backend expected names
    const payload = {
      role: data.jobRole,
      roundType: data.roundType,
      experienceLevel: data.experienceLevel,
      questionsCount: parseInt(data.questionsCount) || 10,
      resumeId: data.resumeId || null,
    };
    
    console.log('Sending payload to backend:', payload);
    
    try {
      const response = await client.post('/interviews/setup', payload);
      return response;
    } catch (error) {
      // Log the full error details
      console.error('Backend error response:', error.response?.data);
      console.error('Full error object:', error.response?.data?.errors);
      // If errors array exists, log each one
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err, i) => {
          console.error(`Error ${i + 1}:`, err);
        });
      }
      throw error;
    }
  },
  
  getSessions: async () => {
    const response = await client.get('/interviews/history');
    console.log('Raw interview response:', response.data);
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },
  
  getSession: (id) => client.get(`/interviews/${id}`),
  
  submitAnswer: (sessionId, data) =>
    client.patch(`/interviews/${sessionId}/answer`, data),
  
  endSession: (sessionId) =>
    client.patch(`/interviews/${sessionId}/complete`),
  
  getReport: (sessionId) =>
    client.get(`/interviews/${sessionId}/report`),
};