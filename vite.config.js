import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'portfolio-public-assets-base',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('/src/App.jsx') && !id.endsWith('\\src\\App.jsx')) return null
        return code.replaceAll('/assets/', `${base}assets/`)
      },
    },
  ],
})
