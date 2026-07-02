import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Injeta a URL do backend como constante global. Evita `import.meta.env`
    // no mutator do orval (que o transpila em target es2015 e emite warning).
    define: {
      __API_BASE_URL__: JSON.stringify(
        env.VITE_API_URL ?? 'http://localhost:3000',
      ),
    },
  }
})
