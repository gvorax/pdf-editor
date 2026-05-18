import {
  Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges,
  ViewChild, ElementRef, inject, signal, HostListener,
} from '@angular/core';
import { PdfToolbarComponent } from '../pdf-toolbar/pdf-toolbar';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { PdfRendererService } from '../../services/pdf-renderer.service';
import { ExportService } from '../../services/export.service';
import { ToolService } from '../../services/tool.service';
import { HistoryService } from '../../services/history.service';
import { EditorConfig, DEFAULT_CONFIG } from '../../models/editor-config.model';
import { DEFAULT_COLORS } from '../../models';

@Component({
  selector: 'pdf-editor',
  standalone: true,
  imports: [PdfToolbarComponent, PdfViewerComponent, SafeHtmlPipe],
  template: `
    <div class="pfe-host" [class]="'pfe-theme--' + cfg.theme">

      @if (cfg.toolbar.show !== false) {
        @if (isVertical) {
          <div class="pfe-with-sidebar" [class.pfe-sidebar-right]="cfg.toolbar.position === 'right'">
            @if (cfg.toolbar.position !== 'right') {
              <pdf-toolbar
                [config]="cfg.toolbar"
                [zoom]="zoom"
                [colors]="paletteColors"
                [currentPage]="currentPage"
                [pageCount]="rendererService.pageCount"
                (save)="save()"
                (upload)="onUploadClick()"
                (zoomIn)="onZoomIn()"
                (zoomOut)="onZoomOut()"
                (zoomReset)="onZoomReset()"
                [canUndo]="historyService.canUndo"
                [canRedo]="historyService.canRedo"
                (prevPage)="onPrevPage()"
                (nextPage)="onNextPage()"
                (goToPage)="onGoToPage($event)"
                (undo)="doUndo()"
                (redo)="doRedo()"
              />
            }
            <div class="pfe-viewer-wrap">
              <pdf-viewer #viewer [scale]="zoom()" [pageGap]="cfg.pageGap" (currentPageChange)="currentPage.set($event)" />
            </div>
            @if (cfg.toolbar.position === 'right') {
              <pdf-toolbar
                [config]="cfg.toolbar"
                [zoom]="zoom"
                [colors]="paletteColors"
                [currentPage]="currentPage"
                [pageCount]="rendererService.pageCount"
                (save)="save()"
                (upload)="onUploadClick()"
                (zoomIn)="onZoomIn()"
                (zoomOut)="onZoomOut()"
                (zoomReset)="onZoomReset()"
                [canUndo]="historyService.canUndo"
                [canRedo]="historyService.canRedo"
                (prevPage)="onPrevPage()"
                (nextPage)="onNextPage()"
                (goToPage)="onGoToPage($event)"
                (undo)="doUndo()"
                (redo)="doRedo()"
              />
            }
          </div>
        } @else {
          <div class="pfe-with-toolbar" [class.pfe-toolbar-bottom]="cfg.toolbar.position === 'bottom'">
            @if (cfg.toolbar.position !== 'bottom') {
              <pdf-toolbar
                [config]="cfg.toolbar"
                [zoom]="zoom"
                [colors]="paletteColors"
                [currentPage]="currentPage"
                [pageCount]="rendererService.pageCount"
                (save)="save()"
                (upload)="onUploadClick()"
                (zoomIn)="onZoomIn()"
                (zoomOut)="onZoomOut()"
                (zoomReset)="onZoomReset()"
                [canUndo]="historyService.canUndo"
                [canRedo]="historyService.canRedo"
                (prevPage)="onPrevPage()"
                (nextPage)="onNextPage()"
                (goToPage)="onGoToPage($event)"
                (undo)="doUndo()"
                (redo)="doRedo()"
              />
            }
            <div class="pfe-viewer-wrap">
              <pdf-viewer #viewer [scale]="zoom()" [pageGap]="cfg.pageGap" (currentPageChange)="currentPage.set($event)" />
            </div>
            @if (cfg.toolbar.position === 'bottom') {
              <pdf-toolbar
                [config]="cfg.toolbar"
                [zoom]="zoom"
                [colors]="paletteColors"
                [currentPage]="currentPage"
                [pageCount]="rendererService.pageCount"
                (save)="save()"
                (upload)="onUploadClick()"
                (zoomIn)="onZoomIn()"
                (zoomOut)="onZoomOut()"
                (zoomReset)="onZoomReset()"
                [canUndo]="historyService.canUndo"
                [canRedo]="historyService.canRedo"
                (prevPage)="onPrevPage()"
                (nextPage)="onNextPage()"
                (goToPage)="onGoToPage($event)"
                (undo)="doUndo()"
                (redo)="doRedo()"
              />
            }
          </div>
        }
      } @else {
        <div class="pfe-viewer-wrap pfe-viewer-wrap--full">
          <pdf-viewer #viewer [scale]="zoom()" [pageGap]="cfg.pageGap" />
        </div>
      }

      <!-- Hidden file input -->
      <input #fileInput type="file" accept=".pdf" style="display:none" (change)="onFileSelected($event)" />

      <!-- Drop zone when no PDF loaded -->
      @if (!rendererService.pageCount() && !rendererService.isLoading()) {
        <div class="pfe-dropzone" (dragover)="$event.preventDefault()" (drop)="onDrop($event)" (click)="onUploadClick()">
          <div class="pfe-dropzone__card">
            <div class="pfe-dropzone__icon" [innerHTML]="PDF_ICON | safeHtml"></div>
            <p class="pfe-dropzone__title">PDF faylni shu yerga tashlang</p>
            <p class="pfe-dropzone__hint">yoki <span class="pfe-dropzone__link">tanlash</span> uchun bosing</p>
          </div>
        </div>
      }

      @if (rendererService.isLoading()) {
        <div class="pfe-loader">
          <div class="pfe-spinner"></div>
          <span>Yuklanmoqda...</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: var(--pfe-font, Inter, system-ui, sans-serif);
      /* Light theme tokens */
      --pfe-bg: #f4f6f8;
      --pfe-toolbar-bg: #ffffff;
      --pfe-toolbar-shadow: 0 1px 4px rgba(0,0,0,.08);
      --pfe-border: #e2e8f0;
      --pfe-accent: #1e88e5;
      --pfe-accent-hover: #1565c0;
      --pfe-hover: #eff6ff;
      --pfe-text: #1a202c;
      --pfe-muted: #718096;
      --pfe-icon: #4a5568;
      --pfe-page-shadow: 0 4px 20px rgba(0,0,0,.12);
      --pfe-page-radius: 6px;
    }

    :host-context(.pfe-theme--dark), .pfe-theme--dark {
      --pfe-bg: #0f172a;
      --pfe-toolbar-bg: #1e293b;
      --pfe-toolbar-shadow: 0 2px 12px rgba(0,0,0,.4);
      --pfe-border: #334155;
      --pfe-accent: #38bdf8;
      --pfe-accent-hover: #0284c7;
      --pfe-hover: #1e3a5f;
      --pfe-text: #e2e8f0;
      --pfe-muted: #94a3b8;
      --pfe-icon: #cbd5e1;
      --pfe-page-shadow: 0 4px 32px rgba(0,0,0,.5);
    }

    .pfe-host {
      display: flex;
      width: 100%;
      height: 100%;
      background: var(--pfe-bg);
      overflow: hidden;
      position: relative;
    }

    /* Horizontal layout (toolbar top/bottom) */
    .pfe-with-toolbar {
      display: flex; flex-direction: column;
      width: 100%; height: 100%; overflow: hidden;
    }
    .pfe-toolbar-bottom { flex-direction: column-reverse; }

    /* Vertical layout (toolbar left/right) */
    .pfe-with-sidebar {
      display: flex; flex-direction: row;
      width: 100%; height: 100%; overflow: hidden;
    }
    .pfe-sidebar-right { flex-direction: row-reverse; }

    .pfe-viewer-wrap {
      flex: 1; overflow: auto; min-height: 0; min-width: 0;
    }
    .pfe-viewer-wrap--full { width: 100%; height: 100%; }

    /* Drop zone */
    .pfe-dropzone {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--pfe-bg);
      cursor: pointer; z-index: 10;
    }

    .pfe-dropzone__card {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 56px 72px;
      border: 2px dashed var(--pfe-border);
      border-radius: 20px;
      transition: border-color .2s, background .2s;
    }

    .pfe-dropzone:hover .pfe-dropzone__card {
      border-color: var(--pfe-accent);
      background: var(--pfe-hover);
    }

    .pfe-dropzone__icon { width: 72px; height: 72px; color: var(--pfe-accent); }
    .pfe-dropzone__icon svg { width: 100%; height: 100%; }

    .pfe-dropzone__title {
      font-size: 18px; font-weight: 600; color: var(--pfe-text); margin: 0;
    }
    .pfe-dropzone__hint { font-size: 14px; color: var(--pfe-muted); margin: 0; }
    .pfe-dropzone__link { color: var(--pfe-accent); font-weight: 500; text-decoration: underline; }

    /* Loader */
    .pfe-loader {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 16px; background: rgba(255,255,255,.8); z-index: 20;
      color: var(--pfe-muted); font-size: 14px;
    }

    .pfe-spinner {
      width: 44px; height: 44px;
      border: 3px solid var(--pfe-border);
      border-top-color: var(--pfe-accent);
      border-radius: 50%;
      animation: pfe-spin .8s linear infinite;
    }

    @keyframes pfe-spin { to { transform: rotate(360deg); } }
  `],
})
export class PdfEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() config: EditorConfig = {};
  @Input() src?: string | File | ArrayBuffer;

  @ViewChild('viewer') viewerRef?: PdfViewerComponent;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  readonly rendererService = inject(PdfRendererService);
  private readonly exportService = inject(ExportService);
  private readonly toolService = inject(ToolService);
  readonly historyService = inject(HistoryService);
  private readonly hostEl = inject(ElementRef);

  readonly zoom = signal(1);
  readonly paletteColors = signal([...DEFAULT_COLORS]);
  readonly currentPage = signal(1);

  cfg: Required<EditorConfig> = { ...DEFAULT_CONFIG };

  get isVertical(): boolean {
    const pos = this.cfg.toolbar?.position;
    return pos === 'left' || pos === 'right';
  }

  readonly PDF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
    <line x1="9" y1="19" x2="11" y2="19"/>
  </svg>`;

  ngOnInit(): void {
    this.applyConfig();
    if (this.src) this.loadSrc(this.src);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) this.applyConfig();
    if (changes['src'] && !changes['src'].firstChange && this.src) this.loadSrc(this.src);
  }

  private applyConfig(): void {
    this.cfg = {
      ...DEFAULT_CONFIG,
      ...this.config,
      toolbar: { ...DEFAULT_CONFIG.toolbar, ...this.config.toolbar },
      zoom:    { ...DEFAULT_CONFIG.zoom,    ...this.config.zoom    },
      cssVars: this.config.cssVars ?? {},
    };

    if (this.cfg.cssVars && Object.keys(this.cfg.cssVars).length) {
      const el = this.hostEl.nativeElement as HTMLElement;
      Object.entries(this.cfg.cssVars).forEach(([k, v]) => el.style.setProperty(k, v));
    }

    if (this.cfg.colors?.length) this.paletteColors.set(this.cfg.colors);
    if (this.cfg.defaultColor) this.toolService.setColor(this.cfg.defaultColor);
    if (this.cfg.defaultTool) this.toolService.setTool(this.cfg.defaultTool);
    if (this.cfg.zoom?.default) this.zoom.set(this.cfg.zoom.default);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;
    if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); this.doUndo(); }
    if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); this.doRedo(); }
  }

  async doUndo(): Promise<void> {
    const entry = this.historyService.popUndo();
    if (!entry || !this.viewerRef) return;
    const canvas = this.viewerRef.canvasComps.toArray()[entry.pageIndex];
    if (!canvas) return;
    const currentState = canvas.getCurrentState();
    this.historyService.pushRedo(entry.pageIndex, currentState);
    await canvas.restoreState(entry.state);
  }

  async doRedo(): Promise<void> {
    const entry = this.historyService.popRedo();
    if (!entry || !this.viewerRef) return;
    const canvas = this.viewerRef.canvasComps.toArray()[entry.pageIndex];
    if (!canvas) return;
    const currentState = canvas.getCurrentState();
    this.historyService.pushUndo(entry.pageIndex, currentState);
    await canvas.restoreState(entry.state);
  }

  async loadSrc(src: string | File | ArrayBuffer): Promise<void> {
    if (typeof src === 'string') {
      await this.rendererService.loadFromUrl(src);
    } else if (src instanceof File) {
      await this.rendererService.loadFromFile(src);
    } else {
      await this.rendererService.loadFromArrayBuffer(src);
    }
    this.historyService.clear();
    this.currentPage.set(1);
    // Wait one tick for the viewer to be in the DOM
    await new Promise<void>(r => setTimeout(r, 50));
    await this.viewerRef?.renderAllPages();
  }

  onUploadClick(): void { this.fileInputRef?.nativeElement.click(); }

  async onFileSelected(e: Event): Promise<void> {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) await this.loadSrc(file);
    (e.target as HTMLInputElement).value = '';
  }

  async onDrop(e: DragEvent): Promise<void> {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file?.type === 'application/pdf') await this.loadSrc(file);
  }

  async save(): Promise<void> {
    if (!this.viewerRef) return;
    const count = this.rendererService.pageCount();
    const fabricComps = this.viewerRef.canvasComps.toArray();

    const pages = Array.from({ length: count }, (_, i) => ({
      pdfCanvas: this.viewerRef!.getPageCanvas(i)!,
      fabricCanvas: fabricComps[i]?.getFabricCanvas() ?? null,
    })).filter(p => !!p.pdfCanvas);

    await this.exportService.exportPdf(pages);
  }

  onZoomIn(): void {
    const max  = this.cfg.zoom.max  ?? 3;
    const step = this.cfg.zoom.step ?? 0.25;
    this.zoom.update(z => Math.min(+(z + step).toFixed(2), max));
    // Angular propagates the new zoom() to PdfViewerComponent[scale],
    // which triggers ngOnChanges → renderAllPages() with the correct scale.
  }

  onZoomOut(): void {
    const min  = this.cfg.zoom.min  ?? 0.5;
    const step = this.cfg.zoom.step ?? 0.25;
    this.zoom.update(z => Math.max(+(z - step).toFixed(2), min));
  }

  onZoomReset(): void {
    this.zoom.set(this.cfg.zoom.default ?? 1);
  }

  onPrevPage(): void {
    const page = Math.max(1, this.currentPage() - 1);
    this.currentPage.set(page);
    this.viewerRef?.scrollToPage(page - 1);
  }

  onNextPage(): void {
    const max = this.rendererService.pageCount();
    const page = Math.min(max, this.currentPage() + 1);
    this.currentPage.set(page);
    this.viewerRef?.scrollToPage(page - 1);
  }

  onGoToPage(page: number): void {
    const clamped = Math.max(1, Math.min(this.rendererService.pageCount(), page));
    this.currentPage.set(clamped);
    this.viewerRef?.scrollToPage(clamped - 1);
  }

  ngOnDestroy(): void { this.rendererService.destroy(); }
}
