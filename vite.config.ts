import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['bans-icon.svg', 'bans-icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'BANS Home',
        short_name: 'BANS Home',
        description: 'Shared family inventory, expiry alerts, shopping lists and spending.',
        theme_color: '#1f6b4f',
        background_color: '#f4f6f2',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'bans-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: 'bans-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
})
