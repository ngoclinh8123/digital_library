const path = require("path");
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      service: path.resolve(__dirname, "./src/service"),
      component: path.resolve(__dirname, "./src/component"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      host: "base.test",
      clientPort: 443,
      protocol: "wss",
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.js"],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "primary-color": "@blue-6",
        },
        javascriptEnabled: true,
      },
    },
  },
});
