import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'recharts-vendor': ['recharts'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://collin-humpless-patria.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true')
          })
        },
      },
    },
  }
})