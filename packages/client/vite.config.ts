import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  server: {
    host: '0.0.0.0',
    port: 9000,
    proxy: {
      '/v1': {
        target: 'http://10.20.8.199:3000',
        changeOrigin: true,
      },
    },
  },
})
