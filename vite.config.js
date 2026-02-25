import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      '/api/leetcode': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/cf': {
        target: 'https://us-central1-algorithm-visualizer-b963c.cloudfunctions.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/cf/, ''),
      },
    },
  },
})
