import { InjectionToken } from '@angular/core';

export const PDFJS_WORKER_URL = new InjectionToken<string>('PDFJS_WORKER_URL', {
  providedIn: 'root',
  factory: () => '/pdf.worker.mjs',
});

// Directory URL containing pdfjs-dist WASM files (jbig2.wasm, openjpeg.wasm, etc.)
// Required for pdfjs-dist 5.x to decode JBIG2/CCITTFax Group-4 images.
export const PDFJS_WASM_URL = new InjectionToken<string>('PDFJS_WASM_URL', {
  providedIn: 'root',
  factory: () => '/wasm/',
});
