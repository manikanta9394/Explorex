import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const basePath = process.env.VITE_BASE_PATH || (process.env.VERCEL ? '/' : '/Explorex/')

function nativeCompressionPlugin() {
  return {
    name: 'native-gzip-preview',
    closeBundle() {
      // 1. Copy index.html to 404.html for GitHub Pages SPA deep link fallback
      const distRoot = path.resolve(process.cwd(), 'dist')
      const indexHtmlPath = path.join(distRoot, 'index.html')
      const fourOhFourPath = path.join(distRoot, '404.html')
      if (fs.existsSync(indexHtmlPath)) {
        fs.copyFileSync(indexHtmlPath, fourOhFourPath)
        const gzipped404 = zlib.gzipSync(fs.readFileSync(fourOhFourPath), { level: 9 })
        fs.writeFileSync(`${fourOhFourPath}.gz`, gzipped404)
      }

      // 2. Pre-gzip static assets
      const distDir = path.resolve(distRoot, 'assets')
      if (!fs.existsSync(distDir)) return
      const files = fs.readdirSync(distDir)
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.svg') || file.endsWith('.html')) {
          const filePath = path.join(distDir, file)
          const content = fs.readFileSync(filePath)
          const gzipped = zlib.gzipSync(content, { level: 9 })
          fs.writeFileSync(`${filePath}.gz`, gzipped)
        }
      }
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const accept = req.headers['accept-encoding'] || ''
        if (!accept.includes('gzip')) return next()
        const cleanUrl = (req.url || '').split('?')[0].replace(basePath, '').replace(/^\//, '')
        const filePath = path.resolve(process.cwd(), 'dist', cleanUrl)
        const gzPath = `${filePath}.gz`
        if (fs.existsSync(gzPath)) {
          res.setHeader('Content-Encoding', 'gzip')
          res.setHeader('Vary', 'Accept-Encoding')
          if (cleanUrl.endsWith('.css')) res.setHeader('Content-Type', 'text/css')
          if (cleanUrl.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript')
          if (cleanUrl.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml')
          if (cleanUrl.endsWith('.html')) res.setHeader('Content-Type', 'text/html')
          return fs.createReadStream(gzPath).pipe(res)
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    nativeCompressionPlugin(),
    {
      name: 'html-base-fix',
      transformIndexHtml(html) {
        return html
          .replace(/\/Explorex\/Explorex\//g, '/Explorex/')
          .replace(/<link rel="stylesheet"[^>]*leaflet-vendor[^>]*>\s*/g, '')
      },
    },
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    modulePreload: {
      resolveDependencies(filename, deps) {
        return deps.filter((dep) => !dep.includes('leaflet') && !dep.includes('tourism-data') && !dep.includes('MainAppShell'))
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/leaflet')) {
            return 'leaflet-vendor'
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase-vendor'
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('src/data/tourismData')) {
            return 'tourism-data'
          }
        },
      },
    },
  },
  server: {
    port: 5180,
    strictPort: false,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/server/**', '**/scripts/**', '**/data/**'],
    },
  },
})
