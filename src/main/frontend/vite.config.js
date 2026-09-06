import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // 開發時 npm run dev 跑在 5173，後端 Spring Boot 跑在 8080。
    // 把 /api 轉給 8080，瀏覽器才會認為兩邊同源，JSESSIONID cookie 才帶得過去。
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },

  build: {
    // 打包結果直接輸出到 Maven 的 classpath 目錄，mvn package 就會把前端一起打進 jar。
    outDir: '../../../target/classes/static',
    emptyOutDir: true,
  },
})
