import { http } from './request'

export const scamApi = {
  list: (params?: any) => http.get('/scams', params),
  getById: (id: string) => http.get(`/scams/${id}`),
  create: (data: any) => http.post('/scams', data),
  stats: () => http.get('/scams/stats'),
  tips: () => http.get('/scams/prevention-tips'),
}
