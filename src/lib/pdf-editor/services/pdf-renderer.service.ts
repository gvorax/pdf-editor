import { Injectable, signal, inject } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { PDFJS_WORKER_URL } from '../tokens';

@Injectable({ providedIn: 'root' })
export class PdfRendererService {
  private readonly workerUrl = inject(PDFJS_WORKER_URL);
  private pdfDoc: PDFDocumentProxy | null = null;
  private pdfWorker: InstanceType<typeof pdfjsLib.PDFWorker> | null = null;

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
    // Destroy previous document (pdfjs terminates the underlying worker on destroy)
    if (this.pdfDoc) {
      await this.pdfDoc.destroy();
      this.pdfDoc = null;
    }
    if (this.pdfWorker) {
      this.pdfWorker.destroy();
      this.pdfWorker = null;
    }

    // pdfjs-dist v5 ships ESM-only worker files.
    // A classic Worker cannot execute ESM, so we must use { type: 'module' }.
    // We pass the Worker to PDFWorker.create() and hand that to getDocument()
    // so pdfjs owns the lifecycle rather than using the global workerSrc/workerPort.
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

  // pdfjs-dist v5: RenderParameters.canvas (HTMLCanvasElement) is required;
  // canvasContext is optional and derived internally from the canvas.
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
