import { Injectable, signal } from '@angular/core';
import { PageAnnotations, AnnotationSession } from '../models';

@Injectable({ providedIn: 'root' })
export class AnnotationService {
  private readonly store = new Map<number, string>(); // pageIndex → Fabric JSON
  readonly isDirty = signal(false);

  savePageJson(pageIndex: number, json: string): void {
    this.store.set(pageIndex, json);
    this.isDirty.set(true);
  }

  getPageJson(pageIndex: number): string | null {
    return this.store.get(pageIndex) ?? null;
  }

  exportSession(): AnnotationSession {
    const pages: PageAnnotations[] = [];
    this.store.forEach((fabricJson, pageIndex) => {
      pages.push({ pageIndex, fabricJson });
    });
    return { pages, createdAt: Date.now() };
  }

  importSession(session: AnnotationSession): void {
    this.store.clear();
    for (const p of session.pages) {
      this.store.set(p.pageIndex, p.fabricJson);
    }
    this.isDirty.set(false);
  }

  clearPage(pageIndex: number): void {
    this.store.delete(pageIndex);
    this.isDirty.set(true);
  }

  clearAll(): void {
    this.store.clear();
    this.isDirty.set(false);
  }

  hasAnnotations(): boolean {
    return this.store.size > 0;
  }
}
