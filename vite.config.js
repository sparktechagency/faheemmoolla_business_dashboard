import react from "@vitejs/plugin-react";

import { defineConfig } from "vite";
 
export default defineConfig({

  plugins: [react()],

  server: {

    host: "145.223.33.60",  // Your IP address (can be used to allow remote access)

    port: 4173,

    allowedHosts: [

      "business.foodsavr.com", 

      "www.business.foodsavr.com",  // Add www version of your domain

      "localhost"

    ],

  },

  build: {

    sourcemap: false,  // disables source maps for production

    minify: "esbuild", // faster minifier

  },

});

 