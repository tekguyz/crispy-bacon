
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
    'process.env.VITE_APP_VERSION': JSON.stringify('2.5.0'),
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
            // Group React core together
            if (id.includes('react') || id.includes('scheduler') || id.includes('prop-types')) {
              return 'vendor-react';
            }
            
            // Group Markdown ecosystem - include all known related packages to avoid circular chunks
            if (
              id.includes('react-markdown') || 
              id.includes('remark') || 
              id.includes('micromark') || 
              id.includes('vfile') || 
              id.includes('unist-util') || 
              id.includes('mdast-util') || 
              id.includes('hast-util') || 
              id.includes('bail') ||
              id.includes('is-plain-obj') ||
              id.includes('trough') ||
              id.includes('unified') ||
              id.includes('decode-named-character-reference') ||
              id.includes('character-entities') ||
              id.includes('ccount') ||
              id.includes('property-information') ||
              id.includes('space-separated-tokens') ||
              id.includes('comma-separated-tokens')
            ) {
              return 'vendor-markdown';
            }
            
            // AI SDK
            if (id.includes('@google/genai')) {
              return 'vendor-genai';
            }
            
            // Database
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            
            // UI Utilities
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }

            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            
            // Group everything else as a generic vendor
            return 'vendor-others';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
