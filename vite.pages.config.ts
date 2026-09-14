import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.NEXT_PUBLIC_BASE_PATH
  ? `${process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "")}/`
  : "/";

export default defineConfig({
  root: path.join(rootDir, "github-pages"),
  publicDir: path.join(rootDir, "public"),
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  build: {
    outDir: path.join(rootDir, "dist-pages"),
    emptyOutDir: true,
  },
});
