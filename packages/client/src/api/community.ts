import { http } from './request'

export const communityApi = {
  listPosts: (params?: any) => http.get('/community/posts', params),
  getPost: (id: string) => http.get(`/community/posts/${id}`),
  createPost: (data: any) => http.post('/community/posts', data),
  deletePost: (id: string) => http.delete(`/community/posts/${id}`),
  getComments: (postId: string, page = 1, pageSize = 20) =>
    http.get(`/community/posts/${postId}/comments`, { page, pageSize }),
  createComment: (postId: string, data: any) => http.post(`/community/posts/${postId}/comments`, data),
  toggleLike: (postId: string) => http.post(`/community/posts/${postId}/like`),
  hotTags: () => http.get('/community/posts/hot-tags'),
}
