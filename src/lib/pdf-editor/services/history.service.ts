import { Injectable, signal } from '@angular/core';

interface HistoryEntry { pageIndex: number; state: string; }

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];

  readonly canUndo = signal(false);
  readonly canRedo = signal(false);

  push(pageIndex: number, beforeState: string): void {
    this.undoStack.push({ pageIndex, state: beforeState });
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
    this.canUndo.set(true);
    this.canRedo.set(false);
  }

  popUndo(): HistoryEntry | undefined {
    const e = this.undoStack.pop();
    this.canUndo.set(this.undoStack.length > 0);
    return e;
  }

  pushUndo(pageIndex: number, state: string): void {
    this.undoStack.push({ pageIndex, state });
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.canUndo.set(true);
  }

  pushRedo(pageIndex: number, state: string): void {
    this.redoStack.push({ pageIndex, state });
    this.canRedo.set(true);
  }

  popRedo(): HistoryEntry | undefined {
    const e = this.redoStack.pop();
    this.canRedo.set(this.redoStack.length > 0);
    return e;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.canUndo.set(false);
    this.canRedo.set(false);
  }
}
