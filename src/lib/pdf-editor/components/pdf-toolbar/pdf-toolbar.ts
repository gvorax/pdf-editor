import { Component, Input, Output, EventEmitter, inject, signal, Signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ToolService } from '../../services/tool.service';
import { ToolType } from '../../models';
import { ToolbarConfig } from '../../models/editor-config.model';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

// ── SVG icon helpers ─────────────────────────────────────────────────────────
function svg(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;
}

const ICONS = {
  chevronLeft:  svg(`<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
  chevronRight: svg(`<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
  select:    svg(`<path d="M4 4l7 18 3-7 7-3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`),
  pen:       svg(`<path d="M3 21l4-1.5L19.5 8l-2.5-2.5L4.5 17zM17 5.5l2.5 2.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`),
  highlight: svg(`<path d="m9 11-6 6v3h9l3-3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  text:      svg(`<path d="M4 7V4h16v3M12 4v16M9 20h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`),
  rect:      svg(`<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>`),
  circle:    svg(`<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/>`),
  arrow:     svg(`<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
  line:      svg(`<path d="M4 20L20 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
  eraser:    svg(`<path d="M20 20H7L3 16l11-11 6 6-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
  palette:   svg(`<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.5 12 3c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  zoomIn:    svg(`<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M11 8v6M8 11h6M20 20l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
  zoomOut:   svg(`<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 11h6M20 20l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
  undo:      svg(`<path d="M3 10h11a5 5 0 0 1 0 10H9M3 10l4-4M3 10l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
  redo:      svg(`<path d="M21 10H10a5 5 0 0 0 0 10h5M21 10l-4-4M21 10l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
  zoomFit:   svg(`<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>`),
  save:      svg(`<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`),
  upload:    svg(`<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
};

interface ToolDef { type: ToolType; label: string; icon: string; }

const ALL_TOOLS: ToolDef[] = [
  { type: ToolType.Select,      label: 'Tanlash',       icon: ICONS.select },
  { type: ToolType.Pen,         label: 'Qalam',         icon: ICONS.pen },
  { type: ToolType.Highlighter, label: 'Marker',        icon: ICONS.highlight },
  { type: ToolType.Text,        label: 'Matn',          icon: ICONS.text },
  { type: ToolType.Rectangle,   label: "To'rtburchak",  icon: ICONS.rect },
  { type: ToolType.Circle,      label: 'Doira',         icon: ICONS.circle },
  { type: ToolType.Arrow,       label: "O'q",           icon: ICONS.arrow },
  { type: ToolType.Line,        label: 'Chiziq',        icon: ICONS.line },
  { type: ToolType.Eraser,      label: "O'chirish",     icon: ICONS.eraser },
];

@Component({
  selector: 'pdf-toolbar',
  standalone: true,
  imports: [DecimalPipe, SafeHtmlPipe],
  template: `
    <div class="pfe-toolbar" [class]="'pfe-toolbar--' + (config?.position ?? 'top')">

      <!-- Tool buttons -->
      <div class="pfe-toolbar__group">
        @for (tool of visibleTools; track tool.type) {
          <button
            class="pfe-tool-btn"
            [class.pfe-tool-btn--active]="toolService.activeTool() === tool.type"
            [title]="tool.label"
            (click)="selectTool(tool.type)"
          >
            <span class="pfe-icon" [innerHTML]="tool.icon | safeHtml"></span>
          </button>
        }
      </div>

      <div class="pfe-divider"></div>

      <!-- Undo / Redo -->
      <div class="pfe-toolbar__group">
        <button class="pfe-tool-btn" title="Orqaga (Ctrl+Z)" [disabled]="!canUndo()" (click)="undo.emit()">
          <span class="pfe-icon" [innerHTML]="icons.undo | safeHtml"></span>
        </button>
        <button class="pfe-tool-btn" title="Oldinga (Ctrl+Shift+Z)" [disabled]="!canRedo()" (click)="redo.emit()">
          <span class="pfe-icon" [innerHTML]="icons.redo | safeHtml"></span>
        </button>
      </div>

      <div class="pfe-divider"></div>

      <!-- Colors -->
      <div class="pfe-toolbar__group pfe-toolbar__colors">
        @for (c of colors(); track c) {
          <button
            class="pfe-color-dot"
            [class.pfe-color-dot--active]="toolService.options().color === c"
            [style.background]="c"
            [title]="c"
            (click)="selectColor(c)"
          ></button>
        }
        <label class="pfe-color-pick" title="Rang tanlash">
          <input type="color" [value]="toolService.options().color" (input)="onCustomColor($event)" />
          <span class="pfe-icon" [innerHTML]="icons.palette | safeHtml"></span>
        </label>
      </div>

      <div class="pfe-divider"></div>

      <!-- Size -->
      <div class="pfe-toolbar__group pfe-toolbar__size">
        <span class="pfe-label">O'lcham</span>
        <input
          type="range" min="1" max="20" step="1"
          [value]="toolService.options().size"
          (input)="onSize($event)"
          class="pfe-slider"
        />
        <span class="pfe-size-val">{{ toolService.options().size }}</span>
      </div>

      <div class="pfe-divider"></div>

      <!-- Zoom -->
      <div class="pfe-toolbar__group">
        <button class="pfe-tool-btn" title="Kichiklashtirish" (click)="zoomOut.emit()">
          <span class="pfe-icon" [innerHTML]="icons.zoomOut | safeHtml"></span>
        </button>
        <span class="pfe-zoom-val">{{ zoom() * 100 | number:'1.0-0' }}%</span>
        <button class="pfe-tool-btn" title="Kattalashtirish" (click)="zoomIn.emit()">
          <span class="pfe-icon" [innerHTML]="icons.zoomIn | safeHtml"></span>
        </button>
        <button class="pfe-tool-btn" title="Asl o'lcham" (click)="zoomReset.emit()">
          <span class="pfe-icon" [innerHTML]="icons.zoomFit | safeHtml"></span>
        </button>
      </div>

      @if (pageCount() > 0) {
        <div class="pfe-divider"></div>

        <!-- Page navigation -->
        <div class="pfe-toolbar__group pfe-toolbar__pages">
          <button
            class="pfe-tool-btn"
            title="Oldingi sahifa"
            [disabled]="currentPage() <= 1"
            (click)="prevPage.emit()"
          >
            <span class="pfe-icon" [innerHTML]="icons.chevronLeft | safeHtml"></span>
          </button>
          <span class="pfe-page-indicator">
            <input
              class="pfe-page-input"
              type="number"
              [min]="1"
              [max]="pageCount()"
              [value]="currentPage()"
              (change)="onPageInput($event)"
            />
            <span class="pfe-page-sep">/ {{ pageCount() }}</span>
          </span>
          <button
            class="pfe-tool-btn"
            title="Keyingi sahifa"
            [disabled]="currentPage() >= pageCount()"
            (click)="nextPage.emit()"
          >
            <span class="pfe-icon" [innerHTML]="icons.chevronRight | safeHtml"></span>
          </button>
        </div>
      }

      <div class="pfe-divider"></div>

      <!-- Actions -->
      @if (config?.showSave !== false) {
        <div class="pfe-toolbar__group">
          <button class="pfe-action-btn pfe-action-btn--primary" title="PDF saqlash" (click)="save.emit()">
            <span class="pfe-icon" [innerHTML]="icons.save | safeHtml"></span>
            <span class="pfe-action-label">Saqlash</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .pfe-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
      padding: 8px 14px;
      background: var(--pfe-toolbar-bg, #fff);
      border-bottom: 1px solid var(--pfe-border, #e0e0e0);
      box-shadow: var(--pfe-toolbar-shadow, 0 2px 8px rgba(0,0,0,.06));
      flex-shrink: 0;
      z-index: 20;
      user-select: none;
    }

    .pfe-toolbar--bottom { border-bottom: none; border-top: 1px solid var(--pfe-border, #e0e0e0); }

    .pfe-toolbar--left, .pfe-toolbar--right {
      flex-direction: column;
      align-items: stretch;
      padding: 12px 8px;
      border-bottom: none;
      height: 100%;
      overflow-y: auto;
      width: 60px;
    }
    .pfe-toolbar--left { border-right: 1px solid var(--pfe-border, #e0e0e0); }
    .pfe-toolbar--right { border-left: 1px solid var(--pfe-border, #e0e0e0); }

    .pfe-toolbar__group {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }

    .pfe-toolbar--left .pfe-toolbar__group,
    .pfe-toolbar--right .pfe-toolbar__group { flex-direction: column; align-items: center; }

    .pfe-divider {
      width: 1px; height: 28px;
      background: var(--pfe-border, #e0e0e0);
      margin: 0 6px; flex-shrink: 0;
    }

    .pfe-toolbar--left .pfe-divider,
    .pfe-toolbar--right .pfe-divider { width: 100%; height: 1px; margin: 6px 0; }

    /* Tool button */
    .pfe-tool-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px;
      border: none; border-radius: 8px;
      background: transparent; cursor: pointer;
      color: var(--pfe-icon, #444);
      transition: background .15s, color .15s, transform .1s;
      padding: 0; flex-shrink: 0;
    }
    .pfe-tool-btn:hover { background: var(--pfe-hover, #f0f4ff); color: var(--pfe-accent, #1e88e5); }
    .pfe-tool-btn--active { background: var(--pfe-accent, #1e88e5) !important; color: #fff !important; }
    .pfe-tool-btn:active { transform: scale(.92); }

    .pfe-icon { display: flex; width: 20px; height: 20px; pointer-events: none; }
    .pfe-icon svg { width: 100%; height: 100%; }

    /* Color dots */
    .pfe-toolbar__colors { flex-wrap: nowrap; }

    .pfe-color-dot {
      width: 22px; height: 22px;
      border-radius: 50%; border: 2px solid transparent;
      cursor: pointer; flex-shrink: 0;
      transition: transform .15s, border-color .15s;
    }
    .pfe-color-dot:hover { transform: scale(1.2); }
    .pfe-color-dot--active {
      border-color: var(--pfe-accent, #1e88e5);
      box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--pfe-accent, #1e88e5);
    }

    .pfe-color-pick {
      position: relative;
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px;
      border-radius: 8px; cursor: pointer;
      color: var(--pfe-icon, #444);
      transition: background .15s;
    }
    .pfe-color-pick:hover { background: var(--pfe-hover, #f0f4ff); }
    .pfe-color-pick input[type="color"] {
      position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
    }

    /* Size slider */
    .pfe-toolbar__size { gap: 8px; }
    .pfe-label { font-size: 11px; color: var(--pfe-muted, #888); white-space: nowrap; }
    .pfe-size-val { font-size: 12px; font-weight: 600; min-width: 18px; text-align: center; color: var(--pfe-text, #222); }
    .pfe-zoom-val { font-size: 12px; font-weight: 600; min-width: 44px; text-align: center; color: var(--pfe-text, #222); }

    .pfe-slider {
      -webkit-appearance: none; appearance: none;
      height: 4px; width: 80px;
      border-radius: 2px; background: var(--pfe-border, #e0e0e0);
      outline: none; cursor: pointer;
    }
    .pfe-slider::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 14px; height: 14px; border-radius: 50%;
      background: var(--pfe-accent, #1e88e5); cursor: pointer;
      transition: transform .15s;
    }
    .pfe-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

    /* Action buttons */
    .pfe-action-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 12px;
      border: 1px solid var(--pfe-border, #e0e0e0); border-radius: 8px;
      background: transparent; cursor: pointer;
      font-size: 13px; font-weight: 500; color: var(--pfe-text, #333);
      transition: background .15s, border-color .15s, transform .1s;
      white-space: nowrap;
    }
    .pfe-action-btn:hover { background: var(--pfe-hover, #f0f4ff); border-color: var(--pfe-accent, #1e88e5); }
    .pfe-action-btn:active { transform: scale(.97); }
    .pfe-action-btn--primary {
      background: var(--pfe-accent, #1e88e5);
      border-color: var(--pfe-accent, #1e88e5);
      color: #fff;
    }
    .pfe-action-btn--primary:hover { background: var(--pfe-accent-hover, #1565c0); }
    .pfe-action-btn--danger { color: #e53935; border-color: #e53935; }
    .pfe-action-btn--danger:hover { background: #ffebee; border-color: #e53935; }
    .pfe-action-label { white-space: nowrap; }

    /* Page navigation */
    .pfe-toolbar__pages { gap: 2px; }
    .pfe-page-indicator {
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; font-weight: 500; color: var(--pfe-text, #222);
    }
    .pfe-page-input {
      width: 36px; text-align: center;
      border: 1px solid var(--pfe-border, #e0e0e0); border-radius: 6px;
      padding: 2px 4px; font-size: 12px; font-weight: 600;
      background: transparent; color: var(--pfe-text, #222);
      -moz-appearance: textfield;
    }
    .pfe-page-input::-webkit-inner-spin-button,
    .pfe-page-input::-webkit-outer-spin-button { -webkit-appearance: none; }
    .pfe-page-input:focus { outline: none; border-color: var(--pfe-accent, #1e88e5); }
    .pfe-page-sep { color: var(--pfe-muted, #888); white-space: nowrap; }

    .pfe-tool-btn:disabled { opacity: .35; cursor: not-allowed; pointer-events: none; }
  `],
})
export class PdfToolbarComponent {
  @Input() config?: ToolbarConfig;
  @Input() zoom = signal(1);
  @Input() colors = signal(['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#000000', '#ffffff']);
  @Input() currentPage = signal(1);
  @Input() pageCount = signal(0);
  @Input() canUndo: Signal<boolean> = signal(false);
  @Input() canRedo: Signal<boolean> = signal(false);

  @Output() save = new EventEmitter<void>();
  @Output() upload = new EventEmitter<void>();
  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() zoomReset = new EventEmitter<void>();
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() goToPage = new EventEmitter<number>();
  @Output() undo = new EventEmitter<void>();
  @Output() redo = new EventEmitter<void>();

  readonly toolService = inject(ToolService);
  readonly icons = ICONS;

  get visibleTools(): ToolDef[] {
    const allowed = this.config?.tools;
    return allowed ? ALL_TOOLS.filter(t => allowed.includes(t.type)) : ALL_TOOLS;
  }

  selectTool(t: ToolType): void { this.toolService.setTool(t); }
  selectColor(c: string): void { this.toolService.setColor(c); }
  onCustomColor(e: Event): void { this.toolService.setColor((e.target as HTMLInputElement).value); }
  onSize(e: Event): void { this.toolService.setSize(Number((e.target as HTMLInputElement).value)); }

  onPageInput(e: Event): void {
    const val = Number((e.target as HTMLInputElement).value);
    if (val >= 1 && val <= this.pageCount()) this.goToPage.emit(val);
  }
}
