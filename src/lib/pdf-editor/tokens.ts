import { InjectionToken } from '@angular/core';

export const PDFJS_WORKER_URL = new InjectionToken<string>('PDFJS_WORKER_URL', {
  providedIn: 'root',
  factory: () => '/pdf.worker.mjs',
});
