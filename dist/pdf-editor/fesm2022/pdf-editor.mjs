import * as i0 from '@angular/core';
import { signal, computed, Injectable, inject, Pipe, EventEmitter, Component, Output, Input, effect, ViewChild, InjectionToken, ApplicationRef, ElementRef, ViewChildren, HostListener } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as fabric from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

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
    toolbar: { position: 'top', tools: Object.values(ToolType), show: true },
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
    static ɵfac = function ToolService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ToolService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ToolService, factory: ToolService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ToolService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();

class SafeHtmlPipe {
    sanitizer = inject(DomSanitizer);
    transform(value) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    static ɵfac = function SafeHtmlPipe_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SafeHtmlPipe)(); };
    static ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "safeHtml", type: SafeHtmlPipe, pure: true });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SafeHtmlPipe, [{
        type: Pipe,
        args: [{ name: 'safeHtml', standalone: true }]
    }], null, null); })();

const _forTrack0$1 = ($index, $item) => $item.type;
function PdfToolbarComponent_For_3_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "button", 22);
    i0.ɵɵdomListener("click", function PdfToolbarComponent_For_3_Template_button_click_0_listener() { const tool_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectTool(tool_r2.type)); });
    i0.ɵɵdomElement(1, "span", 5);
    i0.ɵɵpipe(2, "safeHtml");
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const tool_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("pfe-tool-btn--active", ctx_r2.toolService.activeTool() === tool_r2.type);
    i0.ɵɵdomProperty("title", tool_r2.label);
    i0.ɵɵadvance();
    i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(2, 4, tool_r2.icon), i0.ɵɵsanitizeHtml);
} }
function PdfToolbarComponent_For_15_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "button", 23);
    i0.ɵɵdomListener("click", function PdfToolbarComponent_For_15_Template_button_click_0_listener() { const c_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectColor(c_r5)); });
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const c_r5 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("background", c_r5);
    i0.ɵɵclassProp("pfe-color-dot--active", ctx_r2.toolService.options().color === c_r5);
    i0.ɵɵdomProperty("title", c_r5);
} }
function PdfToolbarComponent_Conditional_41_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElement(0, "div", 3);
    i0.ɵɵdomElementStart(1, "div", 24)(2, "button", 25);
    i0.ɵɵdomListener("click", function PdfToolbarComponent_Conditional_41_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.prevPage.emit()); });
    i0.ɵɵdomElement(3, "span", 5);
    i0.ɵɵpipe(4, "safeHtml");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "span", 26)(6, "input", 27);
    i0.ɵɵdomListener("change", function PdfToolbarComponent_Conditional_41_Template_input_change_6_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onPageInput($event)); });
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(7, "span", 28);
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(9, "button", 29);
    i0.ɵɵdomListener("click", function PdfToolbarComponent_Conditional_41_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.nextPage.emit()); });
    i0.ɵɵdomElement(10, "span", 5);
    i0.ɵɵpipe(11, "safeHtml");
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵdomProperty("disabled", ctx_r2.currentPage() <= 1);
    i0.ɵɵadvance();
    i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(4, 8, ctx_r2.icons.chevronLeft), i0.ɵɵsanitizeHtml);
    i0.ɵɵadvance(3);
    i0.ɵɵdomProperty("min", 1)("max", ctx_r2.pageCount())("value", ctx_r2.currentPage());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("/ ", ctx_r2.pageCount());
    i0.ɵɵadvance();
    i0.ɵɵdomProperty("disabled", ctx_r2.currentPage() >= ctx_r2.pageCount());
    i0.ɵɵadvance();
    i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(11, 10, ctx_r2.icons.chevronRight), i0.ɵɵsanitizeHtml);
} }
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
    palette: svg(`<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/><circle cx="12" cy="15" r="1.2" fill="currentColor"/>`),
    zoomIn: svg(`<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M11 8v6M8 11h6M20 20l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
    zoomOut: svg(`<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 11h6M20 20l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
    undo: svg(`<path d="M3 10h11a5 5 0 0 1 0 10H9M3 10l4-4M3 10l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    redo: svg(`<path d="M21 10H10a5 5 0 0 0 0 10h5M21 10l-4-4M21 10l-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
    zoomFit: svg(`<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>`),
    save: svg(`<path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`),
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
    static ɵfac = function PdfToolbarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PdfToolbarComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PdfToolbarComponent, selectors: [["pdf-toolbar"]], inputs: { config: "config", zoom: "zoom", colors: "colors", currentPage: "currentPage", pageCount: "pageCount", canUndo: "canUndo", canRedo: "canRedo" }, outputs: { save: "save", upload: "upload", zoomIn: "zoomIn", zoomOut: "zoomOut", zoomReset: "zoomReset", prevPage: "prevPage", nextPage: "nextPage", goToPage: "goToPage", undo: "undo", redo: "redo" }, decls: 54, vars: 36, consts: [[1, "pfe-toolbar"], [1, "pfe-toolbar__group"], [1, "pfe-tool-btn", 3, "pfe-tool-btn--active", "title"], [1, "pfe-divider"], ["title", "Orqaga (Ctrl+Z)", 1, "pfe-tool-btn", 3, "click", "disabled"], [1, "pfe-icon", 3, "innerHTML"], ["title", "Oldinga (Ctrl+Shift+Z)", 1, "pfe-tool-btn", 3, "click", "disabled"], [1, "pfe-toolbar__group", "pfe-toolbar__colors"], [1, "pfe-color-dot", 3, "pfe-color-dot--active", "background", "title"], ["title", "Rang tanlash", 1, "pfe-color-pick"], ["type", "color", 3, "input", "value"], [1, "pfe-toolbar__group", "pfe-toolbar__size"], [1, "pfe-label"], ["type", "range", "min", "1", "max", "20", "step", "1", 1, "pfe-slider", 3, "input", "value"], [1, "pfe-size-val"], ["title", "Kichiklashtirish", 1, "pfe-tool-btn", 3, "click"], [1, "pfe-zoom-val"], ["title", "Kattalashtirish", 1, "pfe-tool-btn", 3, "click"], ["title", "Asl o'lcham", 1, "pfe-tool-btn", 3, "click"], ["title", "PDF saqlash", 1, "pfe-action-btn", "pfe-action-btn--primary", 3, "click"], [1, "pfe-action-label"], ["title", "PDF yuklash", 1, "pfe-action-btn", 3, "click"], [1, "pfe-tool-btn", 3, "click", "title"], [1, "pfe-color-dot", 3, "click", "title"], [1, "pfe-toolbar__group", "pfe-toolbar__pages"], ["title", "Oldingi sahifa", 1, "pfe-tool-btn", 3, "click", "disabled"], [1, "pfe-page-indicator"], ["type", "number", 1, "pfe-page-input", 3, "change", "min", "max", "value"], [1, "pfe-page-sep"], ["title", "Keyingi sahifa", 1, "pfe-tool-btn", 3, "click", "disabled"]], template: function PdfToolbarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵrepeaterCreate(2, PdfToolbarComponent_For_3_Template, 3, 6, "button", 2, _forTrack0$1);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElement(4, "div", 3);
            i0.ɵɵdomElementStart(5, "div", 1)(6, "button", 4);
            i0.ɵɵdomListener("click", function PdfToolbarComponent_Template_button_click_6_listener() { return ctx.undo.emit(); });
            i0.ɵɵdomElement(7, "span", 5);
            i0.ɵɵpipe(8, "safeHtml");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(9, "button", 6);
            i0.ɵɵdomListener("click", function PdfToolbarComponent_Template_button_click_9_listener() { return ctx.redo.emit(); });
            i0.ɵɵdomElement(10, "span", 5);
            i0.ɵɵpipe(11, "safeHtml");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElement(12, "div", 3);
            i0.ɵɵdomElementStart(13, "div", 7);
            i0.ɵɵrepeaterCreate(14, PdfToolbarComponent_For_15_Template, 1, 5, "button", 8, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵdomElementStart(16, "label", 9)(17, "input", 10);
            i0.ɵɵdomListener("input", function PdfToolbarComponent_Template_input_input_17_listener($event) { return ctx.onCustomColor($event); });
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElement(18, "span", 5);
            i0.ɵɵpipe(19, "safeHtml");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElement(20, "div", 3);
            i0.ɵɵdomElementStart(21, "div", 11)(22, "span", 12);
            i0.ɵɵtext(23, "O'lcham");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(24, "input", 13);
            i0.ɵɵdomListener("input", function PdfToolbarComponent_Template_input_input_24_listener($event) { return ctx.onSize($event); });
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(25, "span", 14);
            i0.ɵɵtext(26);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElement(27, "div", 3);
            i0.ɵɵdomElementStart(28, "div", 1)(29, "button", 15);
            i0.ɵɵdomListener("click", function PdfToolbarComponent_Template_button_click_29_listener() { return ctx.zoomOut.emit(); });
            i0.ɵɵdomElement(30, "span", 5);
            i0.ɵɵpipe(31, "safeHtml");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(32, "span", 16);
            i0.ɵɵtext(33);
            i0.ɵɵpipe(34, "number");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(35, "button", 17);
            i0.ɵɵdomListener("click", function PdfToolbarComponent_Template_button_click_35_listener() { return ctx.zoomIn.emit(); });
            i0.ɵɵdomElement(36, "span", 5);
            i0.ɵɵpipe(37, "safeHtml");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(38, "button", 18);
            i0.ɵɵdomListener("click", function PdfToolbarComponent_Template_button_click_38_listener() { return ctx.zoomReset.emit(); });
            i0.ɵɵdomElement(39, "span", 5);
            i0.ɵɵpipe(40, "safeHtml");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵconditionalCreate(41, PdfToolbarComponent_Conditional_41_Template, 12, 12);
            i0.ɵɵdomElement(42, "div", 3);
            i0.ɵɵdomElementStart(43, "div", 1)(44, "button", 19);
            i0.ɵɵdomListener("click", function PdfToolbarComponent_Template_button_click_44_listener() { return ctx.save.emit(); });
            i0.ɵɵdomElement(45, "span", 5);
            i0.ɵɵpipe(46, "safeHtml");
            i0.ɵɵdomElementStart(47, "span", 20);
            i0.ɵɵtext(48, "Saqlash");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(49, "button", 21);
            i0.ɵɵdomListener("click", function PdfToolbarComponent_Template_button_click_49_listener() { return ctx.upload.emit(); });
            i0.ɵɵdomElement(50, "span", 5);
            i0.ɵɵpipe(51, "safeHtml");
            i0.ɵɵdomElementStart(52, "span", 20);
            i0.ɵɵtext(53, "Yuklash");
            i0.ɵɵdomElementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵclassMap("pfe-toolbar--" + ((ctx.config == null ? null : ctx.config.position) ?? "top"));
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.visibleTools);
            i0.ɵɵadvance(4);
            i0.ɵɵdomProperty("disabled", !ctx.canUndo());
            i0.ɵɵadvance();
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(8, 17, ctx.icons.undo), i0.ɵɵsanitizeHtml);
            i0.ɵɵadvance(2);
            i0.ɵɵdomProperty("disabled", !ctx.canRedo());
            i0.ɵɵadvance();
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(11, 19, ctx.icons.redo), i0.ɵɵsanitizeHtml);
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.colors());
            i0.ɵɵadvance(3);
            i0.ɵɵdomProperty("value", ctx.toolService.options().color);
            i0.ɵɵadvance();
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(19, 21, ctx.icons.palette), i0.ɵɵsanitizeHtml);
            i0.ɵɵadvance(6);
            i0.ɵɵdomProperty("value", ctx.toolService.options().size);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.toolService.options().size);
            i0.ɵɵadvance(4);
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(31, 23, ctx.icons.zoomOut), i0.ɵɵsanitizeHtml);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind2(34, 25, ctx.zoom() * 100, "1.0-0"), "%");
            i0.ɵɵadvance(3);
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(37, 28, ctx.icons.zoomIn), i0.ɵɵsanitizeHtml);
            i0.ɵɵadvance(3);
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(40, 30, ctx.icons.zoomFit), i0.ɵɵsanitizeHtml);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.pageCount() > 0 ? 41 : -1);
            i0.ɵɵadvance(4);
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(46, 32, ctx.icons.save), i0.ɵɵsanitizeHtml);
            i0.ɵɵadvance(5);
            i0.ɵɵdomProperty("innerHTML", i0.ɵɵpipeBind1(51, 34, ctx.icons.upload), i0.ɵɵsanitizeHtml);
        } }, dependencies: [DecimalPipe, SafeHtmlPipe], styles: [".pfe-toolbar[_ngcontent-%COMP%]{display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:8px 14px;background:var(--pfe-toolbar-bg, #fff);border-bottom:1px solid var(--pfe-border, #e0e0e0);box-shadow:var(--pfe-toolbar-shadow, 0 2px 8px rgba(0,0,0,.06));flex-shrink:0;z-index:20;-webkit-user-select:none;user-select:none}.pfe-toolbar--bottom[_ngcontent-%COMP%]{border-bottom:none;border-top:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--left[_ngcontent-%COMP%], .pfe-toolbar--right[_ngcontent-%COMP%]{flex-direction:column;align-items:stretch;padding:12px 8px;border-bottom:none;height:100%;overflow-y:auto;width:60px}.pfe-toolbar--left[_ngcontent-%COMP%]{border-right:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--right[_ngcontent-%COMP%]{border-left:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar__group[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.pfe-toolbar--left[_ngcontent-%COMP%]   .pfe-toolbar__group[_ngcontent-%COMP%], .pfe-toolbar--right[_ngcontent-%COMP%]   .pfe-toolbar__group[_ngcontent-%COMP%]{flex-direction:column;align-items:center}.pfe-divider[_ngcontent-%COMP%]{width:1px;height:28px;background:var(--pfe-border, #e0e0e0);margin:0 6px;flex-shrink:0}.pfe-toolbar--left[_ngcontent-%COMP%]   .pfe-divider[_ngcontent-%COMP%], .pfe-toolbar--right[_ngcontent-%COMP%]   .pfe-divider[_ngcontent-%COMP%]{width:100%;height:1px;margin:6px 0}.pfe-tool-btn[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:8px;background:transparent;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s,color .15s,transform .1s;padding:0;flex-shrink:0}.pfe-tool-btn[_ngcontent-%COMP%]:hover{background:var(--pfe-hover, #f0f4ff);color:var(--pfe-accent, #1e88e5)}.pfe-tool-btn--active[_ngcontent-%COMP%]{background:var(--pfe-accent, #1e88e5)!important;color:#fff!important}.pfe-tool-btn[_ngcontent-%COMP%]:active{transform:scale(.92)}.pfe-icon[_ngcontent-%COMP%]{display:flex;width:20px;height:20px;pointer-events:none}.pfe-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:100%;height:100%}.pfe-toolbar__colors[_ngcontent-%COMP%]{flex-wrap:wrap;max-width:200px}.pfe-color-dot[_ngcontent-%COMP%]{width:22px;height:22px;border-radius:50%;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:transform .15s,border-color .15s}.pfe-color-dot[_ngcontent-%COMP%]:hover{transform:scale(1.2)}.pfe-color-dot--active[_ngcontent-%COMP%]{border-color:var(--pfe-accent, #1e88e5);box-shadow:0 0 0 2px #fff,0 0 0 4px var(--pfe-accent, #1e88e5)}.pfe-color-pick[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s}.pfe-color-pick[_ngcontent-%COMP%]:hover{background:var(--pfe-hover, #f0f4ff)}.pfe-color-pick[_ngcontent-%COMP%]   input[type=color][_ngcontent-%COMP%]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}.pfe-toolbar__size[_ngcontent-%COMP%]{gap:8px}.pfe-label[_ngcontent-%COMP%]{font-size:11px;color:var(--pfe-muted, #888);white-space:nowrap}.pfe-size-val[_ngcontent-%COMP%]{font-size:12px;font-weight:600;min-width:18px;text-align:center;color:var(--pfe-text, #222)}.pfe-zoom-val[_ngcontent-%COMP%]{font-size:12px;font-weight:600;min-width:44px;text-align:center;color:var(--pfe-text, #222)}.pfe-slider[_ngcontent-%COMP%]{-webkit-appearance:none;appearance:none;height:4px;width:80px;border-radius:2px;background:var(--pfe-border, #e0e0e0);outline:none;cursor:pointer}.pfe-slider[_ngcontent-%COMP%]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--pfe-accent, #1e88e5);cursor:pointer;transition:transform .15s}.pfe-slider[_ngcontent-%COMP%]::-webkit-slider-thumb:hover{transform:scale(1.2)}.pfe-action-btn[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid var(--pfe-border, #e0e0e0);border-radius:8px;background:transparent;cursor:pointer;font-size:13px;font-weight:500;color:var(--pfe-text, #333);transition:background .15s,border-color .15s,transform .1s;white-space:nowrap}.pfe-action-btn[_ngcontent-%COMP%]:hover{background:var(--pfe-hover, #f0f4ff);border-color:var(--pfe-accent, #1e88e5)}.pfe-action-btn[_ngcontent-%COMP%]:active{transform:scale(.97)}.pfe-action-btn--primary[_ngcontent-%COMP%]{background:var(--pfe-accent, #1e88e5);border-color:var(--pfe-accent, #1e88e5);color:#fff}.pfe-action-btn--primary[_ngcontent-%COMP%]:hover{background:var(--pfe-accent-hover, #1565c0)}.pfe-action-btn--danger[_ngcontent-%COMP%]{color:#e53935;border-color:#e53935}.pfe-action-btn--danger[_ngcontent-%COMP%]:hover{background:#ffebee;border-color:#e53935}.pfe-action-label[_ngcontent-%COMP%]{white-space:nowrap}.pfe-toolbar__pages[_ngcontent-%COMP%]{gap:2px}.pfe-page-indicator[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--pfe-text, #222)}.pfe-page-input[_ngcontent-%COMP%]{width:36px;text-align:center;border:1px solid var(--pfe-border, #e0e0e0);border-radius:6px;padding:2px 4px;font-size:12px;font-weight:600;background:transparent;color:var(--pfe-text, #222);-moz-appearance:textfield}.pfe-page-input[_ngcontent-%COMP%]::-webkit-inner-spin-button, .pfe-page-input[_ngcontent-%COMP%]::-webkit-outer-spin-button{-webkit-appearance:none}.pfe-page-input[_ngcontent-%COMP%]:focus{outline:none;border-color:var(--pfe-accent, #1e88e5)}.pfe-page-sep[_ngcontent-%COMP%]{color:var(--pfe-muted, #888);white-space:nowrap}.pfe-tool-btn[_ngcontent-%COMP%]:disabled{opacity:.35;cursor:not-allowed;pointer-events:none}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PdfToolbarComponent, [{
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
      <div class="pfe-toolbar__group">
        <button class="pfe-action-btn pfe-action-btn--primary" title="PDF saqlash" (click)="save.emit()">
          <span class="pfe-icon" [innerHTML]="icons.save | safeHtml"></span>
          <span class="pfe-action-label">Saqlash</span>
        </button>
        <button class="pfe-action-btn" title="PDF yuklash" (click)="upload.emit()">
          <span class="pfe-icon" [innerHTML]="icons.upload | safeHtml"></span>
          <span class="pfe-action-label">Yuklash</span>
        </button>
      </div>
    </div>
  `, styles: [".pfe-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:8px 14px;background:var(--pfe-toolbar-bg, #fff);border-bottom:1px solid var(--pfe-border, #e0e0e0);box-shadow:var(--pfe-toolbar-shadow, 0 2px 8px rgba(0,0,0,.06));flex-shrink:0;z-index:20;-webkit-user-select:none;user-select:none}.pfe-toolbar--bottom{border-bottom:none;border-top:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--left,.pfe-toolbar--right{flex-direction:column;align-items:stretch;padding:12px 8px;border-bottom:none;height:100%;overflow-y:auto;width:60px}.pfe-toolbar--left{border-right:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar--right{border-left:1px solid var(--pfe-border, #e0e0e0)}.pfe-toolbar__group{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.pfe-toolbar--left .pfe-toolbar__group,.pfe-toolbar--right .pfe-toolbar__group{flex-direction:column;align-items:center}.pfe-divider{width:1px;height:28px;background:var(--pfe-border, #e0e0e0);margin:0 6px;flex-shrink:0}.pfe-toolbar--left .pfe-divider,.pfe-toolbar--right .pfe-divider{width:100%;height:1px;margin:6px 0}.pfe-tool-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:8px;background:transparent;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s,color .15s,transform .1s;padding:0;flex-shrink:0}.pfe-tool-btn:hover{background:var(--pfe-hover, #f0f4ff);color:var(--pfe-accent, #1e88e5)}.pfe-tool-btn--active{background:var(--pfe-accent, #1e88e5)!important;color:#fff!important}.pfe-tool-btn:active{transform:scale(.92)}.pfe-icon{display:flex;width:20px;height:20px;pointer-events:none}.pfe-icon svg{width:100%;height:100%}.pfe-toolbar__colors{flex-wrap:wrap;max-width:200px}.pfe-color-dot{width:22px;height:22px;border-radius:50%;border:2px solid transparent;cursor:pointer;flex-shrink:0;transition:transform .15s,border-color .15s}.pfe-color-dot:hover{transform:scale(1.2)}.pfe-color-dot--active{border-color:var(--pfe-accent, #1e88e5);box-shadow:0 0 0 2px #fff,0 0 0 4px var(--pfe-accent, #1e88e5)}.pfe-color-pick{position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;cursor:pointer;color:var(--pfe-icon, #444);transition:background .15s}.pfe-color-pick:hover{background:var(--pfe-hover, #f0f4ff)}.pfe-color-pick input[type=color]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}.pfe-toolbar__size{gap:8px}.pfe-label{font-size:11px;color:var(--pfe-muted, #888);white-space:nowrap}.pfe-size-val{font-size:12px;font-weight:600;min-width:18px;text-align:center;color:var(--pfe-text, #222)}.pfe-zoom-val{font-size:12px;font-weight:600;min-width:44px;text-align:center;color:var(--pfe-text, #222)}.pfe-slider{-webkit-appearance:none;appearance:none;height:4px;width:80px;border-radius:2px;background:var(--pfe-border, #e0e0e0);outline:none;cursor:pointer}.pfe-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--pfe-accent, #1e88e5);cursor:pointer;transition:transform .15s}.pfe-slider::-webkit-slider-thumb:hover{transform:scale(1.2)}.pfe-action-btn{display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid var(--pfe-border, #e0e0e0);border-radius:8px;background:transparent;cursor:pointer;font-size:13px;font-weight:500;color:var(--pfe-text, #333);transition:background .15s,border-color .15s,transform .1s;white-space:nowrap}.pfe-action-btn:hover{background:var(--pfe-hover, #f0f4ff);border-color:var(--pfe-accent, #1e88e5)}.pfe-action-btn:active{transform:scale(.97)}.pfe-action-btn--primary{background:var(--pfe-accent, #1e88e5);border-color:var(--pfe-accent, #1e88e5);color:#fff}.pfe-action-btn--primary:hover{background:var(--pfe-accent-hover, #1565c0)}.pfe-action-btn--danger{color:#e53935;border-color:#e53935}.pfe-action-btn--danger:hover{background:#ffebee;border-color:#e53935}.pfe-action-label{white-space:nowrap}.pfe-toolbar__pages{gap:2px}.pfe-page-indicator{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--pfe-text, #222)}.pfe-page-input{width:36px;text-align:center;border:1px solid var(--pfe-border, #e0e0e0);border-radius:6px;padding:2px 4px;font-size:12px;font-weight:600;background:transparent;color:var(--pfe-text, #222);-moz-appearance:textfield}.pfe-page-input::-webkit-inner-spin-button,.pfe-page-input::-webkit-outer-spin-button{-webkit-appearance:none}.pfe-page-input:focus{outline:none;border-color:var(--pfe-accent, #1e88e5)}.pfe-page-sep{color:var(--pfe-muted, #888);white-space:nowrap}.pfe-tool-btn:disabled{opacity:.35;cursor:not-allowed;pointer-events:none}\n"] }]
    }], null, { config: [{
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
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PdfToolbarComponent, { className: "PdfToolbarComponent", filePath: "components/pdf-toolbar/pdf-toolbar.ts", lineNumber: 337 }); })();

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
    static ɵfac = function AnnotationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AnnotationService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AnnotationService, factory: AnnotationService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AnnotationService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();

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
    static ɵfac = function HistoryService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || HistoryService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: HistoryService, factory: HistoryService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(HistoryService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();

const _c0$2 = ["fabricCanvas"];
class PdfCanvasComponent {
    canvasRef;
    pageIndex;
    width = 0;
    height = 0;
    fc = null;
    drawingShape = false;
    shapeOrigin = null;
    activeShape = null;
    // State captured at mouse:down — pushed to undo stack when persist() is called
    pendingUndo = null;
    // Prevents pushing to history during undo/redo restoration
    isUndoRedoing = false;
    toolService = inject(ToolService);
    annotationService = inject(AnnotationService);
    historyService = inject(HistoryService);
    toolEffect = effect(() => {
        const tool = this.toolService.activeTool();
        const opts = this.toolService.options();
        if (this.fc)
            this.applyTool(tool, opts);
    }, ...(ngDevMode ? [{ debugName: "toolEffect" }] : /* istanbul ignore next */ []));
    ngAfterViewInit() {
        const el = this.canvasRef.nativeElement;
        el.width = this.width;
        el.height = this.height;
        this.fc = new fabric.Canvas(el, {
            isDrawingMode: false,
            selection: false,
            enableRetinaScaling: false,
        });
        this.fc.on('object:added', () => this.persist());
        this.fc.on('object:modified', () => this.persist());
        this.fc.on('object:removed', () => this.persist());
        this.fc.on('mouse:down', (e) => this.onMouseDown(e));
        this.fc.on('mouse:move', (e) => this.onMouseMove(e));
        this.fc.on('mouse:up', () => this.onMouseUp());
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
        // Zoom rescale is not an undoable action — save directly
        this.isUndoRedoing = true;
        this.persist();
        this.isUndoRedoing = false;
    }
    loadSavedAnnotations() {
        const saved = this.annotationService.getPageJson(this.pageIndex);
        if (saved) {
            // Initial load is not undoable
            this.isUndoRedoing = true;
            this.fc.loadFromJSON(JSON.parse(saved)).then(() => {
                this.fc?.renderAll();
                this.isUndoRedoing = false;
            });
        }
    }
    applyTool(tool, opts) {
        if (!this.fc)
            return;
        this.fc.isDrawingMode = false;
        this.fc.selection = tool === ToolType.Select;
        const isSelect = tool === ToolType.Select;
        this.fc.getObjects().forEach(o => o.set({ selectable: isSelect, evented: isSelect }));
        switch (tool) {
            case ToolType.Pen:
                this.fc.isDrawingMode = true;
                this.fc.freeDrawingBrush = new fabric.PencilBrush(this.fc);
                this.fc.freeDrawingBrush.color = opts.color;
                this.fc.freeDrawingBrush.width = opts.size;
                break;
            case ToolType.Highlighter:
                this.fc.isDrawingMode = true;
                this.fc.freeDrawingBrush = new fabric.PencilBrush(this.fc);
                this.fc.freeDrawingBrush.color = this.toRgba(opts.color, 0.4);
                this.fc.freeDrawingBrush.width = Math.max(opts.size * 6, 20);
                break;
            case ToolType.Eraser:
                this.fc.isDrawingMode = true;
                this.fc.freeDrawingBrush = new fabric.PencilBrush(this.fc);
                this.fc.freeDrawingBrush.color = 'rgba(255,255,255,1)';
                this.fc.freeDrawingBrush.width = opts.size * 5;
                break;
            case ToolType.Select:
                this.fc.renderAll();
                break;
        }
    }
    // Capture canvas state before a user action begins.
    // Called at the top of onMouseDown so it always runs before objects are mutated.
    markDirty() {
        if (this.isUndoRedoing || !this.fc)
            return;
        // Always overwrite: if a previous mouse:down produced no change the stale
        // snapshot is replaced with the current (identical) state, which is correct.
        this.pendingUndo = JSON.stringify(this.fc.toJSON());
    }
    onMouseDown(e) {
        // Capture pre-action state for every drawing interaction
        this.markDirty();
        const tool = this.toolService.activeTool();
        const opts = this.toolService.options();
        const pt = e.scenePoint;
        if (tool === ToolType.Text) {
            const tb = new fabric.Textbox('Text', {
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
                this.activeShape = new fabric.Rect({
                    left: pt.x, top: pt.y, width: 0, height: 0,
                    originX: 'center', originY: 'center',
                    fill: 'transparent', stroke: color, strokeWidth: size, selectable: false,
                });
                break;
            case ToolType.Circle:
                this.activeShape = new fabric.Ellipse({
                    left: pt.x, top: pt.y, rx: 0, ry: 0,
                    originX: 'center', originY: 'center',
                    fill: 'transparent', stroke: color, strokeWidth: size, selectable: false,
                });
                break;
            case ToolType.Line:
            case ToolType.Arrow:
                this.activeShape = new fabric.Line([pt.x, pt.y, pt.x, pt.y], {
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
                    left: (o.x + pt.x) / 2,
                    top: (o.y + pt.y) / 2,
                    width: Math.abs(pt.x - o.x),
                    height: Math.abs(pt.y - o.y),
                });
                break;
            case ToolType.Circle:
                this.activeShape.set({
                    left: (o.x + pt.x) / 2,
                    top: (o.y + pt.y) / 2,
                    rx: Math.abs(pt.x - o.x) / 2,
                    ry: Math.abs(pt.y - o.y) / 2,
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
        const { size, color } = this.toolService.options();
        const x1 = line.x1 ?? 0, y1 = line.y1 ?? 0;
        const x2 = line.x2 ?? 0, y2 = line.y2 ?? 0;
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        this.fc.add(new fabric.Triangle({
            left: x2, top: y2, originX: 'center', originY: 'center',
            width: size * 5, height: size * 5, fill: color, angle: angle + 90, selectable: false,
        }));
    }
    persist() {
        if (!this.fc)
            return;
        const json = JSON.stringify(this.fc.toJSON());
        if (!this.isUndoRedoing && this.pendingUndo !== null) {
            // First change after a mouse:down — commit the pre-action snapshot
            this.historyService.push(this.pageIndex, this.pendingUndo);
            this.pendingUndo = null;
        }
        this.annotationService.savePageJson(this.pageIndex, json);
    }
    // ── Public API for undo/redo orchestration ────────────────────────────────
    getCurrentState() {
        return this.fc ? JSON.stringify(this.fc.toJSON()) : '{}';
    }
    async restoreState(state) {
        if (!this.fc)
            return;
        this.isUndoRedoing = true;
        await this.fc.loadFromJSON(JSON.parse(state));
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
        this.fc?.dispose();
    }
    static ɵfac = function PdfCanvasComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PdfCanvasComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PdfCanvasComponent, selectors: [["pdf-canvas"]], viewQuery: function PdfCanvasComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0$2, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvasRef = _t.first);
        } }, hostAttrs: [1, "pdf-annotation-host"], inputs: { pageIndex: "pageIndex", width: "width", height: "height" }, features: [i0.ɵɵNgOnChangesFeature], decls: 2, vars: 0, consts: [["fabricCanvas", ""]], template: function PdfCanvasComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElement(0, "canvas", null, 0);
        } }, styles: [".pdf-annotation-host[_nghost-%COMP%]{position:absolute;inset:0;pointer-events:all}canvas[_ngcontent-%COMP%]{display:block}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PdfCanvasComponent, [{
        type: Component,
        args: [{ selector: 'pdf-canvas', standalone: true, template: `<canvas #fabricCanvas></canvas>`, host: { class: 'pdf-annotation-host' }, styles: [":host.pdf-annotation-host{position:absolute;inset:0;pointer-events:all}canvas{display:block}\n"] }]
    }], null, { canvasRef: [{
            type: ViewChild,
            args: ['fabricCanvas']
        }], pageIndex: [{
            type: Input,
            args: [{ required: true }]
        }], width: [{
            type: Input
        }], height: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PdfCanvasComponent, { className: "PdfCanvasComponent", filePath: "components/pdf-canvas/pdf-canvas.ts", lineNumber: 21 }); })();

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
    async getPage(pageNumber) {
        if (!this.pdfDoc)
            throw new Error('No PDF loaded');
        return this.pdfDoc.getPage(pageNumber);
    }
    // pdfjs-dist v5: RenderParameters.canvas (HTMLCanvasElement) is required;
    // canvasContext is optional and derived internally from the canvas.
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
    static ɵfac = function PdfRendererService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PdfRendererService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PdfRendererService, factory: PdfRendererService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PdfRendererService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();

const _c0$1 = ["renderCanvas"];
const _c1$1 = ["pageWrapper"];
const _forTrack0 = ($index, $item) => $item.index;
function PdfViewerComponent_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6, 0);
    i0.ɵɵelement(2, "canvas", 7, 1)(4, "pdf-canvas", 8);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const page_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("width", page_r1.width, "px")("height", page_r1.height, "px")("margin-bottom", ctx_r1.pageGap, "px");
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("data-page", page_r1.index);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("pageIndex", page_r1.index)("width", page_r1.width)("height", page_r1.height);
} }
function PdfViewerComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵelement(1, "div", 9);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "PDF yuklanmoqda...");
    i0.ɵɵelementEnd()();
} }
function PdfViewerComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5)(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Xato: ", ctx_r1.rendererService.error());
} }
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
    static ɵfac = function PdfViewerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PdfViewerComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PdfViewerComponent, selectors: [["pdf-viewer"]], viewQuery: function PdfViewerComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0$1, 5)(_c1$1, 5)(PdfCanvasComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.renderCanvases = _t);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pageWrappers = _t);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvasComps = _t);
        } }, inputs: { scale: "scale", pageGap: "pageGap" }, outputs: { currentPageChange: "currentPageChange" }, features: [i0.ɵɵNgOnChangesFeature], decls: 5, vars: 2, consts: [["pageWrapper", ""], ["renderCanvas", ""], [1, "pdf-pages-container"], [1, "pdf-page-wrapper", 3, "width", "height", "margin-bottom"], [1, "pdf-loading"], [1, "pdf-error"], [1, "pdf-page-wrapper"], [1, "pdf-render-canvas"], [3, "pageIndex", "width", "height"], [1, "pdf-spinner"]], template: function PdfViewerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 2);
            i0.ɵɵrepeaterCreate(1, PdfViewerComponent_For_2_Template, 5, 10, "div", 3, _forTrack0);
            i0.ɵɵconditionalCreate(3, PdfViewerComponent_Conditional_3_Template, 4, 0, "div", 4);
            i0.ɵɵconditionalCreate(4, PdfViewerComponent_Conditional_4_Template, 3, 1, "div", 5);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.pages());
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.rendererService.isLoading() ? 3 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.rendererService.error() ? 4 : -1);
        } }, dependencies: [PdfCanvasComponent], styles: [".pdf-pages-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;padding:24px;min-height:100%}.pdf-page-wrapper[_ngcontent-%COMP%]{position:relative;box-shadow:var(--pfe-page-shadow, 0 4px 24px rgba(0,0,0,.18));border-radius:var(--pfe-page-radius, 4px);overflow:hidden;background:#fff;flex-shrink:0}.pdf-render-canvas[_ngcontent-%COMP%]{display:block;width:100%;height:100%}pdf-canvas[_ngcontent-%COMP%]{position:absolute;inset:0}.pdf-loading[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:12px;padding:48px;color:var(--pfe-muted, #888)}.pdf-spinner[_ngcontent-%COMP%]{width:40px;height:40px;border:3px solid var(--pfe-accent, #1e88e5);border-top-color:transparent;border-radius:50%;animation:_ngcontent-%COMP%_pfe-spin .8s linear infinite}@keyframes _ngcontent-%COMP%_pfe-spin{to{transform:rotate(360deg)}}.pdf-error[_ngcontent-%COMP%]{padding:24px;color:#e53935;background:#ffebee;border-radius:8px;margin:24px}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PdfViewerComponent, [{
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

      @if (rendererService.isLoading()) {
        <div class="pdf-loading">
          <div class="pdf-spinner"></div>
          <span>PDF yuklanmoqda...</span>
        </div>
      }

      @if (rendererService.error()) {
        <div class="pdf-error">
          <span>Xato: {{ rendererService.error() }}</span>
        </div>
      }
    </div>
  `, styles: [".pdf-pages-container{display:flex;flex-direction:column;align-items:center;padding:24px;min-height:100%}.pdf-page-wrapper{position:relative;box-shadow:var(--pfe-page-shadow, 0 4px 24px rgba(0,0,0,.18));border-radius:var(--pfe-page-radius, 4px);overflow:hidden;background:#fff;flex-shrink:0}.pdf-render-canvas{display:block;width:100%;height:100%}pdf-canvas{position:absolute;inset:0}.pdf-loading{display:flex;flex-direction:column;align-items:center;gap:12px;padding:48px;color:var(--pfe-muted, #888)}.pdf-spinner{width:40px;height:40px;border:3px solid var(--pfe-accent, #1e88e5);border-top-color:transparent;border-radius:50%;animation:pfe-spin .8s linear infinite}@keyframes pfe-spin{to{transform:rotate(360deg)}}.pdf-error{padding:24px;color:#e53935;background:#ffebee;border-radius:8px;margin:24px}\n"] }]
    }], () => [], { scale: [{
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
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PdfViewerComponent, { className: "PdfViewerComponent", filePath: "components/pdf-viewer/pdf-viewer.ts", lineNumber: 115 }); })();

class ExportService {
    renderer;
    constructor(renderer) {
        this.renderer = renderer;
    }
    /**
     * Merges each PDF page canvas with its Fabric annotation canvas and
     * exports a downloadable PDF.
     *
     * @param pages  Array indexed by page order: { pdfCanvas, fabricCanvas }
     */
    async exportPdf(pages, filename = 'annotated.pdf') {
        const pdfDoc = await PDFDocument.create();
        for (const { pdfCanvas, fabricCanvas } of pages) {
            const w = pdfCanvas.width;
            const h = pdfCanvas.height;
            // Create a merged canvas: PDF background + annotation layer
            const merged = document.createElement('canvas');
            merged.width = w;
            merged.height = h;
            const ctx = merged.getContext('2d');
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
        this._triggerDownload(bytes, filename);
    }
    _drawFabricOnContext(ctx, fc, targetW, targetH) {
        return new Promise(resolve => {
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
    static ɵfac = function ExportService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ExportService)(i0.ɵɵinject(PdfRendererService)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ExportService, factory: ExportService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ExportService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: PdfRendererService }], null); })();

const _c0 = ["viewer"];
const _c1 = ["fileInput"];
function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "pdf-toolbar", 13);
    i0.ɵɵlistener("save", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_save_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onSave()); })("upload", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_upload_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onUploadClick()); })("zoomIn", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_zoomIn_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomIn()); })("zoomOut", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_zoomOut_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomOut()); })("zoomReset", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_zoomReset_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomReset()); })("prevPage", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_prevPage_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onPrevPage()); })("nextPage", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_nextPage_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onNextPage()); })("goToPage", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_goToPage_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onGoToPage($event)); })("undo", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_undo_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doUndo()); })("redo", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template_pdf_toolbar_redo_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doRedo()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("config", ctx_r2.cfg.toolbar)("zoom", ctx_r2.zoom)("colors", ctx_r2.paletteColors)("currentPage", ctx_r2.currentPage)("pageCount", ctx_r2.rendererService.pageCount)("canUndo", ctx_r2.historyService.canUndo)("canRedo", ctx_r2.historyService.canRedo);
} }
function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "pdf-toolbar", 13);
    i0.ɵɵlistener("save", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_save_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onSave()); })("upload", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_upload_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onUploadClick()); })("zoomIn", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_zoomIn_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomIn()); })("zoomOut", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_zoomOut_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomOut()); })("zoomReset", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_zoomReset_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomReset()); })("prevPage", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_prevPage_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onPrevPage()); })("nextPage", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_nextPage_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onNextPage()); })("goToPage", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_goToPage_0_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onGoToPage($event)); })("undo", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_undo_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doUndo()); })("redo", function PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template_pdf_toolbar_redo_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doRedo()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("config", ctx_r2.cfg.toolbar)("zoom", ctx_r2.zoom)("colors", ctx_r2.paletteColors)("currentPage", ctx_r2.currentPage)("pageCount", ctx_r2.rendererService.pageCount)("canUndo", ctx_r2.historyService.canUndo)("canRedo", ctx_r2.historyService.canRedo);
} }
function PdfEditorComponent_Conditional_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵconditionalCreate(1, PdfEditorComponent_Conditional_1_Conditional_0_Conditional_1_Template, 1, 7, "pdf-toolbar", 10);
    i0.ɵɵelementStart(2, "div", 11)(3, "pdf-viewer", 12, 1);
    i0.ɵɵlistener("currentPageChange", function PdfEditorComponent_Conditional_1_Conditional_0_Template_pdf_viewer_currentPageChange_3_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.currentPage.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(5, PdfEditorComponent_Conditional_1_Conditional_0_Conditional_5_Template, 1, 7, "pdf-toolbar", 10);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("pfe-sidebar-right", ctx_r2.cfg.toolbar.position === "right");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.cfg.toolbar.position !== "right" ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("scale", ctx_r2.zoom())("pageGap", ctx_r2.cfg.pageGap);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.cfg.toolbar.position === "right" ? 5 : -1);
} }
function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "pdf-toolbar", 13);
    i0.ɵɵlistener("save", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_save_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onSave()); })("upload", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_upload_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onUploadClick()); })("zoomIn", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_zoomIn_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomIn()); })("zoomOut", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_zoomOut_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomOut()); })("zoomReset", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_zoomReset_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomReset()); })("prevPage", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_prevPage_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onPrevPage()); })("nextPage", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_nextPage_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onNextPage()); })("goToPage", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_goToPage_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onGoToPage($event)); })("undo", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_undo_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doUndo()); })("redo", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template_pdf_toolbar_redo_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doRedo()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("config", ctx_r2.cfg.toolbar)("zoom", ctx_r2.zoom)("colors", ctx_r2.paletteColors)("currentPage", ctx_r2.currentPage)("pageCount", ctx_r2.rendererService.pageCount)("canUndo", ctx_r2.historyService.canUndo)("canRedo", ctx_r2.historyService.canRedo);
} }
function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "pdf-toolbar", 13);
    i0.ɵɵlistener("save", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_save_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onSave()); })("upload", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_upload_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onUploadClick()); })("zoomIn", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_zoomIn_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomIn()); })("zoomOut", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_zoomOut_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomOut()); })("zoomReset", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_zoomReset_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onZoomReset()); })("prevPage", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_prevPage_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onPrevPage()); })("nextPage", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_nextPage_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onNextPage()); })("goToPage", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_goToPage_0_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.onGoToPage($event)); })("undo", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_undo_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doUndo()); })("redo", function PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template_pdf_toolbar_redo_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r2.doRedo()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("config", ctx_r2.cfg.toolbar)("zoom", ctx_r2.zoom)("colors", ctx_r2.paletteColors)("currentPage", ctx_r2.currentPage)("pageCount", ctx_r2.rendererService.pageCount)("canUndo", ctx_r2.historyService.canUndo)("canRedo", ctx_r2.historyService.canRedo);
} }
function PdfEditorComponent_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵconditionalCreate(1, PdfEditorComponent_Conditional_1_Conditional_1_Conditional_1_Template, 1, 7, "pdf-toolbar", 10);
    i0.ɵɵelementStart(2, "div", 11)(3, "pdf-viewer", 12, 1);
    i0.ɵɵlistener("currentPageChange", function PdfEditorComponent_Conditional_1_Conditional_1_Template_pdf_viewer_currentPageChange_3_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.currentPage.set($event)); });
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(5, PdfEditorComponent_Conditional_1_Conditional_1_Conditional_5_Template, 1, 7, "pdf-toolbar", 10);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("pfe-toolbar-bottom", ctx_r2.cfg.toolbar.position === "bottom");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.cfg.toolbar.position !== "bottom" ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("scale", ctx_r2.zoom())("pageGap", ctx_r2.cfg.pageGap);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r2.cfg.toolbar.position === "bottom" ? 5 : -1);
} }
function PdfEditorComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, PdfEditorComponent_Conditional_1_Conditional_0_Template, 6, 6, "div", 7)(1, PdfEditorComponent_Conditional_1_Conditional_1_Template, 6, 6, "div", 8);
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r2.isVertical ? 0 : 1);
} }
function PdfEditorComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3);
    i0.ɵɵelement(1, "pdf-viewer", 15, 1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("scale", ctx_r2.zoom())("pageGap", ctx_r2.cfg.pageGap);
} }
function PdfEditorComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 16);
    i0.ɵɵlistener("dragover", function PdfEditorComponent_Conditional_5_Template_div_dragover_0_listener($event) { return $event.preventDefault(); })("drop", function PdfEditorComponent_Conditional_5_Template_div_drop_0_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onDrop($event)); })("click", function PdfEditorComponent_Conditional_5_Template_div_click_0_listener() { i0.ɵɵrestoreView(_r8); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onUploadClick()); });
    i0.ɵɵelementStart(1, "div", 17);
    i0.ɵɵelement(2, "div", 18);
    i0.ɵɵpipe(3, "safeHtml");
    i0.ɵɵelementStart(4, "p", 19);
    i0.ɵɵtext(5, "PDF faylni shu yerga tashlang");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 20);
    i0.ɵɵtext(7, "yoki ");
    i0.ɵɵelementStart(8, "span", 21);
    i0.ɵɵtext(9, "tanlash");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, " uchun bosing");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("innerHTML", i0.ɵɵpipeBind1(3, 1, ctx_r2.PDF_ICON), i0.ɵɵsanitizeHtml);
} }
function PdfEditorComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6);
    i0.ɵɵelement(1, "div", 22);
    i0.ɵɵelementStart(2, "span");
    i0.ɵɵtext(3, "Yuklanmoqda...");
    i0.ɵɵelementEnd()();
} }
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
    async onSave() {
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
    static ɵfac = function PdfEditorComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PdfEditorComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PdfEditorComponent, selectors: [["pdf-editor"]], viewQuery: function PdfEditorComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5)(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.viewerRef = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.fileInputRef = _t.first);
        } }, hostBindings: function PdfEditorComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keydown", function PdfEditorComponent_keydown_HostBindingHandler($event) { return ctx.onKeydown($event); }, i0.ɵɵresolveDocument);
        } }, inputs: { config: "config", src: "src" }, features: [i0.ɵɵNgOnChangesFeature], decls: 7, vars: 5, consts: [["fileInput", ""], ["viewer", ""], [1, "pfe-host"], [1, "pfe-viewer-wrap", "pfe-viewer-wrap--full"], ["type", "file", "accept", ".pdf", 2, "display", "none", 3, "change"], [1, "pfe-dropzone"], [1, "pfe-loader"], [1, "pfe-with-sidebar", 3, "pfe-sidebar-right"], [1, "pfe-with-toolbar", 3, "pfe-toolbar-bottom"], [1, "pfe-with-sidebar"], [3, "config", "zoom", "colors", "currentPage", "pageCount", "canUndo", "canRedo"], [1, "pfe-viewer-wrap"], [3, "currentPageChange", "scale", "pageGap"], [3, "save", "upload", "zoomIn", "zoomOut", "zoomReset", "prevPage", "nextPage", "goToPage", "undo", "redo", "config", "zoom", "colors", "currentPage", "pageCount", "canUndo", "canRedo"], [1, "pfe-with-toolbar"], [3, "scale", "pageGap"], [1, "pfe-dropzone", 3, "dragover", "drop", "click"], [1, "pfe-dropzone__card"], [1, "pfe-dropzone__icon", 3, "innerHTML"], [1, "pfe-dropzone__title"], [1, "pfe-dropzone__hint"], [1, "pfe-dropzone__link"], [1, "pfe-spinner"]], template: function PdfEditorComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 2);
            i0.ɵɵconditionalCreate(1, PdfEditorComponent_Conditional_1_Template, 2, 1)(2, PdfEditorComponent_Conditional_2_Template, 3, 2, "div", 3);
            i0.ɵɵelementStart(3, "input", 4, 0);
            i0.ɵɵlistener("change", function PdfEditorComponent_Template_input_change_3_listener($event) { return ctx.onFileSelected($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(5, PdfEditorComponent_Conditional_5_Template, 11, 3, "div", 5);
            i0.ɵɵconditionalCreate(6, PdfEditorComponent_Conditional_6_Template, 4, 0, "div", 6);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵclassMap("pfe-theme--" + ctx.cfg.theme);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.cfg.toolbar.show !== false ? 1 : 2);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(!ctx.rendererService.pageCount() && !ctx.rendererService.isLoading() ? 5 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.rendererService.isLoading() ? 6 : -1);
        } }, dependencies: [PdfToolbarComponent, PdfViewerComponent, SafeHtmlPipe], styles: ["[_nghost-%COMP%]{display:block;font-family:var(--pfe-font, Inter, system-ui, sans-serif);--pfe-bg: #f4f6f8;--pfe-toolbar-bg: #ffffff;--pfe-toolbar-shadow: 0 1px 4px rgba(0,0,0,.08);--pfe-border: #e2e8f0;--pfe-accent: #1e88e5;--pfe-accent-hover: #1565c0;--pfe-hover: #eff6ff;--pfe-text: #1a202c;--pfe-muted: #718096;--pfe-icon: #4a5568;--pfe-page-shadow: 0 4px 20px rgba(0,0,0,.12);--pfe-page-radius: 6px}.pfe-theme--dark[_nghost-%COMP%], .pfe-theme--dark   [_nghost-%COMP%], .pfe-theme--dark[_ngcontent-%COMP%]{--pfe-bg: #0f172a;--pfe-toolbar-bg: #1e293b;--pfe-toolbar-shadow: 0 2px 12px rgba(0,0,0,.4);--pfe-border: #334155;--pfe-accent: #38bdf8;--pfe-accent-hover: #0284c7;--pfe-hover: #1e3a5f;--pfe-text: #e2e8f0;--pfe-muted: #94a3b8;--pfe-icon: #cbd5e1;--pfe-page-shadow: 0 4px 32px rgba(0,0,0,.5)}.pfe-host[_ngcontent-%COMP%]{display:flex;width:100%;height:100%;background:var(--pfe-bg);overflow:hidden;position:relative}.pfe-with-toolbar[_ngcontent-%COMP%]{display:flex;flex-direction:column;width:100%;height:100%;overflow:hidden}.pfe-toolbar-bottom[_ngcontent-%COMP%]{flex-direction:column-reverse}.pfe-with-sidebar[_ngcontent-%COMP%]{display:flex;flex-direction:row;width:100%;height:100%;overflow:hidden}.pfe-sidebar-right[_ngcontent-%COMP%]{flex-direction:row-reverse}.pfe-viewer-wrap[_ngcontent-%COMP%]{flex:1;overflow:auto;min-height:0;min-width:0}.pfe-viewer-wrap--full[_ngcontent-%COMP%]{width:100%;height:100%}.pfe-dropzone[_ngcontent-%COMP%]{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:var(--pfe-bg);cursor:pointer;z-index:10}.pfe-dropzone__card[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:12px;padding:56px 72px;border:2px dashed var(--pfe-border);border-radius:20px;transition:border-color .2s,background .2s}.pfe-dropzone[_ngcontent-%COMP%]:hover   .pfe-dropzone__card[_ngcontent-%COMP%]{border-color:var(--pfe-accent);background:var(--pfe-hover)}.pfe-dropzone__icon[_ngcontent-%COMP%]{width:72px;height:72px;color:var(--pfe-accent)}.pfe-dropzone__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]{width:100%;height:100%}.pfe-dropzone__title[_ngcontent-%COMP%]{font-size:18px;font-weight:600;color:var(--pfe-text);margin:0}.pfe-dropzone__hint[_ngcontent-%COMP%]{font-size:14px;color:var(--pfe-muted);margin:0}.pfe-dropzone__link[_ngcontent-%COMP%]{color:var(--pfe-accent);font-weight:500;text-decoration:underline}.pfe-loader[_ngcontent-%COMP%]{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#fffc;z-index:20;color:var(--pfe-muted);font-size:14px}.pfe-spinner[_ngcontent-%COMP%]{width:44px;height:44px;border:3px solid var(--pfe-border);border-top-color:var(--pfe-accent);border-radius:50%;animation:_ngcontent-%COMP%_pfe-spin .8s linear infinite}@keyframes _ngcontent-%COMP%_pfe-spin{to{transform:rotate(360deg)}}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PdfEditorComponent, [{
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
                (save)="onSave()"
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
                (save)="onSave()"
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
                (save)="onSave()"
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
                (save)="onSave()"
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
    }], null, { config: [{
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
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PdfEditorComponent, { className: "PdfEditorComponent", filePath: "components/pdf-editor/pdf-editor.ts", lineNumber: 258 }); })();

// Main component — the only import most consumers need

/**
 * Generated bundle index. Do not edit.
 */

export { AnnotationService, DEFAULT_COLORS, DEFAULT_CONFIG, DEFAULT_TOOL_OPTIONS, ExportService, HistoryService, PDFJS_WORKER_URL, PdfCanvasComponent, PdfEditorComponent, PdfRendererService, PdfToolbarComponent, PdfViewerComponent, ToolService, ToolType };
//# sourceMappingURL=pdf-editor.mjs.map
