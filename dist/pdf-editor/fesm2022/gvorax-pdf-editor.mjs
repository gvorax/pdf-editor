import * as i0 from '@angular/core';
import { signal, computed, Injectable, inject, Pipe, EventEmitter, Output, Input, Component, effect, ViewChild, InjectionToken, ApplicationRef, ElementRef, ViewChildren, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

var ToolType;
(function (ToolType) {
    ToolType["Select"] = "select";
    ToolType["Pen"] = "pen";
    ToolType["Highlighter"] = "highlighter";
    ToolType["Text"] = "text";
    ToolType["Rectangle"] = "rectangle";
    ToolType["Circle"] = "circle";
    ToolType["Arrow"] = "arrow";
    ToolType["Line"] = "line";
    ToolType["Eraser"] = "eraser";
})(ToolType || (ToolType = {}));
const DEFAULT_TOOL_OPTIONS = {
    color: '#e53935',
    size: 3,
    opacity: 1,
    fontSize: 16,
    fontFamily: 'Inter, sans-serif',
};
const DEFAULT_COLORS = [
    '#e53935', '#fb8c00', '#fdd835', '#43a047',
    '#1e88e5', '#8e24aa', '#000000', '#ffffff',
];

const DEFAULT_CONFIG = {
    theme: 'light',
    toolbar: { position: 'top', tools: Object.values(ToolType), show: true, showSave: true },
    defaultTool: ToolType.Pen,
    defaultColor: '#e53935',
    colors: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#000000', '#ffffff'],
    zoom: { min: 0.5, max: 3, default: 1, step: 0.25 },
    pageGap: 16,
    cssVars: {},
};

class ToolService {
    activeTool = signal(ToolType.Pen, ...(ngDevMode ? [{ debugName: "activeTool" }] : /* istanbul ignore next */ []));
    options = signal({ ...DEFAULT_TOOL_OPTIONS }, ...(ngDevMode ? [{ debugName: "options" }] : /* istanbul ignore next */ []));
    isDrawingTool = computed(() => {
        const t = this.activeTool();
        return [ToolType.Pen, ToolType.Highlighter, ToolType.Rectangle,
            ToolType.Circle, ToolType.Arrow, ToolType.Line].includes(t);
    }, ...(ngDevMode ? [{ debugName: "isDrawingTool" }] : /* istanbul ignore next */ []));
    setTool(tool) {
        this.activeTool.set(tool);
    }
    setColor(color) {
        this.options.update(o => ({ ...o, color }));
    }
    setSize(size) {
        this.options.update(o => ({ ...o, size }));
    }
    setOpacity(opacity) {
        this.options.update(o => ({ ...o, opacity }));
    }
    setFontSize(fontSize) {
        this.options.update(o => ({ ...o, fontSize }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: ToolService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: ToolService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: ToolService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class SafeHtmlPipe {
    sanitizer = inject(DomSanitizer);
    transform(value) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: SafeHtmlPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.2.13", ngImport: i0, type: SafeHtmlPipe, isStandalone: true, name: "safeHtml" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: SafeHtmlPipe, decorators: [{
            type: Pipe,
            args: [{ name: 'safeHtml', standalone: true }]
        }] });

// ── SVG icon helpers ─────────────────────────────────────────────────────────
function svg(inner) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`;
}
const ICONS = {
    chevronLeft: svg(`<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    chevronRight: svg(`<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    select: svg(`<path d="M4 4l7 18 3-7 7-3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`),
    pen: svg(`<path d="M3 21l4-1.5L19.5 8l-2.5-2.5L4.5 17zM17 5.5l2.5 2.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`),
    highlight: svg(`<path d="m9 11-6 6v3h9l3-3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    text: svg(`<path d="M4 7V4h16v3M12 4v16M9 20h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`),
    rect: svg(`<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>`),
    circle: svg(`<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/>`),
    arrow: svg(`<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    line: svg(`<path d="M4 20L20 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
    eraser: svg(`<path d="M20 20H7L3 16l11-11 6 6-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    palette: svg(`<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.5 12 3c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
    zoomIn: svg(`<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M11 8v6M8 11h6M20 20l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
    zoomOut: svg(`<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 11h6M20 20l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
    undo: svg(`<path d="M3 10h11a5 5 0 0 1 0 10H9M3 10l4-4M3 10l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    redo: svg(`<path d="M21 10H10a5 5 0 0 0 0 10h5M21 10l-4-4M21 10l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    zoomFit: svg(`<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>`),
    save: svg(`<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`),
    upload: svg(`<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
};
const ALL_TOOLS = [
    { type: ToolType.Select, label: 'Tanlash', icon: ICONS.select },
    { type: ToolType.Pen, label: 'Qalam', icon: ICONS.pen },
    { type: ToolType.Highlighter, label: 'Marker', icon: ICONS.highlight },
    { type: ToolType.Text, label: 'Matn', icon: ICONS.text },
    { type: ToolType.Rectangle, label: "To'rtburchak", icon: ICONS.rect },
    { type: ToolType.Circle, label: 'Doira', icon: ICONS.circle },
    { type: ToolType.Arrow, label: "O'q", icon: ICONS.arrow },
    { type: ToolType.Line, label: 'Chiziq', icon: ICONS.line },
    { type: ToolType.Eraser, label: "O'chirish", icon: ICONS.eraser },
];
class PdfToolbarComponent {
    config;
    zoom = signal(1, ...(ngDevMode ? [{ debugName: "zoom" }] : /* istanbul ignore next */ []));
    colors = signal(['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#000000', '#ffffff'], ...(ngDevMode ? [{ debugName: "colors" }] : /* istanbul ignore next */ []));
    currentPage = signal(1, ...(ngDevMode ? [{ debugName: "currentPage" }] : /* istanbul ignore next */ []));
    pageCount = signal(0, ...(ngDevMode ? [{ debugName: "pageCount" }] : /* istanbul ignore next */ []));
    canUndo = signal(false, ...(ngDevMode ? [{ debugName: "canUndo" }] : /* istanbul ignore next */ []));
    canRedo = signal(false, ...(ngDevMode ? [{ debugName: "canRedo" }] : /* istanbul ignore next */ []));
    save = new EventEmitter();
    upload = new EventEmitter();
    zoomIn = new EventEmitter();
    zoomOut = new EventEmitter();
    zoomReset = new EventEmitter();
    prevPage = new EventEmitter();
    nextPage = new EventEmitter();
    goToPage = new EventEmitter();
    undo = new EventEmitter();
    redo = new EventEmitter();
    toolService = inject(ToolService);
    icons = ICONS;
    get visibleTools() {
        const allowed = this.config?.tools;
        return allowed ? ALL_TOOLS.filter(t => allowed.includes(t.type)) : ALL_TOOLS;
    }
    selectTool(t) { this.toolService.setTool(t); }
    selectColor(c) { this.toolService.setColor(c); }
    onCustomColor(e) { this.toolService.setColor(e.target.value); }
    onSize(e) { this.toolService.setSize(Number(e.target.value)); }
    onPageInput(e) {
        const val = Number(e.target.value);
        if (val >= 1 && val <= this.pageCount())
            this.goToPage.emit(val);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfToolbarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.13", type: PdfToolbarComponent, isStandalone: true, selector: "pdf-toolbar", inputs: { config: "config", zoom: "zoom", colors: "colors", currentPage: "currentPage", pageCount: "pageCount", canUndo: "canUndo", canRedo: "canRedo" }, outputs: { save: "save", upload: "upload", zoomIn: "zoomIn", zoomOut: "zoomOut", zoomReset: "zoomReset", prevPage: "prevPage", nextPage: "nextPage", goToPage: "goToPage", undo: "undo", redo: "redo" }, ngImport: i0, template: `
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
  `, isInline: true, styles: [".pfe-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:8px 14px;background:var(--pfe-toolbar-bg, #fff);border-bottom:1px solid var(--pfe-border, #e0e0e0);box-shadow:var(--pfe-toolbar-shadow, 0 2px 8px rgba(0,0,0,.06));flex-shrink:0;z-index:20;-webkit-user-select:none;user-select:none}.pfe-toolbar--bottom{border-bottom:none;border-top:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--left,.pfe-toolbar--right{flex-direction:column;align-items:stretch;padding:12px 8px;border-bottom:none;height:100%;overflow-y:auto;width:60px}.pfe-toolbar--left{border-right:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--right{border-left:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar__group{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.pfe-toolbar--left .pfe-toolbar__group,.pfe-toolbar--right .pfe-toolbar__group{flex-direction:column;align-items:center}.pfe-divider{width:1px;height:28px;background:var(--pfe-border, #e0e0e0);margin:0 6px;flex-shrink:0}.pfe-toolbar--left .pfe-divider,.pfe-toolbar--right .pfe-divider{width:100%;height:1px;margin:6px 0}.pfe-tool-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:8px;background:transparent;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s,color .15s,transform .1s;padding:0;flex-shrink:0}.pfe-tool-btn:hover{background:var(--pfe-hover, #f0f4ff);color:var(--pfe-accent, #1e88e5)}.pfe-tool-btn--active{background:var(--pfe-accent, #1e88e5)!important;color:#fff!important}.pfe-tool-btn:active{transform:scale(.92)}.pfe-icon{display:flex;width:20px;height:20px;pointer-events:none}.pfe-icon svg{width:100%;height:100%}.pfe-toolbar__colors{flex-wrap:wrap;max-width:200px}.pfe-color-dot{width:22px;height:22px;border-radius:50%;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:transform .15s,border-color .15s}.pfe-color-dot:hover{transform:scale(1.2)}.pfe-color-dot--active{border-color:var(--pfe-accent, #1e88e5);box-shadow:0 0 0 2px #fff,0 0 0 4px var(--pfe-accent, #1e88e5)}.pfe-color-pick{position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s}.pfe-color-pick:hover{background:var(--pfe-hover, #f0f4ff)}.pfe-color-pick input[type=color]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}.pfe-toolbar__size{gap:8px}.pfe-label{font-size:11px;color:var(--pfe-muted, #888);white-space:nowrap}.pfe-size-val{font-size:12px;font-weight:600;min-width:18px;text-align:center;color:var(--pfe-text, #222)}.pfe-zoom-val{font-size:12px;font-weight:600;min-width:44px;text-align:center;color:var(--pfe-text, #222)}.pfe-slider{-webkit-appearance:none;appearance:none;height:4px;width:80px;border-radius:2px;background:var(--pfe-border, #e0e0e0);outline:none;cursor:pointer}.pfe-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--pfe-accent, #1e88e5);cursor:pointer;transition:transform .15s}.pfe-slider::-webkit-slider-thumb:hover{transform:scale(1.2)}.pfe-action-btn{display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid var(--pfe-border, #e0e0e0);border-radius:8px;background:transparent;cursor:pointer;font-size:13px;font-weight:500;color:var(--pfe-text, #333);transition:background .15s,border-color .15s,transform .1s;white-space:nowrap}.pfe-action-btn:hover{background:var(--pfe-hover, #f0f4ff);border-color:var(--pfe-accent, #1e88e5)}.pfe-action-btn:active{transform:scale(.97)}.pfe-action-btn--primary{background:var(--pfe-accent, #1e88e5);border-color:var(--pfe-accent, #1e88e5);color:#fff}.pfe-action-btn--primary:hover{background:var(--pfe-accent-hover, #1565c0)}.pfe-action-btn--danger{color:#e53935;border-color:#e53935}.pfe-action-btn--danger:hover{background:#ffebee;border-color:#e53935}.pfe-action-label{white-space:nowrap}.pfe-toolbar__pages{gap:2px}.pfe-page-indicator{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--pfe-text, #222)}.pfe-page-input{width:36px;text-align:center;border:1px solid var(--pfe-border, #e0e0e0);border-radius:6px;padding:2px 4px;font-size:12px;font-weight:600;background:transparent;color:var(--pfe-text, #222);-moz-appearance:textfield}.pfe-page-input::-webkit-inner-spin-button,.pfe-page-input::-webkit-outer-spin-button{-webkit-appearance:none}.pfe-page-input:focus{outline:none;border-color:var(--pfe-accent, #1e88e5)}.pfe-page-sep{color:var(--pfe-muted, #888);white-space:nowrap}.pfe-tool-btn:disabled{opacity:.35;cursor:not-allowed;pointer-events:none}\n"], dependencies: [{ kind: "pipe", type: DecimalPipe, name: "number" }, { kind: "pipe", type: SafeHtmlPipe, name: "safeHtml" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfToolbarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-toolbar', standalone: true, imports: [DecimalPipe, SafeHtmlPipe], template: `
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
  `, styles: [".pfe-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:8px 14px;background:var(--pfe-toolbar-bg, #fff);border-bottom:1px solid var(--pfe-border, #e0e0e0);box-shadow:var(--pfe-toolbar-shadow, 0 2px 8px rgba(0,0,0,.06));flex-shrink:0;z-index:20;-webkit-user-select:none;user-select:none}.pfe-toolbar--bottom{border-bottom:none;border-top:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--left,.pfe-toolbar--right{flex-direction:column;align-items:stretch;padding:12px 8px;border-bottom:none;height:100%;overflow-y:auto;width:60px}.pfe-toolbar--left{border-right:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--right{border-left:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar__group{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.pfe-toolbar--left .pfe-toolbar__group,.pfe-toolbar--right .pfe-toolbar__group{flex-direction:column;align-items:center}.pfe-divider{width:1px;height:28px;background:var(--pfe-border, #e0e0e0);margin:0 6px;flex-shrink:0}.pfe-toolbar--left .pfe-divider,.pfe-toolbar--right .pfe-divider{width:100%;height:1px;margin:6px 0}.pfe-tool-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:8px;background:transparent;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s,color .15s,transform .1s;padding:0;flex-shrink:0}.pfe-tool-btn:hover{background:var(--pfe-hover, #f0f4ff);color:var(--pfe-accent, #1e88e5)}.pfe-tool-btn--active{background:var(--pfe-accent, #1e88e5)!important;color:#fff!important}.pfe-tool-btn:active{transform:scale(.92)}.pfe-icon{display:flex;width:20px;height:20px;pointer-events:none}.pfe-icon svg{width:100%;height:100%}.pfe-toolbar__colors{flex-wrap:wrap;max-width:200px}.pfe-color-dot{width:22px;height:22px;border-radius:50%;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:transform .15s,border-color .15s}.pfe-color-dot:hover{transform:scale(1.2)}.pfe-color-dot--active{border-color:var(--pfe-accent, #1e88e5);box-shadow:0 0 0 2px #fff,0 0 0 4px var(--pfe-accent, #1e88e5)}.pfe-color-pick{position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s}.pfe-color-pick:hover{background:var(--pfe-hover, #f0f4ff)}.pfe-color-pick input[type=color]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}.pfe-toolbar__size{gap:8px}.pfe-label{font-size:11px;color:var(--pfe-muted, #888);white-space:nowrap}.pfe-size-val{font-size:12px;font-weight:600;min-width:18px;text-align:center;color:var(--pfe-text, #222)}.pfe-zoom-val{font-size:12px;font-weight:600;min-width:44px;text-align:center;color:var(--pfe-text, #222)}.pfe-slider{-webkit-appearance:none;appearance:none;height:4px;width:80px;border-radius:2px;background:var(--pfe-border, #e0e0e0);outline:none;cursor:pointer}.pfe-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--pfe-accent, #1e88e5);cursor:pointer;transition:transform .15s}.pfe-slider::-webkit-slider-thumb:hover{transform:scale(1.2)}.pfe-action-btn{display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid var(--pfe-border, #e0e0e0);border-radius:8px;background:transparent;cursor:pointer;font-size:13px;font-weight:500;color:var(--pfe-text, #333);transition:background .15s,border-color .15s,transform .1s;white-space:nowrap}.pfe-action-btn:hover{background:var(--pfe-hover, #f0f4ff);border-color:var(--pfe-accent, #1e88e5)}.pfe-action-btn:active{transform:scale(.97)}.pfe-action-btn--primary{background:var(--pfe-accent, #1e88e5);border-color:var(--pfe-accent, #1e88e5);color:#fff}.pfe-action-btn--primary:hover{background:var(--pfe-accent-hover, #1565c0)}.pfe-action-btn--danger{color:#e53935;border-color:#e53935}.pfe-action-btn--danger:hover{background:#ffebee;border-color:#e53935}.pfe-action-label{white-space:nowrap}.pfe-toolbar__pages{gap:2px}.pfe-page-indicator{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--pfe-text, #222)}.pfe-page-input{width:36px;text-align:center;border:1px solid var(--pfe-border, #e0e0e0);border-radius:6px;padding:2px 4px;font-size:12px;font-weight:600;background:transparent;color:var(--pfe-text, #222);-moz-appearance:textfield}.pfe-page-input::-webkit-inner-spin-button,.pfe-page-input::-webkit-outer-spin-button{-webkit-appearance:none}.pfe-page-input:focus{outline:none;border-color:var(--pfe-accent, #1e88e5)}.pfe-page-sep{color:var(--pfe-muted, #888);white-space:nowrap}.pfe-tool-btn:disabled{opacity:.35;cursor:not-allowed;pointer-events:none}\n"] }]
        }], propDecorators: { config: [{
                type: Input
            }], zoom: [{
                type: Input
            }], colors: [{
                type: Input
            }], currentPage: [{
                type: Input
            }], pageCount: [{
                type: Input
            }], canUndo: [{
                type: Input
            }], canRedo: [{
                type: Input
            }], save: [{
                type: Output
            }], upload: [{
                type: Output
            }], zoomIn: [{
                type: Output
            }], zoomOut: [{
                type: Output
            }], zoomReset: [{
                type: Output
            }], prevPage: [{
                type: Output
            }], nextPage: [{
                type: Output
            }], goToPage: [{
                type: Output
            }], undo: [{
                type: Output
            }], redo: [{
                type: Output
            }] } });

class AnnotationService {
    store = new Map(); // pageIndex → Fabric JSON
    isDirty = signal(false, ...(ngDevMode ? [{ debugName: "isDirty" }] : /* istanbul ignore next */ []));
    savePageJson(pageIndex, json) {
        this.store.set(pageIndex, json);
        this.isDirty.set(true);
    }
    getPageJson(pageIndex) {
        return this.store.get(pageIndex) ?? null;
    }
    exportSession() {
        const pages = [];
        this.store.forEach((fabricJson, pageIndex) => {
            pages.push({ pageIndex, fabricJson });
        });
        return { pages, createdAt: Date.now() };
    }
    importSession(session) {
        this.store.clear();
        for (const p of session.pages) {
            this.store.set(p.pageIndex, p.fabricJson);
        }
        this.isDirty.set(false);
    }
    clearPage(pageIndex) {
        this.store.delete(pageIndex);
        this.isDirty.set(true);
    }
    clearAll() {
        this.store.clear();
        this.isDirty.set(false);
    }
    hasAnnotations() {
        return this.store.size > 0;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: AnnotationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: AnnotationService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: AnnotationService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class HistoryService {
    undoStack = [];
    redoStack = [];
    canUndo = signal(false, ...(ngDevMode ? [{ debugName: "canUndo" }] : /* istanbul ignore next */ []));
    canRedo = signal(false, ...(ngDevMode ? [{ debugName: "canRedo" }] : /* istanbul ignore next */ []));
    push(pageIndex, beforeState) {
        this.undoStack.push({ pageIndex, state: beforeState });
        if (this.undoStack.length > 50)
            this.undoStack.shift();
        this.redoStack = [];
        this.canUndo.set(true);
        this.canRedo.set(false);
    }
    popUndo() {
        const e = this.undoStack.pop();
        this.canUndo.set(this.undoStack.length > 0);
        return e;
    }
    pushUndo(pageIndex, state) {
        this.undoStack.push({ pageIndex, state });
        if (this.undoStack.length > 50)
            this.undoStack.shift();
        this.canUndo.set(true);
    }
    pushRedo(pageIndex, state) {
        this.redoStack.push({ pageIndex, state });
        this.canRedo.set(true);
    }
    popRedo() {
        const e = this.redoStack.pop();
        this.canRedo.set(this.redoStack.length > 0);
        return e;
    }
    clear() {
        this.undoStack = [];
        this.redoStack = [];
        this.canUndo.set(false);
        this.canRedo.set(false);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: HistoryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: HistoryService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: HistoryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class PdfCanvasComponent {
    canvasRef;
    pageIndex;
    width = 0;
    height = 0;
    fc = null;
    // Fabric module cached after first dynamic import
    fab;
    drawingShape = false;
    shapeOrigin = null;
    activeShape = null;
    pendingUndo = null;
    isUndoRedoing = false;
    keydownHandler = (e) => {
        if (e.key !== 'Delete' && e.key !== 'Backspace')
            return;
        const tool = this.toolService.activeTool();
        if (tool !== ToolType.Select && tool !== ToolType.Eraser)
            return;
        if (!this.fc)
            return;
        const targets = this.fc.getActiveObjects();
        if (!targets.length)
            return;
        if (targets.some((o) => o.isEditing))
            return;
        e.preventDefault();
        this.markDirty();
        targets.forEach(o => this.fc.remove(o));
        this.fc.discardActiveObject();
        this.fc.requestRenderAll();
    };
    toolService = inject(ToolService);
    annotationService = inject(AnnotationService);
    historyService = inject(HistoryService);
    toolEffect = effect(() => {
        const tool = this.toolService.activeTool();
        const opts = this.toolService.options();
        if (this.fc)
            this.applyTool(tool, opts);
    }, ...(ngDevMode ? [{ debugName: "toolEffect" }] : /* istanbul ignore next */ []));
    async ngAfterViewInit() {
        // Dynamic import — Vite will not include fabric in its pre-bundle pass
        this.fab = await import('fabric');
        const el = this.canvasRef.nativeElement;
        el.width = this.width;
        el.height = this.height;
        this.fc = new this.fab.Canvas(el, {
            isDrawingMode: false,
            selection: false,
            enableRetinaScaling: false,
        });
        this.fc.on('object:added', (e) => { if (e.target)
            this.attachDeleteControl(e.target); this.persist(); });
        this.fc.on('object:modified', () => this.persist());
        this.fc.on('object:removed', () => this.persist());
        this.fc.on('mouse:down', (e) => this.onMouseDown(e));
        this.fc.on('mouse:move', (e) => this.onMouseMove(e));
        this.fc.on('mouse:up', () => this.onMouseUp());
        document.addEventListener('keydown', this.keydownHandler);
        this.loadSavedAnnotations();
        this.applyTool(this.toolService.activeTool(), this.toolService.options());
    }
    ngOnChanges(changes) {
        const wChange = changes['width'];
        if (!wChange || wChange.firstChange || !this.fc)
            return;
        const oldW = wChange.previousValue;
        const newW = wChange.currentValue;
        if (!oldW || oldW === newW)
            return;
        const ratio = newW / oldW;
        this.fc.setDimensions({ width: this.width, height: this.height });
        this.fc.getObjects().forEach(obj => {
            obj.set({
                left: (obj.left ?? 0) * ratio,
                top: (obj.top ?? 0) * ratio,
                scaleX: (obj.scaleX ?? 1) * ratio,
                scaleY: (obj.scaleY ?? 1) * ratio,
            });
            obj.setCoords();
        });
        this.fc.renderAll();
        this.isUndoRedoing = true;
        this.persist();
        this.isUndoRedoing = false;
    }
    loadSavedAnnotations() {
        const saved = this.annotationService.getPageJson(this.pageIndex);
        if (saved) {
            this.isUndoRedoing = true;
            this.fc.loadFromJSON(JSON.parse(saved)).then(() => {
                this.fc?.getObjects().forEach(o => this.attachDeleteControl(o));
                this.fc?.renderAll();
                this.isUndoRedoing = false;
            });
        }
    }
    applyTool(tool, opts) {
        if (!this.fc || !this.fab)
            return;
        this.fc.isDrawingMode = false;
        const isInteractive = tool === ToolType.Select || tool === ToolType.Eraser;
        this.fc.selection = isInteractive;
        this.fc.getObjects().forEach(o => o.set({ selectable: isInteractive, evented: isInteractive }));
        switch (tool) {
            case ToolType.Pen:
                this.fc.isDrawingMode = true;
                this.fc.freeDrawingBrush = new this.fab.PencilBrush(this.fc);
                this.fc.freeDrawingBrush.color = opts.color;
                this.fc.freeDrawingBrush.width = opts.size;
                break;
            case ToolType.Highlighter:
                this.fc.isDrawingMode = true;
                this.fc.freeDrawingBrush = new this.fab.PencilBrush(this.fc);
                this.fc.freeDrawingBrush.color = this.toRgba(opts.color, 0.4);
                this.fc.freeDrawingBrush.width = Math.max(opts.size * 6, 20);
                break;
            case ToolType.Select:
            case ToolType.Eraser:
                this.fc.getObjects().forEach(o => this.attachDeleteControl(o));
                this.fc.renderAll();
                break;
        }
    }
    attachDeleteControl(obj) {
        if (!this.fab || obj.__deleteAdded)
            return;
        obj.__deleteAdded = true;
        const ctrl = new this.fab.Control({
            x: 0.5,
            y: -0.5,
            offsetX: 16,
            offsetY: -16,
            cursorStyle: 'pointer',
            mouseUpHandler: (_e, transform) => {
                this.markDirty();
                this.fc.remove(transform.target);
                this.fc.requestRenderAll();
                return true;
            },
            render: (ctx, left, top) => {
                ctx.save();
                ctx.translate(left, top);
                ctx.fillStyle = '#e53935';
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(-4, -4);
                ctx.lineTo(4, 4);
                ctx.moveTo(4, -4);
                ctx.lineTo(-4, 4);
                ctx.stroke();
                ctx.restore();
            },
        });
        obj.controls = { ...obj.controls, deleteControl: ctrl };
    }
    markDirty() {
        if (this.isUndoRedoing || !this.fc)
            return;
        this.pendingUndo = JSON.stringify(this.fc.toJSON());
    }
    onMouseDown(e) {
        this.markDirty();
        if (!this.fab)
            return;
        const tool = this.toolService.activeTool();
        const opts = this.toolService.options();
        const pt = e.scenePoint;
        if (tool === ToolType.Text) {
            const tb = new this.fab.Textbox('Text', {
                left: pt.x, top: pt.y,
                fontSize: opts.fontSize,
                fill: opts.color,
                fontFamily: opts.fontFamily,
                width: 200,
            });
            this.fc.add(tb);
            this.fc.setActiveObject(tb);
            tb.enterEditing?.();
            return;
        }
        const shapeTools = [ToolType.Rectangle, ToolType.Circle, ToolType.Arrow, ToolType.Line];
        if (!shapeTools.includes(tool))
            return;
        this.drawingShape = true;
        this.shapeOrigin = { x: pt.x, y: pt.y };
        const { color, size } = opts;
        switch (tool) {
            case ToolType.Rectangle:
                this.activeShape = new this.fab.Rect({
                    left: pt.x, top: pt.y, width: 0, height: 0,
                    originX: 'center', originY: 'center',
                    fill: 'transparent', stroke: color, strokeWidth: size, selectable: false,
                });
                break;
            case ToolType.Circle:
                this.activeShape = new this.fab.Ellipse({
                    left: pt.x, top: pt.y, rx: 0, ry: 0,
                    originX: 'center', originY: 'center',
                    fill: 'transparent', stroke: color, strokeWidth: size, selectable: false,
                });
                break;
            case ToolType.Line:
            case ToolType.Arrow:
                this.activeShape = new this.fab.Line([pt.x, pt.y, pt.x, pt.y], {
                    stroke: color, strokeWidth: size, selectable: false,
                });
                break;
        }
        if (this.activeShape)
            this.fc.add(this.activeShape);
    }
    onMouseMove(e) {
        if (!this.drawingShape || !this.activeShape || !this.shapeOrigin)
            return;
        const pt = e.scenePoint;
        const o = this.shapeOrigin;
        const tool = this.toolService.activeTool();
        switch (tool) {
            case ToolType.Rectangle:
                this.activeShape.set({
                    left: (o.x + pt.x) / 2, top: (o.y + pt.y) / 2,
                    width: Math.abs(pt.x - o.x), height: Math.abs(pt.y - o.y),
                });
                break;
            case ToolType.Circle:
                this.activeShape.set({
                    left: (o.x + pt.x) / 2, top: (o.y + pt.y) / 2,
                    rx: Math.abs(pt.x - o.x) / 2, ry: Math.abs(pt.y - o.y) / 2,
                });
                break;
            case ToolType.Line:
            case ToolType.Arrow:
                this.activeShape.set({ x2: pt.x, y2: pt.y });
                break;
        }
        this.fc.renderAll();
    }
    onMouseUp() {
        if (!this.drawingShape)
            return;
        this.drawingShape = false;
        if (this.activeShape && this.toolService.activeTool() === ToolType.Arrow) {
            this.addArrowhead(this.activeShape);
        }
        if (this.activeShape) {
            this.fc.renderAll();
            this.activeShape = null;
            this.persist();
        }
        this.shapeOrigin = null;
    }
    addArrowhead(line) {
        if (!this.fab)
            return;
        const { size, color } = this.toolService.options();
        const x1 = line.x1 ?? 0, y1 = line.y1 ?? 0;
        const x2 = line.x2 ?? 0, y2 = line.y2 ?? 0;
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        this.fc.add(new this.fab.Triangle({
            left: x2, top: y2, originX: 'center', originY: 'center',
            width: size * 5, height: size * 5, fill: color, angle: angle + 90, selectable: false,
        }));
    }
    persist() {
        if (!this.fc)
            return;
        const json = JSON.stringify(this.fc.toJSON());
        if (!this.isUndoRedoing && this.pendingUndo !== null) {
            this.historyService.push(this.pageIndex, this.pendingUndo);
            this.pendingUndo = null;
        }
        this.annotationService.savePageJson(this.pageIndex, json);
    }
    getCurrentState() {
        return this.fc ? JSON.stringify(this.fc.toJSON()) : '{}';
    }
    async restoreState(state) {
        if (!this.fc)
            return;
        this.isUndoRedoing = true;
        await this.fc.loadFromJSON(JSON.parse(state));
        this.fc.getObjects().forEach(o => this.attachDeleteControl(o));
        this.fc.renderAll();
        this.annotationService.savePageJson(this.pageIndex, state);
        this.isUndoRedoing = false;
    }
    toRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    getFabricCanvas() { return this.fc; }
    ngOnDestroy() {
        this.toolEffect.destroy();
        document.removeEventListener('keydown', this.keydownHandler);
        this.fc?.dispose();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfCanvasComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.13", type: PdfCanvasComponent, isStandalone: true, selector: "pdf-canvas", inputs: { pageIndex: "pageIndex", width: "width", height: "height" }, host: { classAttribute: "pdf-annotation-host" }, viewQueries: [{ propertyName: "canvasRef", first: true, predicate: ["fabricCanvas"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `<canvas #fabricCanvas></canvas>`, isInline: true, styles: [":host.pdf-annotation-host{position:absolute;inset:0;pointer-events:all}canvas{display:block}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfCanvasComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-canvas', standalone: true, template: `<canvas #fabricCanvas></canvas>`, host: { class: 'pdf-annotation-host' }, styles: [":host.pdf-annotation-host{position:absolute;inset:0;pointer-events:all}canvas{display:block}\n"] }]
        }], propDecorators: { canvasRef: [{
                type: ViewChild,
                args: ['fabricCanvas']
            }], pageIndex: [{
                type: Input,
                args: [{ required: true }]
            }], width: [{
                type: Input
            }], height: [{
                type: Input
            }] } });

const PDFJS_WORKER_URL = new InjectionToken('PDFJS_WORKER_URL', {
    providedIn: 'root',
    factory: () => '/pdf.worker.mjs',
});

class PdfRendererService {
    workerUrl = inject(PDFJS_WORKER_URL);
    pdfDoc = null;
    pdfWorker = null;
    pageCount = signal(0, ...(ngDevMode ? [{ debugName: "pageCount" }] : /* istanbul ignore next */ []));
    isLoading = signal(false, ...(ngDevMode ? [{ debugName: "isLoading" }] : /* istanbul ignore next */ []));
    error = signal(null, ...(ngDevMode ? [{ debugName: "error" }] : /* istanbul ignore next */ []));
    async loadFromFile(file) {
        this.isLoading.set(true);
        this.error.set(null);
        try {
            const buffer = await file.arrayBuffer();
            await this._load(buffer);
        }
        catch (e) {
            this.error.set(e.message);
        }
        finally {
            this.isLoading.set(false);
        }
    }
    async loadFromUrl(url) {
        this.isLoading.set(true);
        this.error.set(null);
        try {
            const resp = await fetch(url);
            const buffer = await resp.arrayBuffer();
            await this._load(buffer);
        }
        catch (e) {
            this.error.set(e.message);
        }
        finally {
            this.isLoading.set(false);
        }
    }
    async loadFromArrayBuffer(buffer) {
        this.isLoading.set(true);
        this.error.set(null);
        try {
            await this._load(buffer);
        }
        catch (e) {
            this.error.set(e.message);
        }
        finally {
            this.isLoading.set(false);
        }
    }
    async _load(buffer) {
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
    async getPage(pageNumber) {
        if (!this.pdfDoc)
            throw new Error('No PDF loaded');
        return this.pdfDoc.getPage(pageNumber);
    }
    async renderPage(pageNumber, canvas, scale = 1) {
        const page = await this.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, viewport }).promise;
        return { width: viewport.width, height: viewport.height };
    }
    getDocument() {
        return this.pdfDoc;
    }
    async destroy() {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfRendererService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfRendererService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfRendererService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class PdfViewerComponent {
    scale = 1;
    pageGap = 16;
    currentPageChange = new EventEmitter();
    renderCanvases;
    pageWrappers;
    canvasComps;
    rendererService = inject(PdfRendererService);
    appRef = inject(ApplicationRef);
    el = inject(ElementRef);
    pages = signal([], ...(ngDevMode ? [{ debugName: "pages" }] : /* istanbul ignore next */ []));
    currentPage = signal(1, ...(ngDevMode ? [{ debugName: "currentPage" }] : /* istanbul ignore next */ []));
    constructor() {
        effect(() => this.currentPageChange.emit(this.currentPage()));
    }
    viewInitialized = false;
    scrollEl = null;
    scrollHandler = () => this.updateCurrentPage();
    ngAfterViewInit() {
        this.viewInitialized = true;
        this.scrollEl = this.el.nativeElement.parentElement;
        this.scrollEl?.addEventListener('scroll', this.scrollHandler, { passive: true });
        if (this.rendererService.pageCount() > 0) {
            this.renderAllPages();
        }
    }
    ngOnChanges(changes) {
        if ((changes['scale'] || changes['pageGap']) && this.viewInitialized) {
            this.renderAllPages();
        }
    }
    ngOnDestroy() {
        this.scrollEl?.removeEventListener('scroll', this.scrollHandler);
    }
    updateCurrentPage() {
        if (!this.scrollEl)
            return;
        const containerTop = this.scrollEl.getBoundingClientRect().top;
        const wrappers = this.pageWrappers.toArray();
        let current = 0;
        for (let i = 0; i < wrappers.length; i++) {
            const rect = wrappers[i].nativeElement.getBoundingClientRect();
            if (rect.top - containerTop <= this.scrollEl.clientHeight * 0.4)
                current = i;
            else
                break;
        }
        this.currentPage.set(current + 1);
    }
    scrollToPage(pageIndex) {
        const el = this.pageWrappers.toArray()[pageIndex]?.nativeElement;
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    async renderAllPages() {
        const count = this.rendererService.pageCount();
        if (!count)
            return;
        // First pass: compute page sizes
        const pageInfos = [];
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
    getPageCanvas(pageIndex) {
        return this.renderCanvases.toArray()[pageIndex]?.nativeElement;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfViewerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.13", type: PdfViewerComponent, isStandalone: true, selector: "pdf-viewer", inputs: { scale: "scale", pageGap: "pageGap" }, outputs: { currentPageChange: "currentPageChange" }, viewQueries: [{ propertyName: "renderCanvases", predicate: ["renderCanvas"], descendants: true }, { propertyName: "pageWrappers", predicate: ["pageWrapper"], descendants: true }, { propertyName: "canvasComps", predicate: PdfCanvasComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: `
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
  `, isInline: true, styles: [".pdf-pages-container{display:flex;flex-direction:column;align-items:center;padding:24px;min-height:100%}.pdf-page-wrapper{position:relative;box-shadow:var(--pfe-page-shadow, 0 4px 24px rgba(0,0,0,.18));border-radius:var(--pfe-page-radius, 4px);overflow:hidden;background:#fff;flex-shrink:0}.pdf-render-canvas{display:block;width:100%;height:100%}pdf-canvas{position:absolute;inset:0}.pdf-loading{display:flex;flex-direction:column;align-items:center;gap:12px;padding:48px;color:var(--pfe-muted, #888)}.pdf-spinner{width:40px;height:40px;border:3px solid var(--pfe-accent, #1e88e5);border-top-color:transparent;border-radius:50%;animation:pfe-spin .8s linear infinite}@keyframes pfe-spin{to{transform:rotate(360deg)}}.pdf-error{padding:24px;color:#e53935;background:#ffebee;border-radius:8px;margin:24px}\n"], dependencies: [{ kind: "component", type: PdfCanvasComponent, selector: "pdf-canvas", inputs: ["pageIndex", "width", "height"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-viewer', standalone: true, imports: [PdfCanvasComponent], template: `
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
  `, styles: [".pdf-pages-container{display:flex;flex-direction:column;align-items:center;padding:24px;min-height:100%}.pdf-page-wrapper{position:relative;box-shadow:var(--pfe-page-shadow, 0 4px 24px rgba(0,0,0,.18));border-radius:var(--pfe-page-radius, 4px);overflow:hidden;background:#fff;flex-shrink:0}.pdf-render-canvas{display:block;width:100%;height:100%}pdf-canvas{position:absolute;inset:0}.pdf-loading{display:flex;flex-direction:column;align-items:center;gap:12px;padding:48px;color:var(--pfe-muted, #888)}.pdf-spinner{width:40px;height:40px;border:3px solid var(--pfe-accent, #1e88e5);border-top-color:transparent;border-radius:50%;animation:pfe-spin .8s linear infinite}@keyframes pfe-spin{to{transform:rotate(360deg)}}.pdf-error{padding:24px;color:#e53935;background:#ffebee;border-radius:8px;margin:24px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { scale: [{
                type: Input
            }], pageGap: [{
                type: Input
            }], currentPageChange: [{
                type: Output
            }], renderCanvases: [{
                type: ViewChildren,
                args: ['renderCanvas']
            }], pageWrappers: [{
                type: ViewChildren,
                args: ['pageWrapper']
            }], canvasComps: [{
                type: ViewChildren,
                args: [PdfCanvasComponent]
            }] } });

class ExportService {
    async exportPdf(pages, filename = 'annotated.pdf') {
        // Dynamic import — prevents Vite from bundling pdf-lib during optimization
        const { PDFDocument } = await import('pdf-lib');
        const pdfDoc = await PDFDocument.create();
        for (const { pdfCanvas, fabricCanvas } of pages) {
            const w = pdfCanvas.width;
            const h = pdfCanvas.height;
            const merged = document.createElement('canvas');
            merged.width = w;
            merged.height = h;
            const ctx = merged.getContext('2d');
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
        this._triggerDownload(bytes, filename);
    }
    _drawFabricOnContext(ctx, fc, targetW, targetH) {
        return new Promise(resolve => {
            const dataUrl = fc.toDataURL({ format: 'png', multiplier: 1, enableRetinaScaling: false });
            const img = new Image();
            img.onload = () => { ctx.drawImage(img, 0, 0, targetW, targetH); resolve(); };
            img.onerror = () => resolve();
            img.src = dataUrl;
        });
    }
    _canvasToPng(canvas) {
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf)));
            }, 'image/png');
        });
    }
    _triggerDownload(bytes, filename) {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: ExportService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: ExportService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: ExportService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class PdfEditorComponent {
    config = {};
    src;
    viewerRef;
    fileInputRef;
    rendererService = inject(PdfRendererService);
    exportService = inject(ExportService);
    toolService = inject(ToolService);
    historyService = inject(HistoryService);
    hostEl = inject(ElementRef);
    zoom = signal(1, ...(ngDevMode ? [{ debugName: "zoom" }] : /* istanbul ignore next */ []));
    paletteColors = signal([...DEFAULT_COLORS], ...(ngDevMode ? [{ debugName: "paletteColors" }] : /* istanbul ignore next */ []));
    currentPage = signal(1, ...(ngDevMode ? [{ debugName: "currentPage" }] : /* istanbul ignore next */ []));
    cfg = { ...DEFAULT_CONFIG };
    get isVertical() {
        const pos = this.cfg.toolbar?.position;
        return pos === 'left' || pos === 'right';
    }
    PDF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
    <line x1="9" y1="19" x2="11" y2="19"/>
  </svg>`;
    ngOnInit() {
        this.applyConfig();
        if (this.src)
            this.loadSrc(this.src);
    }
    ngOnChanges(changes) {
        if (changes['config'])
            this.applyConfig();
        if (changes['src'] && !changes['src'].firstChange && this.src)
            this.loadSrc(this.src);
    }
    applyConfig() {
        this.cfg = {
            ...DEFAULT_CONFIG,
            ...this.config,
            toolbar: { ...DEFAULT_CONFIG.toolbar, ...this.config.toolbar },
            zoom: { ...DEFAULT_CONFIG.zoom, ...this.config.zoom },
            cssVars: this.config.cssVars ?? {},
        };
        if (this.cfg.cssVars && Object.keys(this.cfg.cssVars).length) {
            const el = this.hostEl.nativeElement;
            Object.entries(this.cfg.cssVars).forEach(([k, v]) => el.style.setProperty(k, v));
        }
        if (this.cfg.colors?.length)
            this.paletteColors.set(this.cfg.colors);
        if (this.cfg.defaultColor)
            this.toolService.setColor(this.cfg.defaultColor);
        if (this.cfg.defaultTool)
            this.toolService.setTool(this.cfg.defaultTool);
        if (this.cfg.zoom?.default)
            this.zoom.set(this.cfg.zoom.default);
    }
    onKeydown(e) {
        const ctrl = e.ctrlKey || e.metaKey;
        if (!ctrl)
            return;
        if (e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            this.doUndo();
        }
        if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
            e.preventDefault();
            this.doRedo();
        }
    }
    async doUndo() {
        const entry = this.historyService.popUndo();
        if (!entry || !this.viewerRef)
            return;
        const canvas = this.viewerRef.canvasComps.toArray()[entry.pageIndex];
        if (!canvas)
            return;
        const currentState = canvas.getCurrentState();
        this.historyService.pushRedo(entry.pageIndex, currentState);
        await canvas.restoreState(entry.state);
    }
    async doRedo() {
        const entry = this.historyService.popRedo();
        if (!entry || !this.viewerRef)
            return;
        const canvas = this.viewerRef.canvasComps.toArray()[entry.pageIndex];
        if (!canvas)
            return;
        const currentState = canvas.getCurrentState();
        this.historyService.pushUndo(entry.pageIndex, currentState);
        await canvas.restoreState(entry.state);
    }
    async loadSrc(src) {
        if (typeof src === 'string') {
            await this.rendererService.loadFromUrl(src);
        }
        else if (src instanceof File) {
            await this.rendererService.loadFromFile(src);
        }
        else {
            await this.rendererService.loadFromArrayBuffer(src);
        }
        this.historyService.clear();
        this.currentPage.set(1);
        // Wait one tick for the viewer to be in the DOM
        await new Promise(r => setTimeout(r, 50));
        await this.viewerRef?.renderAllPages();
    }
    onUploadClick() { this.fileInputRef?.nativeElement.click(); }
    async onFileSelected(e) {
        const file = e.target.files?.[0];
        if (file)
            await this.loadSrc(file);
        e.target.value = '';
    }
    async onDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file?.type === 'application/pdf')
            await this.loadSrc(file);
    }
    async save() {
        if (!this.viewerRef)
            return;
        const count = this.rendererService.pageCount();
        const fabricComps = this.viewerRef.canvasComps.toArray();
        const pages = Array.from({ length: count }, (_, i) => ({
            pdfCanvas: this.viewerRef.getPageCanvas(i),
            fabricCanvas: fabricComps[i]?.getFabricCanvas() ?? null,
        })).filter(p => !!p.pdfCanvas);
        await this.exportService.exportPdf(pages);
    }
    onZoomIn() {
        const max = this.cfg.zoom.max ?? 3;
        const step = this.cfg.zoom.step ?? 0.25;
        this.zoom.update(z => Math.min(+(z + step).toFixed(2), max));
        // Angular propagates the new zoom() to PdfViewerComponent[scale],
        // which triggers ngOnChanges → renderAllPages() with the correct scale.
    }
    onZoomOut() {
        const min = this.cfg.zoom.min ?? 0.5;
        const step = this.cfg.zoom.step ?? 0.25;
        this.zoom.update(z => Math.max(+(z - step).toFixed(2), min));
    }
    onZoomReset() {
        this.zoom.set(this.cfg.zoom.default ?? 1);
    }
    onPrevPage() {
        const page = Math.max(1, this.currentPage() - 1);
        this.currentPage.set(page);
        this.viewerRef?.scrollToPage(page - 1);
    }
    onNextPage() {
        const max = this.rendererService.pageCount();
        const page = Math.min(max, this.currentPage() + 1);
        this.currentPage.set(page);
        this.viewerRef?.scrollToPage(page - 1);
    }
    onGoToPage(page) {
        const clamped = Math.max(1, Math.min(this.rendererService.pageCount(), page));
        this.currentPage.set(clamped);
        this.viewerRef?.scrollToPage(clamped - 1);
    }
    ngOnDestroy() { this.rendererService.destroy(); }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfEditorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.13", type: PdfEditorComponent, isStandalone: true, selector: "pdf-editor", inputs: { config: "config", src: "src" }, host: { listeners: { "document:keydown": "onKeydown($event)" } }, viewQueries: [{ propertyName: "viewerRef", first: true, predicate: ["viewer"], descendants: true }, { propertyName: "fileInputRef", first: true, predicate: ["fileInput"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
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
  `, isInline: true, styles: [":host{display:block;font-family:var(--pfe-font, Inter, system-ui, sans-serif);--pfe-bg: #f4f6f8;--pfe-toolbar-bg: #ffffff;--pfe-toolbar-shadow: 0 1px 4px rgba(0,0,0,.08);--pfe-border: #e2e8f0;--pfe-accent: #1e88e5;--pfe-accent-hover: #1565c0;--pfe-hover: #eff6ff;--pfe-text: #1a202c;--pfe-muted: #718096;--pfe-icon: #4a5568;--pfe-page-shadow: 0 4px 20px rgba(0,0,0,.12);--pfe-page-radius: 6px}:host-context(.pfe-theme--dark),.pfe-theme--dark{--pfe-bg: #0f172a;--pfe-toolbar-bg: #1e293b;--pfe-toolbar-shadow: 0 2px 12px rgba(0,0,0,.4);--pfe-border: #334155;--pfe-accent: #38bdf8;--pfe-accent-hover: #0284c7;--pfe-hover: #1e3a5f;--pfe-text: #e2e8f0;--pfe-muted: #94a3b8;--pfe-icon: #cbd5e1;--pfe-page-shadow: 0 4px 32px rgba(0,0,0,.5)}.pfe-host{display:flex;width:100%;height:100%;background:var(--pfe-bg);overflow:hidden;position:relative}.pfe-with-toolbar{display:flex;flex-direction:column;width:100%;height:100%;overflow:hidden}.pfe-toolbar-bottom{flex-direction:column-reverse}.pfe-with-sidebar{display:flex;flex-direction:row;width:100%;height:100%;overflow:hidden}.pfe-sidebar-right{flex-direction:row-reverse}.pfe-viewer-wrap{flex:1;overflow:auto;min-height:0;min-width:0}.pfe-viewer-wrap--full{width:100%;height:100%}.pfe-dropzone{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--pfe-bg);cursor:pointer;z-index:10}.pfe-dropzone__card{display:flex;flex-direction:column;align-items:center;gap:12px;padding:56px 72px;border:2px dashed var(--pfe-border);border-radius:20px;transition:border-color .2s,background .2s}.pfe-dropzone:hover .pfe-dropzone__card{border-color:var(--pfe-accent);background:var(--pfe-hover)}.pfe-dropzone__icon{width:72px;height:72px;color:var(--pfe-accent)}.pfe-dropzone__icon svg{width:100%;height:100%}.pfe-dropzone__title{font-size:18px;font-weight:600;color:var(--pfe-text);margin:0}.pfe-dropzone__hint{font-size:14px;color:var(--pfe-muted);margin:0}.pfe-dropzone__link{color:var(--pfe-accent);font-weight:500;text-decoration:underline}.pfe-loader{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#fffc;z-index:20;color:var(--pfe-muted);font-size:14px}.pfe-spinner{width:44px;height:44px;border:3px solid var(--pfe-border);border-top-color:var(--pfe-accent);border-radius:50%;animation:pfe-spin .8s linear infinite}@keyframes pfe-spin{to{transform:rotate(360deg)}}\n"], dependencies: [{ kind: "component", type: PdfToolbarComponent, selector: "pdf-toolbar", inputs: ["config", "zoom", "colors", "currentPage", "pageCount", "canUndo", "canRedo"], outputs: ["save", "upload", "zoomIn", "zoomOut", "zoomReset", "prevPage", "nextPage", "goToPage", "undo", "redo"] }, { kind: "component", type: PdfViewerComponent, selector: "pdf-viewer", inputs: ["scale", "pageGap"], outputs: ["currentPageChange"] }, { kind: "pipe", type: SafeHtmlPipe, name: "safeHtml" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.13", ngImport: i0, type: PdfEditorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pdf-editor', standalone: true, imports: [PdfToolbarComponent, PdfViewerComponent, SafeHtmlPipe], template: `
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
  `, styles: [":host{display:block;font-family:var(--pfe-font, Inter, system-ui, sans-serif);--pfe-bg: #f4f6f8;--pfe-toolbar-bg: #ffffff;--pfe-toolbar-shadow: 0 1px 4px rgba(0,0,0,.08);--pfe-border: #e2e8f0;--pfe-accent: #1e88e5;--pfe-accent-hover: #1565c0;--pfe-hover: #eff6ff;--pfe-text: #1a202c;--pfe-muted: #718096;--pfe-icon: #4a5568;--pfe-page-shadow: 0 4px 20px rgba(0,0,0,.12);--pfe-page-radius: 6px}:host-context(.pfe-theme--dark),.pfe-theme--dark{--pfe-bg: #0f172a;--pfe-toolbar-bg: #1e293b;--pfe-toolbar-shadow: 0 2px 12px rgba(0,0,0,.4);--pfe-border: #334155;--pfe-accent: #38bdf8;--pfe-accent-hover: #0284c7;--pfe-hover: #1e3a5f;--pfe-text: #e2e8f0;--pfe-muted: #94a3b8;--pfe-icon: #cbd5e1;--pfe-page-shadow: 0 4px 32px rgba(0,0,0,.5)}.pfe-host{display:flex;width:100%;height:100%;background:var(--pfe-bg);overflow:hidden;position:relative}.pfe-with-toolbar{display:flex;flex-direction:column;width:100%;height:100%;overflow:hidden}.pfe-toolbar-bottom{flex-direction:column-reverse}.pfe-with-sidebar{display:flex;flex-direction:row;width:100%;height:100%;overflow:hidden}.pfe-sidebar-right{flex-direction:row-reverse}.pfe-viewer-wrap{flex:1;overflow:auto;min-height:0;min-width:0}.pfe-viewer-wrap--full{width:100%;height:100%}.pfe-dropzone{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--pfe-bg);cursor:pointer;z-index:10}.pfe-dropzone__card{display:flex;flex-direction:column;align-items:center;gap:12px;padding:56px 72px;border:2px dashed var(--pfe-border);border-radius:20px;transition:border-color .2s,background .2s}.pfe-dropzone:hover .pfe-dropzone__card{border-color:var(--pfe-accent);background:var(--pfe-hover)}.pfe-dropzone__icon{width:72px;height:72px;color:var(--pfe-accent)}.pfe-dropzone__icon svg{width:100%;height:100%}.pfe-dropzone__title{font-size:18px;font-weight:600;color:var(--pfe-text);margin:0}.pfe-dropzone__hint{font-size:14px;color:var(--pfe-muted);margin:0}.pfe-dropzone__link{color:var(--pfe-accent);font-weight:500;text-decoration:underline}.pfe-loader{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#fffc;z-index:20;color:var(--pfe-muted);font-size:14px}.pfe-spinner{width:44px;height:44px;border:3px solid var(--pfe-border);border-top-color:var(--pfe-accent);border-radius:50%;animation:pfe-spin .8s linear infinite}@keyframes pfe-spin{to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { config: [{
                type: Input
            }], src: [{
                type: Input
            }], viewerRef: [{
                type: ViewChild,
                args: ['viewer']
            }], fileInputRef: [{
                type: ViewChild,
                args: ['fileInput']
            }], onKeydown: [{
                type: HostListener,
                args: ['document:keydown', ['$event']]
            }] } });

// Main component — the only import most consumers need

/**
 * Generated bundle index. Do not edit.
 */

export { AnnotationService, DEFAULT_COLORS, DEFAULT_CONFIG, DEFAULT_TOOL_OPTIONS, ExportService, HistoryService, PDFJS_WORKER_URL, PdfCanvasComponent, PdfEditorComponent, PdfRendererService, PdfToolbarComponent, PdfViewerComponent, ToolService, ToolType };
//# sourceMappingURL=gvorax-pdf-editor.mjs.map
