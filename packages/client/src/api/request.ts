import { useUserStore } from '@/store/user'

const BASE_URL = 'http://localhost:3000/v1'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  params?: Record<string, any>
  isAdmin?: boolean
}

class HttpClient {
  private baseUrl = BASE_URL

  async request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', data, params } = options
    const userStore = useUserStore()

    return new Promise((resolve, reject) => {
      const header: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      const token = userStore.token
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }

      // Build query string
      let fullUrl = `${this.baseUrl}${url}`
      if (params) {
        const query = Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join('&')
        if (query) fullUrl += `?${query}`
      }

      uni.request({
        url: fullUrl,
        method,
        data,
        header,
        success: (res) => {
          const responseData = res.data as any
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(responseData)
          } else if (res.statusCode === 401) {
            userStore.logout()
            uni.navigateTo({ url: '/pages/subpkg-user/login' })
            reject(responseData)
          } else {
            reject(responseData)
          }
        },
        fail: (err) => {
          uni.showToast({ title: '网络请求失败', icon: 'none' })
          reject(err)
        },
      })
    })
  }

  get<T = any>(url: string, params?: Record<string, any>) {
    return this.request<T>(url, { method: 'GET', params })
  }

  post<T = any>(url: string, data?: any) {
    return this.request<T>(url, { method: 'POST', data })
  }

  put<T = any>(url: string, data?: any) {
    return this.request<T>(url, { method: 'PUT', data })
  }

  delete<T = any>(url: string) {
    return this.request<T>(url, { method: 'DELETE' })
  }
}

export const http = new HttpClient()
