import client from './client'

export const reviewsApi = {
  submit:      (data) => client.post('/reviews', data).then(r => r.data),
  delete:      (reviewId) => client.delete(`/reviews/${reviewId}`).then(r => r.data),
  getByListing:(listingId) => client.get(`/reviews/listing/${listingId}`).then(r => r.data),
  getByGuest:  (guestId) => client.get(`/reviews/guest/${guestId}`).then(r => r.data),
  flag:        (reviewId) => client.put(`/reviews/${reviewId}/flag`).then(r => r.data),
  addResponse:    (reviewId, data) => client.post(`/reviews/${reviewId}/response`, data).then(r => r.data),
  getResponse:    (reviewId) => client.get(`/reviews/${reviewId}/response`).then(r => r.data),
  deleteResponse: (reviewId) => client.delete(`/reviews/${reviewId}/response`).then(r => r.data),
}
