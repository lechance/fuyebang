import { http } from './request'

export const userApi = {
  login: (code: string) => http.post('/auth/login', { code }),
  getSession: () => http.get('/auth/session'),
  getProfile: () => http.get('/users/profile'),
  updateProfile: (data: any) => http.put('/users/profile', data),
  getFavorites: (type?: string) => http.get('/users/favorites', { type }),
  addFavorite: (entityType: string, entityId: string) => http.post(`/users/favorites/${entityType}/${entityId}`),
  removeFavorite: (entityType: string, entityId: string) => http.delete(`/users/favorites/${entityType}/${entityId}`),
  getHistory: (entityType?: string) => http.get('/users/history', { entityType }),
  clearHistory: () => http.delete('/users/history'),
  getNotifications: () => http.get('/notifications'),
  getUnreadCount: () => http.get('/notifications/unread-count'),
  markNotificationRead: (id: string) => http.put(`/notifications/${id}/read`),
  markAllNotificationsRead: () => http.put('/notifications/read-all'),
  submitFeedback: (data: any) => http.post('/feedback', data),
}
