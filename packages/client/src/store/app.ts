import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const systemInfo = ref<any>(null)

  function initSystemInfo() {
    uni.getSystemInfo({
      success: (res) => {
        systemInfo.value = res
      },
    })
  }

  return { systemInfo, initSystemInfo }
})
