/**
 * Keyboard Shortcuts Manager - Comprehensive keyboard input handling
 */

export interface KeyboardShortcut {
  id: string;
  keys: string[];
  action: string;
  description: string;
  category: string;
  enabled?: boolean;
}

export interface KeyCombo {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  key: string;
}

// ===== DEFAULT SHORTCUTS =====

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  // File Operations
  {
    id: 'file-new',
    keys: ['ctrl', 'n'],
    action: 'file:new',
    description: 'Create new blueprint',
    category: 'File',
  },
  {
    id: 'file-open',
    keys: ['ctrl', 'o'],
    action: 'file:open',
    description: 'Open blueprint',
    category: 'File',
  },
  {
    id: 'file-save',
    keys: ['ctrl', 's'],
    action: 'file:save',
    description: 'Save blueprint',
    category: 'File',
  },
  {
    id: 'file-save-as',
    keys: ['ctrl', 'shift', 's'],
    action: 'file:save-as',
    description: 'Save blueprint as',
    category: 'File',
  },

  // Edit Operations
  {
    id: 'edit-undo',
    keys: ['ctrl', 'z'],
    action: 'edit:undo',
    description: 'Undo',
    category: 'Edit',
  },
  {
    id: 'edit-redo',
    keys: ['ctrl', 'y'],
    action: 'edit:redo',
    description: 'Redo',
    category: 'Edit',
  },
  {
    id: 'edit-cut',
    keys: ['ctrl', 'x'],
    action: 'edit:cut',
    description: 'Cut selection',
    category: 'Edit',
  },
  {
    id: 'edit-copy',
    keys: ['ctrl', 'c'],
    action: 'edit:copy',
    description: 'Copy selection',
    category: 'Edit',
  },
  {
    id: 'edit-paste',
    keys: ['ctrl', 'v'],
    action: 'edit:paste',
    description: 'Paste from clipboard',
    category: 'Edit',
  },
  {
    id: 'edit-duplicate',
    keys: ['ctrl', 'd'],
    action: 'edit:duplicate',
    description: 'Duplicate selection',
    category: 'Edit',
  },
  {
    id: 'edit-delete',
    keys: ['Delete'],
    action: 'edit:delete',
    description: 'Delete selection',
    category: 'Edit',
  },
  {
    id: 'edit-select-all',
    keys: ['ctrl', 'a'],
    action: 'edit:select-all',
    description: 'Select all nodes',
    category: 'Edit',
  },
  {
    id: 'edit-deselect',
    keys: ['Escape'],
    action: 'edit:deselect',
    description: 'Deselect all',
    category: 'Edit',
  },

  // View Operations
  {
    id: 'view-zoom-in',
    keys: ['ctrl', '+'],
    action: 'view:zoom-in',
    description: 'Zoom in',
    category: 'View',
  },
  {
    id: 'view-zoom-out',
    keys: ['ctrl', '-'],
    action: 'view:zoom-out',
    description: 'Zoom out',
    category: 'View',
  },
  {
    id: 'view-zoom-reset',
    keys: ['ctrl', '0'],
    action: 'view:zoom-reset',
    description: 'Reset zoom',
    category: 'View',
  },
  {
    id: 'view-fit-screen',
    keys: ['ctrl', 'shift', 'f'],
    action: 'view:fit-screen',
    description: 'Fit to screen',
    category: 'View',
  },
  {
    id: 'view-pan-up',
    keys: ['ArrowUp'],
    action: 'view:pan-up',
    description: 'Pan up',
    category: 'View',
  },
  {
    id: 'view-pan-down',
    keys: ['ArrowDown'],
    action: 'view:pan-down',
    description: 'Pan down',
    category: 'View',
  },
  {
    id: 'view-pan-left',
    keys: ['ArrowLeft'],
    action: 'view:pan-left',
    description: 'Pan left',
    category: 'View',
  },
  {
    id: 'view-pan-right',
    keys: ['ArrowRight'],
    action: 'view:pan-right',
    description: 'Pan right',
    category: 'View',
  },

  // Tools
  {
    id: 'tool-validate',
    keys: ['ctrl', 'shift', 'v'],
    action: 'tool:validate',
    description: 'Validate graph',
    category: 'Tools',
  },
  {
    id: 'tool-execute',
    keys: ['F5'],
    action: 'tool:execute',
    description: 'Execute blueprint',
    category: 'Tools',
  },
  {
    id: 'tool-search',
    keys: ['ctrl', 'f'],
    action: 'tool:search',
    description: 'Search nodes',
    category: 'Tools',
  },
  {
    id: 'tool-find-replace',
    keys: ['ctrl', 'h'],
    action: 'tool:find-replace',
    description: 'Find & replace',
    category: 'Tools',
  },

  // Alignment
  {
    id: 'align-left',
    keys: ['ctrl', 'alt', 'l'],
    action: 'align:left',
    description: 'Align left',
    category: 'Alignment',
  },
  {
    id: 'align-center-h',
    keys: ['ctrl', 'alt', 'h'],
    action: 'align:center-h',
    description: 'Align center horizontal',
    category: 'Alignment',
  },
  {
    id: 'align-right',
    keys: ['ctrl', 'alt', 'r'],
    action: 'align:right',
    description: 'Align right',
    category: 'Alignment',
  },
  {
    id: 'align-top',
    keys: ['ctrl', 'alt', 't'],
    action: 'align:top',
    description: 'Align top',
    category: 'Alignment',
  },
  {
    id: 'align-center-v',
    keys: ['ctrl', 'alt', 'v'],
    action: 'align:center-v',
    description: 'Align center vertical',
    category: 'Alignment',
  },
  {
    id: 'align-bottom',
    keys: ['ctrl', 'alt', 'b'],
    action: 'align:bottom',
    description: 'Align bottom',
    category: 'Alignment',
  },

  // Help
  {
    id: 'help-shortcuts',
    keys: ['?'],
    action: 'help:shortcuts',
    description: 'Show keyboard shortcuts',
    category: 'Help',
  },
];

// ===== KEYBOARD EVENT HANDLING =====

export interface KeyboardEvent {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  key: string;
  timestamp: number;
}

export function parseKeyboardEvent(event: any): KeyboardEvent {
  return {
    ctrl: event.ctrlKey || event.metaKey,
    shift: event.shiftKey,
    alt: event.altKey,
    meta: event.metaKey,
    key: event.key,
    timestamp: Date.now(),
  };
}

export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean {
  const eventKeys = getEventKeys(event);
  return keysMatch(eventKeys, shortcut.keys);
}

function getEventKeys(event: KeyboardEvent): string[] {
  const keys: string[] = [];
  if (event.ctrl) keys.push('ctrl');
  if (event.shift) keys.push('shift');
  if (event.alt) keys.push('alt');
  if (event.meta) keys.push('meta');
  keys.push(event.key.toLowerCase());
  return keys;
}

function keysMatch(eventKeys: string[], shortcutKeys: string[]): boolean {
  if (eventKeys.length !== shortcutKeys.length) return false;
  const shortcutSet = new Set(shortcutKeys.map((k) => k.toLowerCase()));
  return eventKeys.every((k) => shortcutSet.has(k.toLowerCase()));
}

// ===== SHORTCUT MANAGEMENT =====

export function getShortcutsByCategory(
  shortcuts: KeyboardShortcut[],
  category: string
): KeyboardShortcut[] {
  return shortcuts.filter((s) => s.category === category);
}

export function getShortcutByAction(
  shortcuts: KeyboardShortcut[],
  action: string
): KeyboardShortcut | undefined {
  return shortcuts.find((s) => s.action === action);
}

export function formatShortcut(shortcut: KeyboardShortcut): string {
  return shortcut.keys.map((k) => capitalizeKey(k)).join('+');
}

function capitalizeKey(key: string): string {
  switch (key.toLowerCase()) {
    case 'ctrl':
      return 'Ctrl';
    case 'shift':
      return 'Shift';
    case 'alt':
      return 'Alt';
    case 'meta':
      return 'Cmd';
    case 'arrowup':
      return '↑';
    case 'arrowdown':
      return '↓';
    case 'arrowleft':
      return '←';
    case 'arrowright':
      return '→';
    default:
      return key.charAt(0).toUpperCase() + key.slice(1);
  }
}

export function addCustomShortcut(
  shortcuts: KeyboardShortcut[],
  shortcut: KeyboardShortcut
): KeyboardShortcut[] {
  return [...shortcuts, shortcut];
}

export function removeShortcut(
  shortcuts: KeyboardShortcut[],
  shortcutId: string
): KeyboardShortcut[] {
  return shortcuts.filter((s) => s.id !== shortcutId);
}

export function updateShortcut(
  shortcuts: KeyboardShortcut[],
  shortcutId: string,
  updates: Partial<KeyboardShortcut>
): KeyboardShortcut[] {
  return shortcuts.map((s) =>
    s.id === shortcutId ? { ...s, ...updates } : s
  );
}

// ===== SHORTCUT VALIDATION =====

export function validateShortcut(
  keys: string[]
): { valid: boolean; reason?: string } {
  if (keys.length === 0) {
    return { valid: false, reason: 'Shortcut must have at least one key' };
  }

  const modifiers = ['ctrl', 'shift', 'alt', 'meta'];
  const lastKey = keys[keys.length - 1];

  if (modifiers.includes(lastKey)) {
    return { valid: false, reason: 'Last key cannot be a modifier' };
  }

  return { valid: true };
}

export function checkConflict(
  shortcuts: KeyboardShortcut[],
  keys: string[]
): KeyboardShortcut | undefined {
  return shortcuts.find((s) => keysMatch(s.keys, keys));
}

// ===== SHORTCUT CATEGORIES =====

export function getCategories(shortcuts: KeyboardShortcut[]): string[] {
  const categories = new Set(shortcuts.map((s) => s.category));
  return Array.from(categories).sort();
}

// ===== EXPORT SHORTCUTS =====

export function exportShortcuts(shortcuts: KeyboardShortcut[]): string {
  return JSON.stringify(shortcuts, null, 2);
}

export function importShortcuts(jsonString: string): KeyboardShortcut[] | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// ===== SHORTCUT CONFLICT DETECTION =====

export interface ShortcutConflict {
  shortcut1: KeyboardShortcut;
  shortcut2: KeyboardShortcut;
}

export function detectConflicts(shortcuts: KeyboardShortcut[]): ShortcutConflict[] {
  const conflicts: ShortcutConflict[] = [];

  for (let i = 0; i < shortcuts.length; i++) {
    for (let j = i + 1; j < shortcuts.length; j++) {
      if (keysMatch(shortcuts[i].keys, shortcuts[j].keys)) {
        conflicts.push({
          shortcut1: shortcuts[i],
          shortcut2: shortcuts[j],
        });
      }
    }
  }

  return conflicts;
}
