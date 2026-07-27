import { http } from './request'

export const reviewApi = {
  list: (params?: any) => http.get('/reviews', params),
  getBySlug: (slug: string) => http.get(`/reviews/${slug}`),
  getSteps: (slug: string) => http.get(`/reviews/${slug}/steps`),
  ranking: (dimension: string, limit = 20) => http.get('/reviews/ranking', { dimension, limit }),
  featured: (page = 1, pageSize = 10) => http.get('/reviews/featured', { page, pageSize }),
  vote: (slug: string, vote: boolean) => http.post(`/reviews/${slug}/vote`, { vote }),
  getUserReviews: (slug: string, page = 1, pageSize = 20) =>
    http.get(`/reviews/${slug}/user-reviews`, { page, pageSize }),
  submitUserReview: (slug: string, data: any) => http.post(`/reviews/${slug}/user-reviews`, data),
}
