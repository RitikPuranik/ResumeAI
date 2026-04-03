import client from './client';

export const coverletterAPI = {
  generate:   (data) => client.post('/coverletter/generate', data),
  getAll:     ()     => client.get('/coverletter'),
  getOne:     (id)   => client.get(`/coverletter/${id}`),
  delete:     (id)   => client.delete(`/coverletter/${id}`),
};