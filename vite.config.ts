import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@style": path.resolve(__dirname, "./src/style"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/style/_global";`,
      },
    },
  },
});
