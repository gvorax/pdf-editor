# @gvorax/pdf-editor

An Angular library for viewing and annotating PDF files. Supports freehand drawing, highlighting, text, shapes, eraser, undo/redo, zoom, and export.

[![npm version](https://img.shields.io/npm/v/@gvorax/pdf-editor)](https://www.npmjs.com/package/@gvorax/pdf-editor)

## Requirements

- Angular **17** or higher
- `fabric` ≥ 6.0.0
- `pdfjs-dist` ≥ 4.0.0
- `pdf-lib` ≥ 1.0.0

## Installation

```bash
npm install @gvorax/pdf-editor fabric pdfjs-dist pdf-lib
```

### Configure the PDF.js worker

In your `angular.json`, add the worker file to the assets of your application:

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "pdf.worker.mjs",
    "input": "node_modules/pdfjs-dist/build/",
    "output": "/"
  }
]
```

---

## Basic Usage

Import `PdfEditorComponent` into your standalone component:

```typescript
import { Component } from '@angular/core';
import { PdfEditorComponent } from '@gvorax/pdf-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PdfEditorComponent],
  template: `
    <pdf-editor style="width: 100%; height: 100vh; display: block;" />
  `,
})
export class AppComponent {}
```

The editor renders a drag-and-drop zone when no PDF is loaded. The user can drop a PDF file or click the upload button.

---

## Loading a PDF Programmatically

You can pass a URL, a `File` object, or an `ArrayBuffer` via the `[src]` input:

```typescript
@Component({
  imports: [PdfEditorComponent],
  template: `<pdf-editor [src]="url" style="width:100%;height:100vh;display:block;" />`,
})
export class AppComponent {
  url = 'https://example.com/document.pdf';
}
```

Or trigger loading from a button using a `@ViewChild` reference:

```typescript
import { Component, ViewChild } from '@angular/core';
import { PdfEditorComponent } from '@gvorax/pdf-editor';

@Component({
  imports: [PdfEditorComponent],
  template: `
    <pdf-editor #editor style="width:100%;height:100vh;display:block;" />
    <button (click)="load()">Load PDF</button>
  `,
})
export class AppComponent {
  @ViewChild('editor') editor!: PdfEditorComponent;

  async load() {
    await this.editor.loadSrc('https://example.com/document.pdf');
  }
}
```

---

## Configuration

Pass an `EditorConfig` object to the `[config]` input to customize the editor:

```typescript
import { PdfEditorComponent, EditorConfig } from '@gvorax/pdf-editor';

@Component({
  imports: [PdfEditorComponent],
  template: `<pdf-editor [config]="config" style="width:100%;height:100vh;display:block;" />`,
})
export class AppComponent {
  config: EditorConfig = {
    theme: 'dark',
    toolbar: { position: 'left' },
    defaultTool: 'pen',
    pageGap: 24,
    zoom: { default: 1.25, min: 0.5, max: 3, step: 0.25 },
  };
}
```

### EditorConfig Options

| Option | Type | Default | Description |
|---|---|---|---|
| `theme` | `'light' \| 'dark' \| 'custom'` | `'light'` | Editor color theme |
| `toolbar.position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Toolbar placement |
| `toolbar.show` | `boolean` | `true` | Show or hide the toolbar |
| `toolbar.tools` | `ToolType[]` | all tools | Restrict which tools appear |
| `defaultTool` | `ToolType` | `'pen'` | Active tool on load |
| `defaultColor` | `string` | `'#e53935'` | Default drawing color |
| `colors` | `string[]` | 8 colors | Color palette swatches |
| `zoom.default` | `number` | `1` | Initial zoom level |
| `zoom.min` | `number` | `0.5` | Minimum zoom level |
| `zoom.max` | `number` | `3` | Maximum zoom level |
| `zoom.step` | `number` | `0.25` | Zoom step on each click |
| `pageGap` | `number` | `16` | Gap between pages in px |
| `cssVars` | `Record<string, string>` | `{}` | Override CSS variables (use with `theme: 'custom'`) |

---

## Available Tools

| Tool | Value | Description |
|---|---|---|
| Select | `'select'` | Select and move annotations |
| Pen | `'pen'` | Freehand drawing |
| Highlighter | `'highlighter'` | Semi-transparent freehand brush |
| Text | `'text'` | Add a text box |
| Rectangle | `'rectangle'` | Draw a rectangle |
| Circle | `'circle'` | Draw an ellipse |
| Arrow | `'arrow'` | Draw an arrow |
| Line | `'line'` | Draw a straight line |
| Eraser | `'eraser'` | Erase drawn content |

### Show only specific tools

```typescript
import { EditorConfig, ToolType } from '@gvorax/pdf-editor';

config: EditorConfig = {
  toolbar: {
    tools: [ToolType.Pen, ToolType.Highlighter, ToolType.Text, ToolType.Eraser],
  },
};
```

---

## Theming

### Built-in themes

```typescript
// Light (default)
config: EditorConfig = { theme: 'light' };

// Dark
config: EditorConfig = { theme: 'dark' };
```

### Custom theme via CSS variables

Set `theme: 'custom'` and override any `--pfe-*` variable:

```typescript
config: EditorConfig = {
  theme: 'custom',
  cssVars: {
    '--pfe-bg': '#1a1a2e',
    '--pfe-toolbar-bg': '#16213e',
    '--pfe-accent': '#e94560',
    '--pfe-text': '#eaeaea',
    '--pfe-border': '#0f3460',
  },
};
```

### All available CSS variables

| Variable | Description |
|---|---|
| `--pfe-bg` | Editor background color |
| `--pfe-toolbar-bg` | Toolbar background color |
| `--pfe-toolbar-shadow` | Toolbar box shadow |
| `--pfe-border` | Border and divider color |
| `--pfe-accent` | Accent / active color |
| `--pfe-accent-hover` | Accent hover color |
| `--pfe-hover` | Button hover background |
| `--pfe-text` | Primary text color |
| `--pfe-muted` | Muted / secondary text color |
| `--pfe-icon` | Icon color |
| `--pfe-page-shadow` | PDF page drop shadow |
| `--pfe-page-radius` | PDF page border radius |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo last annotation |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + Y` | Redo (alternative) |

---

## Custom Worker URL

By default the library loads the PDF.js worker from `/pdf.worker.mjs`. If you serve it from a different path, override the `PDFJS_WORKER_URL` token in your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { PDFJS_WORKER_URL } from '@gvorax/pdf-editor';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: PDFJS_WORKER_URL, useValue: '/assets/pdf.worker.mjs' },
  ],
};
```

---

## License

MIT
