import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        // Proxy not needed for Firebase
    },
    // Use relative base path so it works even if not at root domain (sometimes helps with local viewing)
    base: './',
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: 'index.html',
                admin: 'admin.html'
            }
        }
    },
    optimizeDeps: {
        include: ['pdfjs-dist']
    }
});
