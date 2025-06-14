import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(
        // workbox 제공하는 PWA 기본 기능을 자동으로 해결하겠다 manifest
        {
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.js',
          registerType: 'prompt',
          injectManifest: {
            globPatterns: ['**/*.{js,css,html,png,svg}'],
            maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
          },
          manifest: {
            name: '먼망진창',
            short_name: '먼망진창',
            description: '실시간 대기 알림 서비스',
            theme_color: '#4ED7F1',
            background_color: '#4ED7F1',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                "src": "icons/icon-48x48.png",
                "sizes": "48x48",
                "type": "image/png"
              },
              {
                "src": "icons/icon-72x72.png",
                "sizes": "72x72",
                "type": "image/png"
              },
              {
                "src": "icons/icon-96x96.png",
                "sizes": "96x96",
                "type": "image/png"
              },
              {
                "src": "icons/icon-128x128.png",
                "sizes": "128x128",
                "type": "image/png"
              },
              {
                "src": "/icons/icon-144x144.png",
                "sizes": "144x144",
                "type": "image/png"
              },
              {
                "src": "/icons/icon-152x152.png",
                "sizes": "152x152",
                "type": "image/png"
              },
              {
                "src": "/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
              },
              {
                "src": "/icons/icon-256x256.png",
                "sizes": "256x256",
                "type": "image/png"
              },
              {
                "src": "/icons/icon-384x384.png",
                "sizes": "384x384",
                "type": "image/png"
              },
              {
                "src": "/icons/icon-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
              }
            ],
          },
        })
  ],
})