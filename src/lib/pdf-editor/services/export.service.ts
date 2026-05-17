import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { PdfRendererService } from './pdf-renderer.service';
import type { Canvas as FabricCanvas } from 'fabric';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(private renderer: PdfRendererService) {}

  /**
   * Merges each PDF page canvas with its Fabric annotation canvas and
   * exports a downloadable PDF.
   *
   * @param pages  Array indexed by page order: { pdfCanvas, fabricCanvas }
   */
  async exportPdf(
    pages: Array<{ pdfCanvas: HTMLCanvasElement; fabricCanvas: FabricCanvas | null }>,
    filename = 'annotated.pdf',
  ): Promise<void> {
    const pdfDoc = await PDFDocument.create();

    for (const { pdfCanvas, fabricCanvas } of pages) {
      const w = pdfCanvas.width;
      const h = pdfCanvas.height;

      // Create a merged canvas: PDF background + annotation layer
      const merged = document.createElement('canvas');
      merged.width = w;
      merged.height = h;
      const ctx = merged.getContext('2d')!;

      // 1. Draw the PDF page
      ctx.drawImage(pdfCanvas, 0, 0);

      // 2. Draw annotations on top (if any exist)
      if (fabricCanvas && fabricCanvas.getObjects().length > 0) {
        await this._drawFabricOnContext(ctx, fabricCanvas, w, h);
      }

      // 3. Encode as PNG and embed in new PDF page
      const pngBytes = await this._canvasToPng(merged);
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const page = pdfDoc.addPage([w, h]);
      page.drawImage(pngImage, { x: 0, y: 0, width: w, height: h });
    }

    const bytes = await pdfDoc.save();
    this._triggerDownload(bytes as unknown as Uint8Array<ArrayBuffer>, filename);
  }

  private _drawFabricOnContext(
    ctx: CanvasRenderingContext2D,
    fc: FabricCanvas,
    targetW: number,
    targetH: number,
  ): Promise<void> {
    return new Promise<void>(resolve => {
      // toDataURL exports the Fabric canvas with all drawn objects
      const dataUrl = fc.toDataURL({ format: 'png', multiplier: 1, enableRetinaScaling: false });
      const img = new Image();
      img.onload = () => {
        // Draw scaled to target dimensions (handles retina discrepancies)
        ctx.drawImage(img, 0, 0, targetW, targetH);
        resolve();
      };
      img.onerror = () => resolve(); // never block export on annotation failure
      img.src = dataUrl;
    });
  }

  private _canvasToPng(canvas: HTMLCanvasElement): Promise<Uint8Array> {
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        blob!.arrayBuffer().then(buf => resolve(new Uint8Array(buf)));
      }, 'image/png');
    });
  }

  private _triggerDownload(bytes: Uint8Array<ArrayBuffer>, filename: string): void {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
