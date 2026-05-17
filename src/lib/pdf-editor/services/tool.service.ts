import { Injectable, signal, computed } from '@angular/core';
import { ToolType, ToolOptions, DEFAULT_TOOL_OPTIONS } from '../models';

@Injectable({ providedIn: 'root' })
export class ToolService {
  readonly activeTool = signal<ToolType>(ToolType.Pen);
  readonly options = signal<ToolOptions>({ ...DEFAULT_TOOL_OPTIONS });

  readonly isDrawingTool = computed(() => {
    const t = this.activeTool();
    return [ToolType.Pen, ToolType.Highlighter, ToolType.Rectangle,
            ToolType.Circle, ToolType.Arrow, ToolType.Line].includes(t);
  });

  setTool(tool: ToolType): void {
    this.activeTool.set(tool);
  }

  setColor(color: string): void {
    this.options.update(o => ({ ...o, color }));
  }

  setSize(size: number): void {
    this.options.update(o => ({ ...o, size }));
  }

  setOpacity(opacity: number): void {
    this.options.update(o => ({ ...o, opacity }));
  }

  setFontSize(fontSize: number): void {
    this.options.update(o => ({ ...o, fontSize }));
  }
}
