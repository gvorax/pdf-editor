import {
  Component, ElementRef, ViewChild, Input, OnDestroy,
  AfterViewInit, OnChanges, SimpleChanges, effect, inject,
} from '@angular/core';
import type * as FabricType from 'fabric';
import { ToolService } from '../../services/tool.service';
import { AnnotationService } from '../../services/annotation.service';
import { HistoryService } from '../../services/history.service';
import { ToolOptions, ToolType } from '../../models';

@Component({
  selector: 'pdf-canvas',
  standalone: true,
  template: `<canvas #fabricCanvas></canvas>`,
  host: { class: 'pdf-annotation-host' },
  styles: [`
    :host.pdf-annotation-host { position: absolute; inset: 0; pointer-events: all; }
    canvas { display: block; }
  `],
})
export class PdfCanvasComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('fabricCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) pageIndex!: number;
  @Input() width = 0;
  @Input() height = 0;

  private fc: FabricType.Canvas | null = null;
  // Fabric module cached after first dynamic import
  private fab!: typeof FabricType;
  private drawingShape = false;
  private shapeOrigin: { x: number; y: number } | null = null;
  private activeShape: FabricType.Object | null = null;

  private pendingUndo: string | null = null;
  private isUndoRedoing = false;

  private readonly keydownHandler = (e: KeyboardEvent): void => {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return;
    const tool = this.toolService.activeTool();
    if (tool !== ToolType.Select && tool !== ToolType.Eraser) return;
    if (!this.fc) return;
    const targets = this.fc.getActiveObjects();
    if (!targets.length) return;
    if (targets.some((o: any) => o.isEditing)) return;
    e.preventDefault();
    this.markDirty();
    targets.forEach(o => this.fc!.remove(o));
    this.fc.discardActiveObject();
    this.fc.requestRenderAll();
  };

  private readonly toolService = inject(ToolService);
  private readonly annotationService = inject(AnnotationService);
  private readonly historyService = inject(HistoryService);

  private readonly toolEffect = effect(() => {
    const tool = this.toolService.activeTool();
    const opts = this.toolService.options();
    if (this.fc) this.applyTool(tool, opts);
  });

  async ngAfterViewInit(): Promise<void> {
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

    this.fc.on('object:added',    (e: any) => { if (e.target) this.attachDeleteControl(e.target); this.persist(); });
    this.fc.on('object:modified', () => this.persist());
    this.fc.on('object:removed',  () => this.persist());
    this.fc.on('mouse:down', (e) => this.onMouseDown(e));
    this.fc.on('mouse:move', (e) => this.onMouseMove(e));
    this.fc.on('mouse:up',   ()  => this.onMouseUp());

    document.addEventListener('keydown', this.keydownHandler);

    this.loadSavedAnnotations();
    this.applyTool(this.toolService.activeTool(), this.toolService.options());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const wChange = changes['width'];
    if (!wChange || wChange.firstChange || !this.fc) return;

    const oldW = wChange.previousValue as number;
    const newW = wChange.currentValue as number;
    if (!oldW || oldW === newW) return;

    const ratio = newW / oldW;
    this.fc.setDimensions({ width: this.width, height: this.height });
    this.fc.getObjects().forEach(obj => {
      obj.set({
        left:   (obj.left   ?? 0) * ratio,
        top:    (obj.top    ?? 0) * ratio,
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

  private loadSavedAnnotations(): void {
    const saved = this.annotationService.getPageJson(this.pageIndex);
    if (saved) {
      this.isUndoRedoing = true;
      this.fc!.loadFromJSON(JSON.parse(saved)).then(() => {
        this.fc?.getObjects().forEach(o => this.attachDeleteControl(o));
        this.fc?.renderAll();
        this.isUndoRedoing = false;
      });
    }
  }

  private applyTool(tool: ToolType, opts: ToolOptions): void {
    if (!this.fc || !this.fab) return;
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

  private attachDeleteControl(obj: FabricType.Object): void {
    if (!this.fab || (obj as any).__deleteAdded) return;
    (obj as any).__deleteAdded = true;
    const ctrl = new this.fab.Control({
      x: 0.5,
      y: -0.5,
      offsetX: 16,
      offsetY: -16,
      cursorStyle: 'pointer',
      mouseUpHandler: (_e: any, transform: any) => {
        this.markDirty();
        this.fc!.remove(transform.target);
        this.fc!.requestRenderAll();
        return true;
      },
      render: (ctx: CanvasRenderingContext2D, left: number, top: number) => {
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
        ctx.moveTo(-4, -4); ctx.lineTo(4, 4);
        ctx.moveTo(4, -4);  ctx.lineTo(-4, 4);
        ctx.stroke();
        ctx.restore();
      },
    });
    (obj as any).controls = { ...(obj as any).controls, deleteControl: ctrl };
  }

  private markDirty(): void {
    if (this.isUndoRedoing || !this.fc) return;
    this.pendingUndo = JSON.stringify(this.fc.toJSON());
  }

  private onMouseDown(e: FabricType.TPointerEventInfo): void {
    this.markDirty();
    if (!this.fab) return;

    const tool = this.toolService.activeTool();
    const opts = this.toolService.options();
    const pt = e.scenePoint as unknown as { x: number; y: number };

    if (tool === ToolType.Text) {
      const tb = new this.fab.Textbox('Text', {
        left: pt.x, top: pt.y,
        originX: 'left', originY: 'top',
        fontSize: opts.fontSize,
        fill: opts.color,
        fontFamily: opts.fontFamily,
        width: 200,
      });
      this.fc!.add(tb);
      this.fc!.setActiveObject(tb);
      const itext = tb as FabricType.IText;
      itext.enterEditing?.();
      itext.selectAll?.();
      return;
    }

    const shapeTools = [ToolType.Rectangle, ToolType.Circle, ToolType.Arrow, ToolType.Line];
    if (!shapeTools.includes(tool)) return;

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
    if (this.activeShape) this.fc!.add(this.activeShape);
  }

  private onMouseMove(e: FabricType.TPointerEventInfo): void {
    if (!this.drawingShape || !this.activeShape || !this.shapeOrigin) return;
    const pt = e.scenePoint as unknown as { x: number; y: number };
    const o = this.shapeOrigin;
    const tool = this.toolService.activeTool();

    switch (tool) {
      case ToolType.Rectangle:
        (this.activeShape as FabricType.Rect).set({
          left: (o.x + pt.x) / 2, top: (o.y + pt.y) / 2,
          width: Math.abs(pt.x - o.x), height: Math.abs(pt.y - o.y),
        });
        break;
      case ToolType.Circle:
        (this.activeShape as FabricType.Ellipse).set({
          left: (o.x + pt.x) / 2, top: (o.y + pt.y) / 2,
          rx: Math.abs(pt.x - o.x) / 2, ry: Math.abs(pt.y - o.y) / 2,
        });
        break;
      case ToolType.Line:
      case ToolType.Arrow:
        (this.activeShape as FabricType.Line).set({ x2: pt.x, y2: pt.y });
        break;
    }
    this.fc!.renderAll();
  }

  private onMouseUp(): void {
    if (!this.drawingShape) return;
    this.drawingShape = false;
    if (this.activeShape && this.toolService.activeTool() === ToolType.Arrow) {
      this.addArrowhead(this.activeShape as FabricType.Line);
    }
    if (this.activeShape) {
      this.fc!.renderAll();
      this.activeShape = null;
      this.persist();
    }
    this.shapeOrigin = null;
  }

  private addArrowhead(line: FabricType.Line): void {
    if (!this.fab) return;
    const { size, color } = this.toolService.options();
    const x1 = (line as any).x1 ?? 0, y1 = (line as any).y1 ?? 0;
    const x2 = (line as any).x2 ?? 0, y2 = (line as any).y2 ?? 0;
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    this.fc!.add(new this.fab.Triangle({
      left: x2, top: y2, originX: 'center', originY: 'center',
      width: size * 5, height: size * 5, fill: color, angle: angle + 90, selectable: false,
    }));
  }

  private persist(): void {
    if (!this.fc) return;
    const json = JSON.stringify(this.fc.toJSON());
    if (!this.isUndoRedoing && this.pendingUndo !== null) {
      this.historyService.push(this.pageIndex, this.pendingUndo);
      this.pendingUndo = null;
    }
    this.annotationService.savePageJson(this.pageIndex, json);
  }

  getCurrentState(): string {
    return this.fc ? JSON.stringify(this.fc.toJSON()) : '{}';
  }

  async restoreState(state: string): Promise<void> {
    if (!this.fc) return;
    this.isUndoRedoing = true;
    await this.fc.loadFromJSON(JSON.parse(state));
    this.fc.getObjects().forEach(o => this.attachDeleteControl(o));
    this.fc.renderAll();
    this.annotationService.savePageJson(this.pageIndex, state);
    this.isUndoRedoing = false;
  }

  private toRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  getFabricCanvas(): FabricType.Canvas | null { return this.fc; }

  ngOnDestroy(): void {
    this.toolEffect.destroy();
    document.removeEventListener('keydown', this.keydownHandler);
    this.fc?.dispose();
  }
}
