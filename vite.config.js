import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
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
        // App shell caching: lets the UI load even with no connection.
        // Data itself still requires network, since this app reads/writes Supabase live.
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: "NetworkFirst",
            options: { cacheName: "app-shell" },
          },
        ],
      },
    }),
  ],
});