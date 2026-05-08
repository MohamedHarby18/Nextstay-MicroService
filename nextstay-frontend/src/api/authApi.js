import client from './client'

export const authApi = {
  login:    (data) => client.post('/auth/login', data).then(r => r.data),
  register: (data) => client.post('/auth/register', data).then(r => r.data),
  verify:   (userId) => client.post(`/auth/verify/${userId}`).then(r => r.data),
  agentLogin:    (data) => client.post('/agents/login', data).then(r => r.data),
  agentRegister: (data) => client.post('/agents/register', data).then(r => r.data),
}
