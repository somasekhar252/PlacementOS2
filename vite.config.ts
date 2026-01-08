import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 1. ADD THIS LINE: Replace 'PlacementOS2' with your exact GitHub Repository name
    base: '/PlacementOS2/', 

    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env': env 
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: 'esbuild',
    }
  };
});
