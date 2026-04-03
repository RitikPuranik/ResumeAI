import client from './client';

export const paymentAPI = {
  getPlans:      ()     => client.get('/subscription/plans'),
  getSubscription: ()   => client.get('/subscription/me'),
  getUsage:      ()     => client.get('/subscription/usage'),
  createOrder:   ()     => client.post('/subscription/create-order'),
  verifyPayment: (data) => client.post('/subscription/verify', data),
  cancel:        ()     => client.post('/subscription/cancel'),
};
