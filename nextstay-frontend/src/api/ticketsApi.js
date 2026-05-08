import client from './client'

export const ticketsApi = {
  create:          (data) => client.post('/tickets', data).then(r => r.data),
  getMy:           () => client.get('/tickets/my').then(r => r.data),
  getMessages:     (ticketId) => client.get(`/tickets/${ticketId}/messages`).then(r => r.data),
  reply:           (ticketId, messageText) => client.post(`/tickets/${ticketId}/messages`, { messageText }).then(r => r.data),
  assign:          (ticketId, agentId) => client.put(`/tickets/${ticketId}/assign/${agentId}`).then(r => r.data),
  unassign:        (ticketId) => client.put(`/tickets/${ticketId}/unassign`).then(r => r.data),
  updateStatus:    (ticketId, status) => client.put(`/tickets/${ticketId}/status`, null, { params: { status } }).then(r => r.data),
  getDashboard:    (status) => client.get('/tickets/dashboard', { params: status ? { status } : {} }).then(r => r.data),
  flagAction:      (ticketId, actionType) => client.put(`/tickets/${ticketId}/flag-action`, null, { params: { actionType } }).then(r => r.data),
  getActionNeeded: (actionType) => client.get('/tickets/action-needed', { params: actionType ? { actionType } : {} }).then(r => r.data),
  getAgentStats:   (agentId) => client.get(`/tickets/agent/${agentId}/stats`).then(r => r.data),
  getOverallStats: () => client.get('/tickets/stats/overall').then(r => r.data),
}
