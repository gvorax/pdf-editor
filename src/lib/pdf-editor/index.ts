// Main component — the only import most consumers need
export { PdfEditorComponent } from './components/pdf-editor/pdf-editor';

// Sub-components (for advanced composition)
export { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer';
export { PdfToolbarComponent } from './components/pdf-toolbar/pdf-toolbar';
export { PdfCanvasComponent } from './components/pdf-canvas/pdf-canvas';

// Services
export { PdfRendererService } from './services/pdf-renderer.service';
export { ToolService } from './services/tool.service';
export { AnnotationService } from './services/annotation.service';
export { ExportService } from './services/export.service';
export { HistoryService } from './services/history.service';

// Tokens
export { PDFJS_WORKER_URL, PDFJS_WASM_URL } from './tokens';

// Models & types
export * from './models';
