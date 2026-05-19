import { InjectionToken, inject, DOCUMENT } from '@angular/core';

function baseHref(): string {
  const doc = inject(DOCUMENT);
  return doc.querySelector('base')?.href ?? doc.baseURI ?? '/';
}

export const PDFJS_WORKER_URL = new InjectionToken<string>('PDFJS_WORKER_URL', {
  providedIn: 'root',
  factory: () => baseHref() + 'pdf.worker.mjs',
});

// Directory URL containing pdfjs-dist WASM files (jbig2.wasm, openjpeg.wasm, etc.)
// Required for pdfjs-dist 5.x to decode JBIG2/CCITTFax Group-4 images.
export const PDFJS_WASM_URL = new InjectionToken<string>('PDFJS_WASM_URL', {
  providedIn: 'root',
  factory: () => baseHref() + 'wasm/',
});
