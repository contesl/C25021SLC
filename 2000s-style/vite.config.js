import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  base: "https://github.com/contesl/C25021SLC.git",
  plugins: [react()],
})
