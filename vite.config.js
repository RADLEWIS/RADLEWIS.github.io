import { resolve } from 'path'
import { defineConfig } from 'vite'

// 新增文章时，在这里加一行入口，否则不会被打包部署
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html'),
        'feishu-calendar-sync': resolve(__dirname, 'feishu-calendar-sync/index.html'),
        'feishu-calendar-privacy': resolve(__dirname, 'feishu-calendar-sync/privacy.html'),
        'statistics-paper': resolve(__dirname, 'posts/statistics-paper/index.html'),
      },
    },
  },
})
