import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // "prompt" keeps the old build cached until the user accepts, so the
      // update notification can fire. "autoUpdate" reloads silently instead,
      // which leaves nothing to notify about.
      registerType: "prompt",
      includeAssets: [
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
],
      manifest: {
        name: "PisoPath",
        short_name: "PisoPath",
        description: "Track your daily expenses in the Philippines.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ECE7D1",
        theme_color: "#8A7650",
icons: [
  {
    src: "/icons/icon-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any",
  },
  {
    src: "/icons/icon-maskable-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "maskable",
  },
  {
    src: "/icons/icon-maskable-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/auth\/confirm/],
        // no runtimeCaching: API responses must never be cached
      },
    }),
  ],
});