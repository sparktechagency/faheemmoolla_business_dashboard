import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "139.59.0.25",
    port: 5174, // Change this to a number instead of a string
  },
});
