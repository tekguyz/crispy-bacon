
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
    'process.env.VITE_APP_VERSION': JSON.stringify('2.5.1'),
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
            // Group Core UI & Framework logic together to prevent circular loops
            if (
              id.includes('react') || 
              id.includes('scheduler') || 
              id.includes('prop-types') ||
              id.includes('@tanstack/react-query') ||
              id.includes('lucide-react')
            ) {
              return 'vendor-framework';
            }
            
            // Group Markdown & Content Processing (Heavy but self-contained)
            if (
              id.includes('react-markdown') || 
              id.includes('remark') || 
              id.includes('micromark') || 
              id.includes('vfile') || 
              id.includes('unist-util') || 
              id.includes('mdast-util') || 
              id.includes('hast-util') || 
              id.includes('unified') ||
              id.includes('mammoth')
            ) {
              return 'vendor-content';
            }
            
            // AI Engine
            if (id.includes('@google/genai')) {
              return 'vendor-genai';
            }
            
            // Database & Backend Bridge
            if (id.includes('@supabase') || id.includes('stripe')) {
              return 'vendor-infra';
            }
            
            // Note: We avoid a catch-all 'vendor-others' chunk here.
            // Rollup is more efficient at resolving circularities when 
            // miscellaneous small packages are allowed to stay in the entry 
            // or be grouped dynamically based on their usage.
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
