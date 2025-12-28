import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080, // Your frontend runs on this port
    proxy: {
      // This forwards any request starting with /api to your backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        base: "/VisionOS",
      },
    },
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      
    },
  },
}));