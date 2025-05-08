import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
    server: {
    host: 'localhost', // This will make the server accessible externally 
    port: 5173, // Change the port nr to the corresponding number
    proxy: {
      '/api': {
        target: 'https://localhost:5000', // Change the port nr to the corresponding number
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: { 'process.env.BASE_URL': JSON.stringify('https://localhost:5000') }, // Change the port nr to the corresponding number

});