import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/v1': { target: 'http://10.20.8.199:3000', changeOrigin: true },
      '/admin': { target: 'http://10.20.8.199:3000', changeOrigin: true },
    },
  },
})
