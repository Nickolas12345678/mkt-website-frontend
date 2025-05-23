import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(),],
    server: {
        port: 3000,
    },
    preview: {
        port: Number(process.env.PORT) || 4173,
        host: true,  // Дозволяє приймати підключення ззовні
        allowedHosts: ['mkt-uzhhorod-website-8d2b37bb6138.herokuapp.com'], // Дозволений хост
    },
})
