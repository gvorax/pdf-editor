import { Injectable, signal, inject } from '@angular/core';
import type { PDFDocumentProxy, PDFPageProxy, PDFWorker } from 'pdfjs-dist';
import { PDFJS_WORKER_URL } from '../tokens';

@Injectable({ providedIn: 'root' })
export class PdfRendererService {
  private readonly workerUrl = inject(PDFJS_WORKER_URL);
  private pdfDoc: PDFDocumentProxy | null = null;
  private pdfWorker: PDFWorker | null = null;

  readonly pageCount = signal(0);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  async loadFromFile(file: File): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const buffer = await file.arrayBuffer();
      await this._load(buffer);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadFromUrl(url: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const resp = await fetch(url);
      const buffer = await resp.arrayBuffer();
      await this._load(buffer);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadFromArrayBuffer(buffer: ArrayBuffer): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await this._load(buffer);
    } catch (e) {
      this.error.set((e as Error).message);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async _load(buffer: ArrayBuffer): Promise<void> {
    if (this.pdfDoc) {
      await this.pdfDoc.destroy();
      this.pdfDoc = null;
    }
    if (this.pdfWorker) {
      this.pdfWorker.destroy();
      this.pdfWorker = null;
    }

    // Dynamic import — prevents Vite from bundling pdfjs-dist during optimization
    const pdfjsLib = await import('pdfjs-dist');
    const port = new Worker(this.workerUrl, { type: 'module' });
    this.pdfWorker = pdfjsLib.PDFWorker.create({ port });

    this.pdfDoc = await pdfjsLib.getDocument({
      data: buffer,
      worker: this.pdfWorker,
    }).promise;
    this.pageCount.set(this.pdfDoc.numPages);
  }

  async getPage(pageNumber: number): Promise<PDFPageProxy> {
    if (!this.pdfDoc) throw new Error('No PDF loaded');
    return this.pdfDoc.getPage(pageNumber);
  }

  async renderPage(
    pageNumber: number,
    canvas: HTMLCanvasElement,
    scale = 1,
  ): Promise<{ width: number; height: number }> {
    const page = await this.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, viewport }).promise;
    return { width: viewport.width, height: viewport.height };
  }

  getDocument(): PDFDocumentProxy | null {
    return this.pdfDoc;
  }

  async destroy(): Promise<void> {
    if (this.pdfDoc) {
      await this.pdfDoc.destroy();
      this.pdfDoc = null;
      this.pageCount.set(0);
    }
    if (this.pdfWorker) {
      this.pdfWorker.destroy();
      this.pdfWorker = null;
    }
  }
}
