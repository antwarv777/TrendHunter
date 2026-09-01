import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Относительный base — чтобы билд работал и в корне, и в подкаталоге GitHub Pages
  base: './',
  server: { host: true },
})
