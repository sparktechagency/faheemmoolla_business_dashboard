import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Make sure the host is correctly set to 0.0.0.0 or localhost
    port: 5174, // Or use another port if this one is already occupied
    proxy: {
      '/api/places': {
        target: 'https://maps.googleapis.com/maps/api/place',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/places/, ''),
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
});