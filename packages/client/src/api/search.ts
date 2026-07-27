import { http } from './request'

export const searchApi = {
  search: (keyword: string, type = 'all', page = 1) => http.get('/search', { keyword, type, page }),
  suggest: (keyword: string) => http.get('/search/suggest', { keyword }),
}
