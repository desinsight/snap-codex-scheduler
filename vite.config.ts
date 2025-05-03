import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Response, Request, Headers, fetch } from 'undici'
import { TextEncoder, TextDecoder } from 'util'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/snap-codex-scheduler/' : '/',
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production'
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react', 'framer-motion'],
          calendar: ['@fullcalendar/core', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/interaction']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['styled-components'],
    esbuildOptions: {
      target: 'esnext',
      platform: 'browser',
      supported: { 'top-level-await': true },
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx'
      }
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },
  preview: {
    port: 5186,
    strictPort: true,
  },
})

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

Object.assign(global, { Response, Request, Headers, fetch })




