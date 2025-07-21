import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // or react / svelte if needed

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
