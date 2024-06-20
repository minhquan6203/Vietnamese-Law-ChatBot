import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/chatbot-UI/', // Đảm bảo đúng tên repository của bạn
  plugins: [react()],
});
