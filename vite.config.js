import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'broke-bikini-pipes-beauty.trycloudflare.com',
      // agrega más si quieres
    ],
  }
});
