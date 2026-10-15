import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import svgr from "vite-plugin-svgr";

export default defineConfig({
  //  base: "/ecommerce-frontend/",
  base: './',
  plugins: [
    react(),
     svgr(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: true,

  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})