import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  base: "./", // Importante para Electron
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
