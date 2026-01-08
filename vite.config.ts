import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all envs regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    
    /**
     * Globally define environment variables.
     * This allows components like InterviewArena.tsx to access keys via process.env
     * without crashing the browser execution.
     */
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      // Ensures standard process.env checks don't fail
      'process.env': env 
    },
    
    resolve: {
      alias: {
        /**
         * Setup '@' as a shortcut for the root directory.
         * Allows imports like: import { auth } from '@/firebase.ts'
         */
        '@': path.resolve(__dirname, '.'),
      },
    },
    
    // Build options to ensure compatibility during deployment
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      // Minify logic for production
      minify: 'esbuild',
    }
  };
});
