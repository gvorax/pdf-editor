export enum ToolType {
  Select = 'select',
  Pen = 'pen',
  Highlighter = 'highlighter',
  Text = 'text',
  Rectangle = 'rectangle',
  Circle = 'circle',
  Arrow = 'arrow',
  Line = 'line',
  Eraser = 'eraser',
}

export interface ToolOptions {
  color: string;
  size: number;
  opacity: number;
  fontSize: number;
  fontFamily: string;
}

export const DEFAULT_TOOL_OPTIONS: ToolOptions = {
  color: '#e53935',
  size: 3,
  opacity: 1,
  fontSize: 16,
  fontFamily: 'Inter, sans-serif',
};

export const DEFAULT_COLORS = [
  '#e53935', '#fb8c00', '#fdd835', '#43a047',
  '#1e88e5', '#8e24aa', '#000000', '#ffffff',
];
