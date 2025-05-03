import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Response, Request, Headers, fetch } from 'undici'
import { TextEncoder, TextDecoder } from 'util'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/snap-codex-scheduler/',
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
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




