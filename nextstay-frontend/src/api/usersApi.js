import client from './client'

export const usersApi = {
  getById:    (id) => client.get(`/users/${id}`).then(r => r.data),
  getByEmail: (email) => client.get(`/users/email/${email}`).then(r => r.data),
  getAll:     () => client.get('/users').then(r => r.data),
  update:     (id, data) => client.put(`/users/${id}`, data).then(r => r.data),
  delete:     (id) => client.delete(`/users/${id}`).then(r => r.data),
  flag:       (id) => client.put(`/users/${id}/flag`).then(r => r.data),
  unflag:     (id) => client.put(`/users/${id}/unflag`).then(r => r.data),
  deactivate: (id) => client.put(`/users/${id}/deactivate`).then(r => r.data),
  reactivate: (id) => client.put(`/users/${id}/reactivate`).then(r => r.data),
  exists:     (id) => client.get(`/users/${id}/exists`).then(r => r.data),
  getRole:    (id) => client.get(`/users/${id}/role`).then(r => r.data),
}
