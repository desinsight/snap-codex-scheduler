import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Response, Request, Headers, fetch } from 'undici'
import { TextEncoder, TextDecoder } from 'util'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true
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
    host: true,
    port: 5186,
    open: true,
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost',
      port: 5186,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  preview: {
    port: 5186,
    strictPort: true,
  },
})

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

Object.assign(global, { Response, Request, Headers, fetch })




