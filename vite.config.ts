import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: '삿포로 여행 가이드 · 2027 눈축제',
        short_name: '삿포로 여행',
        description: '2027 삿포로 눈축제 & 조잔케이 온천 3박 4일 나만의 여행 가이드',
        start_url: '/',
        display: 'standalone',
        background_color: '#f2f4f6',
        theme_color: '#f2f4f6',
        lang: 'ko',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'weather', expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 6 } },
          },
          {
            urlPattern: /^https:\/\/open\.er-api\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'fx', expiration: { maxEntries: 2, maxAgeSeconds: 60 * 60 * 24 } },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\//,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 90 } },
          },
        ],
      },
    }),
  ],
})
