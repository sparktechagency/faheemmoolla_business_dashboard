import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "145.223.33.60",
    port: 4173,
  },
  build: {
    sourcemap: false,  // disables source maps for production
    minify: "esbuild", // faster minifier
  },
});

