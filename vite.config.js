import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: [
      'business.foodsavr.com',
      'www.business.foodsavr.com',
      'localhost',
      '127.0.0.1'
    ],
    proxy: {
      '/api/places': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/places/, '/maps/api/place'),
        secure: false, // Set to false if you get SSL errors in dev
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }
    }
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
  },
});