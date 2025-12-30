// vite.config.js (or .ts)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";      // (if you’re using React)
import tailwindcss from "@tailwindcss/vite";   // import the Tailwind Vite plugin

export default defineConfig({
  plugins: [
    react(),       // your other plugins
    tailwindcss()  // ⚡ enable Tailwind
  ],
});

