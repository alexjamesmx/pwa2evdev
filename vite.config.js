import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
dotenv.config();
export default defineConfig(({ command }) => {
  const config = {
    base: "/",
    plugins: [
      react(),
      compression(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
      }),
    ],

    define: {
      "process.env": process.env,
    },
    build: {
      reportCompressedSize: true,
    },
  };
  if (command !== "serve") {
    config.base = "/pwa2evdev/";
  }

  return config;
});
