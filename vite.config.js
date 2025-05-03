import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Make sure the host is correctly set to 0.0.0.0 or localhost
    port: 5174 // Or use another port if this one is already occupied
  }
});
