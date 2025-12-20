import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  server: {
    port: 5174,                    // Đổi port local thành 3000
    host: 'localhost',             // Hoặc '0.0.0.0' để truy cập từ thiết bị khác
    open: true                     // Tự động mở browser
  },

  plugins: [react(), tailwindcss()],
})
