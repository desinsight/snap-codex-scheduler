import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Response, Request, Headers, fetch } from 'undici'
import { TextEncoder, TextDecoder } from 'util'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  base: process.env.NODE_ENV === 'production' ? '/snap-codex-scheduler/' : '/',
  define: {
    __API__: JSON.stringify(process.env.VITE_API ?? 'https://api.example.com'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react', 'framer-motion'],
          calendar: ['@fullcalendar/core', '@fullcalendar/daygrid', '@fullcalendar/timegrid', '@fullcalendar/interaction'],
          state: ['@reduxjs/toolkit', 'react-redux'],
          utils: ['date-fns', 'lodash', 'rxjs']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: true,
    copyPublicDir: true
  },
  optimizeDeps: {
    include: ['styled-components'],
    exclude: ['@tensorflow/tfjs'],
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




