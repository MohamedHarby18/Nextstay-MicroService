import client from './client'

export const reservationsApi = {
  create:  (data) => client.post('/reservations', data).then(r => r.data),
  getById: (id) => client.get(`/reservations/${id}`).then(r => r.data),
  getMy:   () => client.get('/reservations/my').then(r => r.data),
  approve: (id) => client.put(`/reservations/${id}/approve`).then(r => r.data),
  decline: (id) => client.put(`/reservations/${id}/decline`).then(r => r.data),
  cancel:  (id) => client.put(`/reservations/${id}/cancel`).then(r => r.data),
}
