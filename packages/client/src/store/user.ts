import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<any>(null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'ADMIN' || userInfo.value?.role === 'SUPER_ADMIN')

  function setToken(newToken: string) {
    token.value = newToken
    uni.setStorageSync('token', newToken)
  }

  function setUser(info: any) {
    userInfo.value = info
    uni.setStorageSync('userInfo', JSON.stringify(info))
  }

  function login(authResult: { token: string; user: any }) {
    setToken(authResult.token)
    setUser(authResult.user)
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  // Initialize from storage
  function init() {
    const savedToken = uni.getStorageSync('token')
    const savedUser = uni.getStorageSync('userInfo')
    if (savedToken) token.value = savedToken
    if (savedUser) userInfo.value = JSON.parse(savedUser)
  }

  return { token, userInfo, isLoggedIn, isAdmin, setToken, setUser, login, logout, init }
})
