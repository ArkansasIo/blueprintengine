/**
 * Menu System - Complete menu structure for the blueprint editor IDE
 */

import { MenuHandler } from './menu-handlers';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  action?: () => void;
  enabled?: boolean;
  submenu?: MenuItem[];
  divider?: boolean;
  badge?: string;
}

export interface MenuContext {
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  selectionCount: number;
  clipboardHasContent: boolean;
  isExecuting: boolean;
}

// Create a default handler instance
let menuHandler = new MenuHandler();

// ===== SET MENU HANDLER =====

export function setMenuHandler(handler: MenuHandler) {
  menuHandler = handler;
}

// ===== FILE MENU =====

export function getFileMenu(context: MenuContext): MenuItem {
  return {
    id: 'file-menu',
    label: 'File',
    submenu: [
      {
        id: 'file-new',
        label: 'New Blueprint',
        icon: 'file-document-outline',
        shortcut: 'Ctrl+N',
        action: () => menuHandler.handleNewBlueprint(),
      },
      {
        id: 'file-open',
        label: 'Open',
        icon: 'folder-open-outline',
        shortcut: 'Ctrl+O',
        action: () => menuHandler.handleOpenBlueprint(),
      },
      {
        id: 'file-open-recent',
        label: 'Open Recent',
        icon: 'history',
        submenu: [
          { id: 'recent-1', label: 'Blueprint_001.json', action: () => menuHandler.handleOpenBlueprint() },
          { id: 'recent-2', label: 'Blueprint_002.json', action: () => menuHandler.handleOpenBlueprint() },
          { id: 'recent-3', label: 'Blueprint_003.json', action: () => menuHandler.handleOpenBlueprint() },
          { divider: true },
          { id: 'recent-clear', label: 'Clear Recent', action: () => console.log('Clear recent files') },
        ],
      },
      { divider: true },
      {
        id: 'file-save',
        label: 'Save',
        icon: 'content-save-outline',
        shortcut: 'Ctrl+S',
        action: () => menuHandler.handleSaveBlueprint(),
      },
      {
        id: 'file-save-as',
        label: 'Save As...',
        icon: 'content-save-edit-outline',
        shortcut: 'Ctrl+Shift+S',
        action: () => menuHandler.handleSaveAsBlueprint(),
      },
      { divider: true },
      {
        id: 'file-import',
        label: 'Import',
        icon: 'download-outline',
        submenu: [
          { id: 'import-json', label: 'From JSON', action: () => menuHandler.handleImportBlueprint() },
          { id: 'import-csv', label: 'From CSV', action: () => menuHandler.handleImportBlueprint() },
          { id: 'import-yaml', label: 'From YAML', action: () => menuHandler.handleImportBlueprint() },
        ],
      },
      {
        id: 'file-export',
        label: 'Export',
        icon: 'upload-outline',
        submenu: [
          { id: 'export-json', label: 'As JSON', action: () => menuHandler.handleExportBlueprint() },
          { id: 'export-csv', label: 'As CSV', action: () => menuHandler.handleExportBlueprint() },
          { id: 'export-svg', label: 'As SVG', action: () => menuHandler.handleExportBlueprint() },
          { id: 'export-yaml', label: 'As YAML', action: () => menuHandler.handleExportBlueprint() },
        ],
      },
      { divider: true },
      {
        id: 'file-exit',
        label: 'Exit',
        icon: 'exit-to-app',
        shortcut: 'Ctrl+Q',
        action: () => console.log('Exit application'),
      },
    ],
  };
}

// ===== EDIT MENU =====

export function getEditMenu(context: MenuContext): MenuItem {
  return {
    id: 'edit-menu',
    label: 'Edit',
    submenu: [
      {
        id: 'edit-undo',
        label: 'Undo',
        icon: 'undo',
        shortcut: 'Ctrl+Z',
        enabled: context.canUndo,
        action: () => menuHandler.handleUndo(),
      },
      {
        id: 'edit-redo',
        label: 'Redo',
        icon: 'redo',
        shortcut: 'Ctrl+Y',
        enabled: context.canRedo,
        action: () => menuHandler.handleRedo(),
      },
      { divider: true },
      {
        id: 'edit-cut',
        label: 'Cut',
        icon: 'content-cut',
        shortcut: 'Ctrl+X',
        enabled: context.hasSelection,
        action: () => menuHandler.handleCut(),
      },
      {
        id: 'edit-copy',
        label: 'Copy',
        icon: 'content-copy',
        shortcut: 'Ctrl+C',
        enabled: context.hasSelection,
        action: () => menuHandler.handleCopy(),
      },
      {
        id: 'edit-paste',
        label: 'Paste',
        icon: 'content-paste',
        shortcut: 'Ctrl+V',
        enabled: context.clipboardHasContent,
        action: () => menuHandler.handlePaste(),
      },
      { divider: true },
      {
        id: 'edit-duplicate',
        label: 'Duplicate',
        icon: 'content-duplicate',
        shortcut: 'Ctrl+D',
        enabled: context.hasSelection,
        action: () => menuHandler.handleDuplicate(),
      },
      {
        id: 'edit-delete',
        label: 'Delete',
        icon: 'delete-outline',
        shortcut: 'Delete',
        enabled: context.hasSelection,
        action: () => menuHandler.handleDelete(),
      },
      { divider: true },
      {
        id: 'edit-select-all',
        label: 'Select All',
        icon: 'select-all',
        shortcut: 'Ctrl+A',
        action: () => menuHandler.handleSelectAll(),
      },
      {
        id: 'edit-deselect-all',
        label: 'Deselect All',
        icon: 'select-off',
        shortcut: 'Escape',
        action: () => menuHandler.handleDeselectAll(),
      },
    ],
  };
}

// ===== VIEW MENU =====

export function getViewMenu(context: MenuContext): MenuItem {
  return {
    id: 'view-menu',
    label: 'View',
    submenu: [
      {
        id: 'view-zoom-in',
        label: 'Zoom In',
        icon: 'magnify-plus-outline',
        shortcut: 'Ctrl+Plus',
        action: () => menuHandler.handleZoomIn(),
      },
      {
        id: 'view-zoom-out',
        label: 'Zoom Out',
        icon: 'magnify-minus-outline',
        shortcut: 'Ctrl+Minus',
        action: () => menuHandler.handleZoomOut(),
      },
      {
        id: 'view-zoom-reset',
        label: 'Reset Zoom',
        icon: 'magnify',
        shortcut: 'Ctrl+0',
        action: () => menuHandler.handleZoomReset(),
      },
      {
        id: 'view-fit-screen',
        label: 'Fit to Screen',
        icon: 'fit-to-screen',
        shortcut: 'Ctrl+Shift+F',
        action: () => menuHandler.handleZoomFit(),
      },
      { divider: true },
      {
        id: 'view-pan-up',
        label: 'Pan Up',
        icon: 'arrow-up-thick',
        action: () => console.log('Pan up'),
      },
      {
        id: 'view-pan-down',
        label: 'Pan Down',
        icon: 'arrow-down-thick',
        action: () => console.log('Pan down'),
      },
      {
        id: 'view-pan-left',
        label: 'Pan Left',
        icon: 'arrow-left-thick',
        action: () => console.log('Pan left'),
      },
      {
        id: 'view-pan-right',
        label: 'Pan Right',
        icon: 'arrow-right-thick',
        action: () => console.log('Pan right'),
      },
      { divider: true },
      {
        id: 'view-grid',
        label: 'Show Grid',
        icon: 'grid',
        action: () => menuHandler.handleToggleGrid(),
      },
      {
        id: 'view-minimap',
        label: 'Show Minimap',
        icon: 'map-outline',
        action: () => console.log('Toggle minimap'),
      },
      {
        id: 'view-inspector',
        label: 'Show Inspector',
        icon: 'information-outline',
        action: () => console.log('Toggle inspector'),
      },
    ],
  };
}

// ===== INSERT MENU =====

export function getInsertMenu(context: MenuContext): MenuItem {
  return {
    id: 'insert-menu',
    label: 'Insert',
    submenu: [
      {
        id: 'insert-node',
        label: 'Node',
        icon: 'cube-outline',
        submenu: [
          { id: 'node-start', label: 'Start', action: () => {}, badge: '⚪' },
          { id: 'node-process', label: 'Process', action: () => {}, badge: '◼' },
          { id: 'node-decision', label: 'Decision', action: () => {}, badge: '◆' },
          { id: 'node-end', label: 'End', action: () => {}, badge: '⚫' },
          { divider: true },
          { id: 'node-success', label: 'Success Handler', action: () => {} },
          { id: 'node-error', label: 'Error Handler', action: () => {} },
          { id: 'node-validation', label: 'Validation', action: () => {} },
          { id: 'node-merge', label: 'Merge', action: () => {} },
        ],
      },
      {
        id: 'insert-comment',
        label: 'Comment',
        icon: 'message-outline',
        action: () => {},
      },
      { divider: true },
      {
        id: 'insert-group',
        label: 'Group',
        icon: 'folder-multiple-outline',
        action: () => {},
      },
    ],
  };
}

// ===== ARRANGE MENU =====

export function getArrangeMenu(context: MenuContext): MenuItem {
  return {
    id: 'arrange-menu',
    label: 'Arrange',
    submenu: [
      {
        id: 'arrange-bring-forward',
        label: 'Bring Forward',
        icon: 'arrange-bring-forward',
        enabled: context.hasSelection,
        action: () => {},
      },
      {
        id: 'arrange-send-backward',
        label: 'Send Backward',
        icon: 'arrange-send-backward',
        enabled: context.hasSelection,
        action: () => {},
      },
      {
        id: 'arrange-bring-to-front',
        label: 'Bring to Front',
        icon: 'arrange-bring-to-front',
        enabled: context.hasSelection,
        action: () => {},
      },
      {
        id: 'arrange-send-to-back',
        label: 'Send to Back',
        icon: 'arrange-send-to-back',
        enabled: context.hasSelection,
        action: () => {},
      },
      { divider: true },
      {
        id: 'arrange-align',
        label: 'Align',
        icon: 'format-align-left',
        enabled: context.selectionCount > 1,
        submenu: [
          { id: 'align-left', label: 'Left', action: () => {} },
          { id: 'align-right', label: 'Right', action: () => {} },
          { id: 'align-top', label: 'Top', action: () => {} },
          { id: 'align-bottom', label: 'Bottom', action: () => {} },
          { divider: true },
          { id: 'align-center-h', label: 'Center Horizontally', action: () => {} },
          { id: 'align-center-v', label: 'Center Vertically', action: () => {} },
        ],
      },
      {
        id: 'arrange-distribute',
        label: 'Distribute',
        icon: 'format-columns',
        enabled: context.selectionCount > 2,
        submenu: [
          { id: 'dist-h-spacing', label: 'Horizontal Spacing', action: () => {} },
          { id: 'dist-v-spacing', label: 'Vertical Spacing', action: () => {} },
        ],
      },
    ],
  };
}

// ===== TOOLS MENU =====

export function getToolsMenu(context: MenuContext): MenuItem {
  return {
    id: 'tools-menu',
    label: 'Tools',
    submenu: [
      {
        id: 'tools-validate',
        label: 'Validate Graph',
        icon: 'check-circle-outline',
        action: () => menuHandler.handleValidate(),
      },
      {
        id: 'tools-execute',
        label: 'Execute',
        icon: 'play-outline',
        shortcut: 'F5',
        action: () => menuHandler.handleExecute(),
      },
      {
        id: 'tools-debug',
        label: 'Debug',
        icon: 'bug-outline',
        action: () => menuHandler.handleDebugMode(),
      },
      { divider: true },
      {
        id: 'tools-search',
        label: 'Search',
        icon: 'magnify',
        shortcut: 'Ctrl+F',
        action: () => console.log('Open search'),
      },
      {
        id: 'tools-find-replace',
        label: 'Find & Replace',
        icon: 'find-replace',
        shortcut: 'Ctrl+H',
        action: () => console.log('Open find & replace'),
      },
      { divider: true },
      {
        id: 'tools-layout',
        label: 'Layout',
        icon: 'call-split',
        submenu: [
          { id: 'layout-hierarchical', label: 'Hierarchical', action: () => console.log('Apply hierarchical layout') },
          { id: 'layout-circular', label: 'Circular', action: () => console.log('Apply circular layout') },
          { id: 'layout-grid', label: 'Grid', action: () => console.log('Apply grid layout') },
          { id: 'layout-force', label: 'Force-Directed', action: () => console.log('Apply force layout') },
          { id: 'layout-tree', label: 'Tree', action: () => console.log('Apply tree layout') },
        ],
      },
      {
        id: 'tools-connect-preset',
        label: 'Connection Presets',
        icon: 'link-variant',
        submenu: [
          { id: 'connect-chain', label: 'Chain', action: () => console.log('Apply chain preset') },
          { id: 'connect-star', label: 'Star', action: () => console.log('Apply star preset') },
          { id: 'connect-mesh', label: 'Mesh', action: () => console.log('Apply mesh preset') },
          { id: 'connect-bipartite', label: 'Bipartite', action: () => console.log('Apply bipartite preset') },
        ],
      },
      {
        id: 'tools-batch-ops',
        label: 'Batch Operations',
        icon: 'folder-multiple-outline',
        action: () => console.log('Open batch operations'),
      },
      { divider: true },
      {
        id: 'tools-settings',
        label: 'Settings',
        icon: 'cog-outline',
        action: () => console.log('Open settings'),
      },
    ],
  };
}

// ===== WINDOW MENU =====

export function getWindowMenu(context: MenuContext): MenuItem {
  return {
    id: 'window-menu',
    label: 'Window',
    submenu: [
      {
        id: 'window-properties',
        label: 'Properties',
        icon: 'format-list-bulleted',
        action: () => {},
      },
      {
        id: 'window-inspector',
        label: 'Inspector',
        icon: 'information-outline',
        action: () => {},
      },
      {
        id: 'window-library',
        label: 'Node Library',
        icon: 'library-outline',
        action: () => {},
      },
      {
        id: 'window-console',
        label: 'Console',
        icon: 'console-line',
        action: () => {},
      },
      { divider: true },
      {
        id: 'window-reset-layout',
        label: 'Reset Layout',
        icon: 'refresh',
        action: () => {},
      },
    ],
  };
}

// ===== HELP MENU =====

export function getHelpMenu(context: MenuContext): MenuItem {
  return {
    id: 'help-menu',
    label: 'Help',
    submenu: [
      {
        id: 'help-about',
        label: 'About Blueprint Editor',
        icon: 'information-outline',
        action: () => {},
      },
      {
        id: 'help-documentation',
        label: 'Documentation',
        icon: 'book-outline',
        action: () => {},
      },
      {
        id: 'help-shortcuts',
        label: 'Keyboard Shortcuts',
        icon: 'keyboard-outline',
        shortcut: '?',
        action: () => {},
      },
      { divider: true },
      {
        id: 'help-tutorials',
        label: 'Tutorials',
        icon: 'school-outline',
        action: () => {},
      },
      {
        id: 'help-examples',
        label: 'Examples',
        icon: 'file-multiple-outline',
        action: () => {},
      },
      { divider: true },
      {
        id: 'help-feedback',
        label: 'Send Feedback',
        icon: 'message-square-outline',
        action: () => {},
      },
      {
        id: 'help-report-bug',
        label: 'Report Bug',
        icon: 'bug-outline',
        action: () => {},
      },
    ],
  };
}

// ===== GET ALL MENUS =====

export function getAllMenus(context: MenuContext): MenuItem[] {
  return [
    getFileMenu(context),
    getEditMenu(context),
    getViewMenu(context),
    getInsertMenu(context),
    getArrangeMenu(context),
    getToolsMenu(context),
    getWindowMenu(context),
    getHelpMenu(context),
  ];
}

// ===== CONTEXT MENU =====

export function getContextMenu(context: MenuContext): MenuItem {
  return {
    id: 'context-menu',
    label: 'Context',
    submenu: [
      {
        id: 'ctx-edit',
        label: 'Edit',
        icon: 'pencil-outline',
        enabled: context.hasSelection,
        action: () => {},
      },
      {
        id: 'ctx-duplicate',
        label: 'Duplicate',
        icon: 'content-duplicate',
        enabled: context.hasSelection,
        action: () => {},
      },
      {
        id: 'ctx-delete',
        label: 'Delete',
        icon: 'delete-outline',
        enabled: context.hasSelection,
        action: () => {},
      },
      { divider: true },
      {
        id: 'ctx-cut',
        label: 'Cut',
        icon: 'content-cut',
        enabled: context.hasSelection,
        action: () => {},
      },
      {
        id: 'ctx-copy',
        label: 'Copy',
        icon: 'content-copy',
        enabled: context.hasSelection,
        action: () => {},
      },
      {
        id: 'ctx-paste',
        label: 'Paste',
        icon: 'content-paste',
        enabled: context.clipboardHasContent,
        action: () => {},
      },
    ],
  };
}
