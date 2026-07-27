import { http } from './request'

export const homeApi = {
  getHomeFeed: (page = 1, pageSize = 20) => http.get('/home', { page, pageSize }),
  getBanners: (position?: string) => http.get('/home/banners', { position }),
  getRecommended: (limit = 6) => http.get('/home/recommended', { limit }),
  getNewsFeed: (page = 1, pageSize = 10) => http.get('/home/news-feed', { page, pageSize }),
  getHotSearches: () => http.get('/home/hot-searches'),
}
