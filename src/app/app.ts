import { Component, signal } from '@angular/core';
import { PdfEditorComponent } from '../lib/pdf-editor';
import { EditorConfig } from '../lib/pdf-editor/models/editor-config.model';

@Component({
  selector: 'app-root',
  imports: [PdfEditorComponent],
  template: `
    <div class="demo-layout">
      <header class="demo-header">
        <div class="demo-header__brand">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="demo-logo">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span class="demo-header__title">PDF Editor</span>
        </div>
        <div class="demo-header__controls">
          <button
            class="demo-theme-btn"
            (click)="toggleTheme()"
            [title]="theme() === 'dark' ? 'Light mode' : 'Dark mode'"
          >
            @if (theme() === 'dark') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            }
          </button>
        </div>
      </header>

      <main class="demo-main">
        <pdf-editor [config]="editorConfig()" />
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
      font-family: Inter, system-ui, sans-serif;
    }

    .demo-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #f4f6f8;
    }

    .demo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 52px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
      z-index: 100;
    }

    .demo-header__brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .demo-logo {
      width: 24px;
      height: 24px;
      color: #1e88e5;
    }

    .demo-header__title {
      font-size: 16px;
      font-weight: 700;
      color: #1a202c;
      letter-spacing: -.3px;
    }

    .demo-theme-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      color: #4a5568;
      transition: background .15s, color .15s;
    }

    .demo-theme-btn:hover { background: #eff6ff; color: #1e88e5; }
    .demo-theme-btn svg { width: 18px; height: 18px; }

    .demo-main {
      flex: 1;
      overflow: hidden;
    }

    pdf-editor { width: 100%; height: 100%; display: block; }
  `],
})
export class App {
  readonly theme = signal<'light' | 'dark'>('light');

  readonly editorConfig = signal<EditorConfig>({
    theme: 'light',
    toolbar: { position: 'top', show: true },
    defaultTool: 'pen' as any,
    zoom: { min: 0.5, max: 4, default: 1, step: 0.25 },
    pageGap: 20,
  });

  toggleTheme(): void {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.editorConfig.update(c => ({ ...c, theme: next }));
  }
}
