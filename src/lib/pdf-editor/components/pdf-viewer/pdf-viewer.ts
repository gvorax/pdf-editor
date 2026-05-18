import {
  Component, Input, OnChanges, OnDestroy, SimpleChanges, signal, inject, effect,
  ViewChildren, QueryList, AfterViewInit, ElementRef, ApplicationRef, Output, EventEmitter,
} from '@angular/core';
import { PdfCanvasComponent } from '../pdf-canvas/pdf-canvas';
import { PdfRendererService } from '../../services/pdf-renderer.service';

export { PdfCanvasComponent };

interface PageInfo {
  index: number;
  width: number;
  height: number;
}

@Component({
  selector: 'pdf-viewer',
  standalone: true,
  imports: [PdfCanvasComponent],
  template: `
    <div class="pdf-pages-container">
      @for (page of pages(); track page.index) {
        <div
          class="pdf-page-wrapper"
          #pageWrapper
          [style.width.px]="page.width"
          [style.height.px]="page.height"
          [style.margin-bottom.px]="pageGap"
        >
          <canvas
            class="pdf-render-canvas"
            #renderCanvas
            [attr.data-page]="page.index"
          ></canvas>
          <pdf-canvas
            [pageIndex]="page.index"
            [width]="page.width"
            [height]="page.height"
          />
        </div>
      }

      @if (rendererService.error()) {
        <div class="pdf-error">
          <span>Xato: {{ rendererService.error() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .pdf-pages-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      min-height: 100%;
    }

    .pdf-page-wrapper {
      position: relative;
      box-shadow: var(--pfe-page-shadow, 0 4px 24px rgba(0,0,0,.18));
      border-radius: var(--pfe-page-radius, 4px);
      overflow: hidden;
      background: #fff;
      flex-shrink: 0;
    }

    .pdf-render-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    pdf-canvas {
      position: absolute;
      inset: 0;
    }

    .pdf-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 48px;
      color: var(--pfe-muted, #888);
    }

    .pdf-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--pfe-accent, #1e88e5);
      border-top-color: transparent;
      border-radius: 50%;
      animation: pfe-spin .8s linear infinite;
    }

    @keyframes pfe-spin { to { transform: rotate(360deg); } }

    .pdf-error {
      padding: 24px;
      color: #e53935;
      background: #ffebee;
      border-radius: 8px;
      margin: 24px;
    }
  `],
})
export class PdfViewerComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() scale = 1;
  @Input() pageGap = 16;

  @Output() currentPageChange = new EventEmitter<number>();

  @ViewChildren('renderCanvas') renderCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChildren('pageWrapper') pageWrappers!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren(PdfCanvasComponent) canvasComps!: QueryList<PdfCanvasComponent>;

  readonly rendererService = inject(PdfRendererService);
  private readonly appRef = inject(ApplicationRef);
  private readonly el = inject(ElementRef);
  readonly pages = signal<PageInfo[]>([]);
  readonly currentPage = signal(1);

  constructor() {
    effect(() => this.currentPageChange.emit(this.currentPage()));
  }

  private viewInitialized = false;
  private scrollEl: HTMLElement | null = null;
  private readonly scrollHandler = () => this.updateCurrentPage();

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.scrollEl = this.el.nativeElement.parentElement as HTMLElement;
    this.scrollEl?.addEventListener('scroll', this.scrollHandler, { passive: true });
    if (this.rendererService.pageCount() > 0) {
      this.renderAllPages();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['scale'] || changes['pageGap']) && this.viewInitialized) {
      this.renderAllPages();
    }
  }

  ngOnDestroy(): void {
    this.scrollEl?.removeEventListener('scroll', this.scrollHandler);
  }

  private updateCurrentPage(): void {
    if (!this.scrollEl) return;
    const containerTop = this.scrollEl.getBoundingClientRect().top;
    const wrappers = this.pageWrappers.toArray();
    let current = 0;
    for (let i = 0; i < wrappers.length; i++) {
      const rect = wrappers[i].nativeElement.getBoundingClientRect();
      if (rect.top - containerTop <= this.scrollEl.clientHeight * 0.4) current = i;
      else break;
    }
    this.currentPage.set(current + 1);
  }

  scrollToPage(pageIndex: number): void {
    const el = this.pageWrappers.toArray()[pageIndex]?.nativeElement;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async renderAllPages(): Promise<void> {
    const count = this.rendererService.pageCount();
    if (!count) return;

    // First pass: compute page sizes
    const pageInfos: PageInfo[] = [];
    for (let i = 0; i < count; i++) {
      const page = await this.rendererService.getPage(i + 1);
      const viewport = page.getViewport({ scale: this.scale });
      pageInfos.push({ index: i, width: viewport.width, height: viewport.height });
    }
    this.pages.set(pageInfos);
    this.currentPage.set(1);

    // Force synchronous change detection so @for canvases are in the DOM
    // before we try to render into them (setTimeout(0) is not guaranteed
    // to run after Angular's signal-based update flushes).
    this.appRef.tick();

    const canvasEls = this.renderCanvases.toArray();
    for (let i = 0; i < count; i++) {
      const el = canvasEls[i]?.nativeElement;
      if (el) {
        await this.rendererService.renderPage(i + 1, el, this.scale);
      }
    }
  }

  getPageCanvas(pageIndex: number): HTMLCanvasElement | undefined {
    return this.renderCanvases.toArray()[pageIndex]?.nativeElement;
  }
}
