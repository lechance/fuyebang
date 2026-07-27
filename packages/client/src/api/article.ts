import { http } from './request'

export const articleApi = {
  list: (params?: any) => http.get('/articles', params),
  getById: (id: string) => http.get(`/articles/${id}`),
  featured: (limit = 5) => http.get('/articles/featured', { limit }),
  related: (articleId: string, limit = 4) => http.get('/articles/related', { articleId, limit }),
}
