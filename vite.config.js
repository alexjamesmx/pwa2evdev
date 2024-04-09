import dotenv from "dotenv";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
dotenv.config();
export default defineConfig({
  plugins: [react(), compression()],
  define: {
    "process.env": process.env,
  },
});
