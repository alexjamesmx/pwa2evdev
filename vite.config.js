import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
dotenv.config();
export default defineConfig(({ command }) => {
  const config = {
    base: "/pwa2evdev",
    plugins: [react(), compression()],

    define: {
      "process.env": process.env,
    },
    build: {
      reportCompressedSize: true,
    },
  };
  if (command !== "serve") {
    config.base = "/pwa2evdev";
  }
  return config;
});
