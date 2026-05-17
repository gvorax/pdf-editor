import { ToolType } from './tool.model';

export interface PageAnnotations {
  pageIndex: number;
  fabricJson: string; // Fabric.js canvas JSON
}

export interface AnnotationSession {
  pages: PageAnnotations[];
  createdAt: number;
}

export interface TextAnnotation {
  type: ToolType.Text;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontFamily: string;
  pageIndex: number;
}
