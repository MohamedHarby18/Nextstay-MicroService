import client from './client'

export const listingsApi = {
  getAll:     () => client.get('/listings').then(r => r.data),
  getById:    (id) => client.get(`/listings/${id}`).then(r => r.data),
  search:     (params) => client.get('/listings/search', { params }).then(r => r.data),
  getByHost:  (hostId) => client.get(`/listings/host/${hostId}`).then(r => r.data),
  create:     (data) => client.post('/listings', data).then(r => r.data),
  update:     (id, data) => client.put(`/listings/${id}`, data).then(r => r.data),
  delete:     (id) => client.delete(`/listings/${id}`).then(r => r.data),
  verify:     (id, action) => client.put(`/listings/${id}/verify`, action).then(r => r.data),

  getAvailability:   (listingId) => client.get(`/listings/${listingId}/availability`).then(r => r.data),
  checkAvailability: (listingId, checkIn, checkOut) =>
    client.get(`/listings/${listingId}/availability/check`, { params: { checkIn, checkOut } }).then(r => r.data),
  manageAvailability: (listingId, data) =>
    client.post(`/listings/${listingId}/availability/manage`, data).then(r => r.data),

  addAmenity:    (listingId, data) => client.post(`/listings/${listingId}/amenities`, data).then(r => r.data),
  removeAmenity: (listingId, amenityId) => client.delete(`/listings/${listingId}/amenities/${amenityId}`).then(r => r.data),
  getAmenities:  (listingId) => client.get(`/listings/${listingId}/amenities`).then(r => r.data),
}
