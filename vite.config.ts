import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const env = typeof process !== 'undefined' ? process.env : {};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  define: {
    'process.env.VITE_APP_VERSION': JSON.stringify('2.6.0'),
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development'),
    'process.env.API_KEY': JSON.stringify(env.API_KEY),
  },
  server: {
    hmr: { overlay: false },
    watch: { usePolling: true },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core UI Library
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-core';
            }
            // State & Logic
            if (id.includes('zustand') || id.includes('lucide-react') || id.includes('@tanstack/react-query')) {
              return 'vendor-ui-logic';
            }
            // Heavy Processing (Deferred)
            if (id.includes('mammoth') || id.includes('react-markdown')) {
              return 'vendor-ingestion';
            }
            // AI Infrastructure (Critical Split)
            if (id.includes('@google/genai')) {
              return 'vendor-ai-engine';
            }
            // Database & Backend
            if (id.includes('@supabase') || id.includes('uuid')) {
              return 'vendor-infra';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 800,
  }
})