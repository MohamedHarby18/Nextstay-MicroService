import client from './client'

export const agentsApi = {
  getAll:        () => client.get('/agents').then(r => r.data),
  getActive:     () => client.get('/agents/active').then(r => r.data),
  getById:       (id) => client.get(`/agents/${id}`).then(r => r.data),
  register:      (data) => client.post('/agents/register', data).then(r => r.data),
  updateRole:    (id, newRole) => client.put(`/agents/${id}/role`, null, { params: { newRole } }).then(r => r.data),
  deactivate:    (id) => client.put(`/agents/${id}/deactivate`).then(r => r.data),
  exists:        (id) => client.get(`/agents/${id}/exists`).then(r => r.data),
}
