import client from './client';

export const jobmatchAPI = {
  analyze:    (data) => client.post('/jobmatch/analyze', data),
  getHistory: ()     => client.get('/jobmatch/history'),
};


