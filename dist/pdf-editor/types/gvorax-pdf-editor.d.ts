import * as _angular_core from '@angular/core';
import { AfterViewInit, OnChanges, OnDestroy, ElementRef, SimpleChanges, EventEmitter, QueryList, OnInit, Signal, InjectionToken } from '@angular/core';
import * as fabric from 'fabric';
import { Canvas } from 'fabric';
import { PDFPageProxy, PDFDocumentProxy } from 'pdfjs-dist';

declare class PdfCanvasComponent implements AfterViewInit, OnChanges, OnDestroy {
    canvasRef: ElementRef<HTMLCanvasElement>;
    pageIndex: number;
    width: number;
    height: number;
    private fc;
    private drawingShape;
    private shapeOrigin;
    private activeShape;
    private pendingUndo;
    private isUndoRedoing;
    private readonly toolService;
    private readonly annotationService;
    private readonly historyService;
    private readonly toolEffect;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private loadSavedAnnotations;
    private applyTool;
    private markDirty;
    private onMouseDown;
    private onMouseMove;
    private onMouseUp;
    private addArrowhead;
    private persist;
    getCurrentState(): string;
    restoreState(state: string): Promise<void>;
    private toRgba;
    getFabricCanvas(): fabric.Canvas | null;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<PdfCanvasComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<PdfCanvasComponent, "pdf-canvas", never, { "pageIndex": { "alias": "pageIndex"; "required": true; }; "width": { "alias": "width"; "required": false; }; "height": { "alias": "height"; "required": false; }; }, {}, never, never, true, never>;
}

declare class PdfRendererService {
    private readonly workerUrl;
    private pdfDoc;
    private pdfWorker;
    readonly pageCount: _angular_core.WritableSignal<number>;
    readonly isLoading: _angular_core.WritableSignal<boolean>;
    readonly error: _angular_core.WritableSignal<string | null>;
    loadFromFile(file: File): Promise<void>;
    loadFromUrl(url: string): Promise<void>;
    loadFromArrayBuffer(buffer: ArrayBuffer): Promise<void>;
    private _load;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    renderPage(pageNumber: number, canvas: HTMLCanvasElement, scale?: number): Promise<{
        width: number;
        height: number;
    }>;
    getDocument(): PDFDocumentProxy | null;
    destroy(): Promise<void>;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<PdfRendererService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<PdfRendererService>;
}

interface PageInfo {
    index: number;
    width: number;
    height: number;
}
declare class PdfViewerComponent implements OnChanges, AfterViewInit, OnDestroy {
    scale: number;
    pageGap: number;
    currentPageChange: EventEmitter<number>;
    renderCanvases: QueryList<ElementRef<HTMLCanvasElement>>;
    pageWrappers: QueryList<ElementRef<HTMLDivElement>>;
    canvasComps: QueryList<PdfCanvasComponent>;
    readonly rendererService: PdfRendererService;
    private readonly appRef;
    private readonly el;
    readonly pages: _angular_core.WritableSignal<PageInfo[]>;
    readonly currentPage: _angular_core.WritableSignal<number>;
    constructor();
    private viewInitialized;
    private scrollEl;
    private readonly scrollHandler;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private updateCurrentPage;
    scrollToPage(pageIndex: number): void;
    renderAllPages(): Promise<void>;
    getPageCanvas(pageIndex: number): HTMLCanvasElement | undefined;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<PdfViewerComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<PdfViewerComponent, "pdf-viewer", never, { "scale": { "alias": "scale"; "required": false; }; "pageGap": { "alias": "pageGap"; "required": false; }; }, { "currentPageChange": "currentPageChange"; }, never, never, true, never>;
}

interface HistoryEntry {
    pageIndex: number;
    state: string;
}
declare class HistoryService {
    private undoStack;
    private redoStack;
    readonly canUndo: _angular_core.WritableSignal<boolean>;
    readonly canRedo: _angular_core.WritableSignal<boolean>;
    push(pageIndex: number, beforeState: string): void;
    popUndo(): HistoryEntry | undefined;
    pushUndo(pageIndex: number, state: string): void;
    pushRedo(pageIndex: number, state: string): void;
    popRedo(): HistoryEntry | undefined;
    clear(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<HistoryService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<HistoryService>;
}

declare enum ToolType {
    Select = "select",
    Pen = "pen",
    Highlighter = "highlighter",
    Text = "text",
    Rectangle = "rectangle",
    Circle = "circle",
    Arrow = "arrow",
    Line = "line",
    Eraser = "eraser"
}
interface ToolOptions {
    color: string;
    size: number;
    opacity: number;
    fontSize: number;
    fontFamily: string;
}
declare const DEFAULT_TOOL_OPTIONS: ToolOptions;
declare const DEFAULT_COLORS: string[];

type ToolbarPosition = 'top' | 'bottom' | 'left' | 'right';
type EditorTheme = 'light' | 'dark' | 'custom';
interface ToolbarConfig {
    position?: ToolbarPosition;
    tools?: ToolType[];
    show?: boolean;
}
interface ZoomConfig {
    min?: number;
    max?: number;
    default?: number;
    step?: number;
}
interface EditorConfig {
    theme?: EditorTheme;
    toolbar?: ToolbarConfig;
    defaultTool?: ToolType;
    defaultColor?: string;
    colors?: string[];
    zoom?: ZoomConfig;
    pageGap?: number;
    cssVars?: Record<string, string>;
}
declare const DEFAULT_CONFIG: Required<EditorConfig>;

declare class PdfEditorComponent implements OnInit, OnChanges, OnDestroy {
    config: EditorConfig;
    src?: string | File | ArrayBuffer;
    viewerRef?: PdfViewerComponent;
    fileInputRef: ElementRef<HTMLInputElement>;
    readonly rendererService: PdfRendererService;
    private readonly exportService;
    private readonly toolService;
    readonly historyService: HistoryService;
    private readonly hostEl;
    readonly zoom: _angular_core.WritableSignal<number>;
    readonly paletteColors: _angular_core.WritableSignal<string[]>;
    readonly currentPage: _angular_core.WritableSignal<number>;
    cfg: Required<EditorConfig>;
    get isVertical(): boolean;
    readonly PDF_ICON = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\"\n    stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z\"/>\n    <polyline points=\"14 2 14 8 20 8\"/>\n    <line x1=\"9\" y1=\"15\" x2=\"15\" y2=\"15\"/>\n    <line x1=\"9\" y1=\"11\" x2=\"15\" y2=\"11\"/>\n    <line x1=\"9\" y1=\"19\" x2=\"11\" y2=\"19\"/>\n  </svg>";
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private applyConfig;
    onKeydown(e: KeyboardEvent): void;
    doUndo(): Promise<void>;
    doRedo(): Promise<void>;
    loadSrc(src: string | File | ArrayBuffer): Promise<void>;
    onUploadClick(): void;
    onFileSelected(e: Event): Promise<void>;
    onDrop(e: DragEvent): Promise<void>;
    onSave(): Promise<void>;
    onZoomIn(): void;
    onZoomOut(): void;
    onZoomReset(): void;
    onPrevPage(): void;
    onNextPage(): void;
    onGoToPage(page: number): void;
    ngOnDestroy(): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<PdfEditorComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<PdfEditorComponent, "pdf-editor", never, { "config": { "alias": "config"; "required": false; }; "src": { "alias": "src"; "required": false; }; }, {}, never, never, true, never>;
}

interface PageAnnotations {
    pageIndex: number;
    fabricJson: string;
}
interface AnnotationSession {
    pages: PageAnnotations[];
    createdAt: number;
}
interface TextAnnotation {
    type: ToolType.Text;
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize: number;
    fontFamily: string;
    pageIndex: number;
}

declare class ToolService {
    readonly activeTool: _angular_core.WritableSignal<ToolType>;
    readonly options: _angular_core.WritableSignal<ToolOptions>;
    readonly isDrawingTool: _angular_core.Signal<boolean>;
    setTool(tool: ToolType): void;
    setColor(color: string): void;
    setSize(size: number): void;
    setOpacity(opacity: number): void;
    setFontSize(fontSize: number): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ToolService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<ToolService>;
}

interface ToolDef {
    type: ToolType;
    label: string;
    icon: string;
}
declare class PdfToolbarComponent {
    config?: ToolbarConfig;
    zoom: _angular_core.WritableSignal<number>;
    colors: _angular_core.WritableSignal<string[]>;
    currentPage: _angular_core.WritableSignal<number>;
    pageCount: _angular_core.WritableSignal<number>;
    canUndo: Signal<boolean>;
    canRedo: Signal<boolean>;
    save: EventEmitter<void>;
    upload: EventEmitter<void>;
    zoomIn: EventEmitter<void>;
    zoomOut: EventEmitter<void>;
    zoomReset: EventEmitter<void>;
    prevPage: EventEmitter<void>;
    nextPage: EventEmitter<void>;
    goToPage: EventEmitter<number>;
    undo: EventEmitter<void>;
    redo: EventEmitter<void>;
    readonly toolService: ToolService;
    readonly icons: {
        chevronLeft: string;
        chevronRight: string;
        select: string;
        pen: string;
        highlight: string;
        text: string;
        rect: string;
        circle: string;
        arrow: string;
        line: string;
        eraser: string;
        palette: string;
        zoomIn: string;
        zoomOut: string;
        undo: string;
        redo: string;
        zoomFit: string;
        save: string;
        upload: string;
    };
    get visibleTools(): ToolDef[];
    selectTool(t: ToolType): void;
    selectColor(c: string): void;
    onCustomColor(e: Event): void;
    onSize(e: Event): void;
    onPageInput(e: Event): void;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<PdfToolbarComponent, never>;
    static ɵcmp: _angular_core.ɵɵComponentDeclaration<PdfToolbarComponent, "pdf-toolbar", never, { "config": { "alias": "config"; "required": false; }; "zoom": { "alias": "zoom"; "required": false; }; "colors": { "alias": "colors"; "required": false; }; "currentPage": { "alias": "currentPage"; "required": false; }; "pageCount": { "alias": "pageCount"; "required": false; }; "canUndo": { "alias": "canUndo"; "required": false; }; "canRedo": { "alias": "canRedo"; "required": false; }; }, { "save": "save"; "upload": "upload"; "zoomIn": "zoomIn"; "zoomOut": "zoomOut"; "zoomReset": "zoomReset"; "prevPage": "prevPage"; "nextPage": "nextPage"; "goToPage": "goToPage"; "undo": "undo"; "redo": "redo"; }, never, never, true, never>;
}

declare class AnnotationService {
    private readonly store;
    readonly isDirty: _angular_core.WritableSignal<boolean>;
    savePageJson(pageIndex: number, json: string): void;
    getPageJson(pageIndex: number): string | null;
    exportSession(): AnnotationSession;
    importSession(session: AnnotationSession): void;
    clearPage(pageIndex: number): void;
    clearAll(): void;
    hasAnnotations(): boolean;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<AnnotationService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<AnnotationService>;
}

declare class ExportService {
    private renderer;
    constructor(renderer: PdfRendererService);
    /**
     * Merges each PDF page canvas with its Fabric annotation canvas and
     * exports a downloadable PDF.
     *
     * @param pages  Array indexed by page order: { pdfCanvas, fabricCanvas }
     */
    exportPdf(pages: Array<{
        pdfCanvas: HTMLCanvasElement;
        fabricCanvas: Canvas | null;
    }>, filename?: string): Promise<void>;
    private _drawFabricOnContext;
    private _canvasToPng;
    private _triggerDownload;
    static ɵfac: _angular_core.ɵɵFactoryDeclaration<ExportService, never>;
    static ɵprov: _angular_core.ɵɵInjectableDeclaration<ExportService>;
}

declare const PDFJS_WORKER_URL: InjectionToken<string>;

export { AnnotationService, DEFAULT_COLORS, DEFAULT_CONFIG, DEFAULT_TOOL_OPTIONS, ExportService, HistoryService, PDFJS_WORKER_URL, PdfCanvasComponent, PdfEditorComponent, PdfRendererService, PdfToolbarComponent, PdfViewerComponent, ToolService, ToolType };
export type { AnnotationSession, EditorConfig, EditorTheme, PageAnnotations, TextAnnotation, ToolOptions, ToolbarConfig, ToolbarPosition, ZoomConfig };
//# sourceMappingURL=gvorax-pdf-editor.d.ts.map
