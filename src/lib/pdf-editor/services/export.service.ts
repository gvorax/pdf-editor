import { Injectable } from '@angular/core';
import type { Canvas as FabricCanvas } from 'fabric';

@Injectable({ providedIn: 'root' })
export class ExportService {
  async exportPdf(
    pages: Array<{ pdfCanvas: HTMLCanvasElement; fabricCanvas: FabricCanvas | null }>,
    filename = 'annotated.pdf',
  ): Promise<void> {
    // Dynamic import — prevents Vite from bundling pdf-lib during optimization
    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();

    for (const { pdfCanvas, fabricCanvas } of pages) {
      const w = pdfCanvas.width;
      const h = pdfCanvas.height;

      const merged = document.createElement('canvas');
      merged.width = w;
      merged.height = h;
      const ctx = merged.getContext('2d')!;

      ctx.drawImage(pdfCanvas, 0, 0);

      if (fabricCanvas && fabricCanvas.getObjects().length > 0) {
        await this._drawFabricOnContext(ctx, fabricCanvas, w, h);
      }

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
      const dataUrl = fc.toDataURL({ format: 'png', multiplier: 1, enableRetinaScaling: false });
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, targetW, targetH); resolve(); };
      img.onerror = () => resolve();
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
