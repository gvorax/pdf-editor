import { ToolType } from './tool.model';

export type ToolbarPosition = 'top' | 'bottom' | 'left' | 'right';
export type EditorTheme = 'light' | 'dark' | 'custom';

export interface ToolbarConfig {
  position?: ToolbarPosition;
  tools?: ToolType[];
  show?: boolean;
}

export interface ZoomConfig {
  min?: number;
  max?: number;
  default?: number;
  step?: number;
}

export interface EditorConfig {
  theme?: EditorTheme;
  toolbar?: ToolbarConfig;
  defaultTool?: ToolType;
  defaultColor?: string;
  colors?: string[];
  zoom?: ZoomConfig;
  pageGap?: number;
  // CSS variable overrides for 'custom' theme
  cssVars?: Record<string, string>;
}

export const DEFAULT_CONFIG: Required<EditorConfig> = {
  theme: 'light',
  toolbar: { position: 'top', tools: Object.values(ToolType), show: true },
  defaultTool: ToolType.Pen,
  defaultColor: '#e53935',
  colors: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#000000', '#ffffff'],
  zoom: { min: 0.5, max: 3, default: 1, step: 0.25 },
  pageGap: 16,
  cssVars: {},
};
