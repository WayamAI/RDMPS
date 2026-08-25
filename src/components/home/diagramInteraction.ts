import type { Scope } from './diagramModel';

export type DiagramKeyboardAction =
  | 'pan-left'
  | 'pan-right'
  | 'pan-up'
  | 'pan-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'fit';

export function shouldHandleDiagramWheel(input: { ctrlKey: boolean; metaKey: boolean }) {
  return input.ctrlKey || input.metaKey;
}

export function diagramKeyboardAction(key: string): DiagramKeyboardAction | null {
  const actions: Record<string, DiagramKeyboardAction> = {
    ArrowLeft: 'pan-left',
    ArrowRight: 'pan-right',
    ArrowUp: 'pan-up',
    ArrowDown: 'pan-down',
    '+': 'zoom-in',
    '=': 'zoom-in',
    '-': 'zoom-out',
    '0': 'fit',
  };
  return actions[key] ?? null;
}

export function isScopeVisible(mode: 'all' | 'required', scope: Scope) {
  return mode === 'all' || scope === 'required';
}
