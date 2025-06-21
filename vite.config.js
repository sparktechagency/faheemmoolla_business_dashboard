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
    ]
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
  },
});