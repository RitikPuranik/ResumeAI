import client from './client';

export const progressAPI = {
  getDashboard: () => client.get('/progress/dashboard'),
  getHistory:   () => client.get('/progress/history'),
};