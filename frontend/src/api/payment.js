import client from './client';

export const paymentAPI = {
  getPlans: () => client.get('/payment/plans'),
  createOrder: (planId) => client.post('/payment/create-order', { planId }),
  verifyPayment: (data) => client.post('/payment/verify', data),
  getSubscription: () => client.get('/payment/subscription'),
};
