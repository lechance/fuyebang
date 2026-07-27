import { http } from './request'

export const hustleApi = {
  list: (params?: any) => http.get('/hustles', params),
  getBySlug: (slug: string) => http.get(`/hustles/${slug}`),
  hot: (limit = 10) => http.get('/hustles/hot', { limit }),
  featured: (limit = 6) => http.get('/hustles/featured', { limit }),
}
