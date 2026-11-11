// MapLibre GL JS v6 loads an ES-module worker (+ shared chunk) from a URL.
// Vite bundles the main script into /_astro/, so the default worker URL breaks.
// Copy the worker files to public/vendor/maplibre/ and point setWorkerUrl() at them.
import { cp, mkdir } from 'node:fs/promises';
const src = new URL('../node_modules/maplibre-gl/dist/', import.meta.url);
const dst = new URL('../public/vendor/maplibre/', import.meta.url);
await mkdir(dst, { recursive: true });
for (const f of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) await cp(new URL(f, src), new URL(f, dst));
console.log('[maplibre] worker files copied to public/vendor/maplibre/');
