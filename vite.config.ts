import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs';
import * as path from 'path';

// Mocking types/declarations to bypass build errors without @types/node
declare const process: { 
  env: Record<string, string | undefined>;
  cwd: () => string;
};

// Read package.json to get the current version
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const appVersion = packageJson.version;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-version-file',
      writeBundle() {
        // Write a version.json file to the dist folder after build
        const distPath = path.resolve(process.cwd(), 'dist');
        const versionFilePath = path.join(distPath, 'version.json');
        
        // Ensure dist exists (writeBundle usually runs after it's created, but good to be safe)
        if (fs.existsSync(distPath)) {
          fs.writeFileSync(versionFilePath, JSON.stringify({ version: appVersion }));
          console.log(`[vite] Generated version.json with version: ${appVersion}`);
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': process.cwd()
    }
  },
  define: {
    // Safely expose process.env.API_KEY to the client
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.VITE_API_KEY || ""),
    // Inject the app version constant
    '__APP_VERSION__': JSON.stringify(appVersion)
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})