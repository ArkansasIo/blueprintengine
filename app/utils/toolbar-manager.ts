/**
 * Toolbar Manager - Comprehensive toolbar system with groups, buttons, and actions
 */

export interface ToolbarButton {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action?: () => void;
  enabled?: boolean;
  pressed?: boolean;
  tooltip?: string;
  badge?: string | number;
}

export interface ToolbarGroup {
  id: string;
  label?: string;
  buttons: ToolbarButton[];
  divider?: boolean;
}

export interface ToolbarConfig {
  groups: ToolbarGroup[];
}

export interface ToolbarState {
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  isExecuting: boolean;
  gridVisible: boolean;
  snapEnabled: boolean;
  showMinimap: boolean;
}

// ===== PRIMARY TOOLBAR =====

export function getPrimaryToolbar(state: ToolbarState): ToolbarGroup[] {
  return [
    {
      id: 'primary-file',
      buttons: [
        {
          id: 'tb-new',
          label: 'New',
          icon: 'file-document-outline',
          shortcut: 'Ctrl+N',
          tooltip: 'Create a new blueprint',
        },
        {
          id: 'tb-open',
          label: 'Open',
          icon: 'folder-open-outline',
          shortcut: 'Ctrl+O',
          tooltip: 'Open a blueprint file',
        },
        {
          id: 'tb-save',
          label: 'Save',
          icon: 'content-save-outline',
          shortcut: 'Ctrl+S',
          tooltip: 'Save the current blueprint',
        },
      ],
      divider: true,
    },
    {
      id: 'primary-edit',
      buttons: [
        {
          id: 'tb-undo',
          label: 'Undo',
          icon: 'undo',
          shortcut: 'Ctrl+Z',
          enabled: state.canUndo,
          tooltip: 'Undo last action',
        },
        {
          id: 'tb-redo',
          label: 'Redo',
          icon: 'redo',
          shortcut: 'Ctrl+Y',
          enabled: state.canRedo,
          tooltip: 'Redo last undone action',
        },
      ],
      divider: true,
    },
    {
      id: 'primary-clipboard',
      buttons: [
        {
          id: 'tb-cut',
          label: 'Cut',
          icon: 'content-cut',
          shortcut: 'Ctrl+X',
          enabled: state.hasSelection,
          tooltip: 'Cut selected nodes',
        },
        {
          id: 'tb-copy',
          label: 'Copy',
          icon: 'content-copy',
          shortcut: 'Ctrl+C',
          enabled: state.hasSelection,
          tooltip: 'Copy selected nodes',
        },
        {
          id: 'tb-paste',
          label: 'Paste',
          icon: 'content-paste',
          shortcut: 'Ctrl+V',
          tooltip: 'Paste from clipboard',
        },
      ],
      divider: true,
    },
    {
      id: 'primary-view',
      buttons: [
        {
          id: 'tb-zoom-in',
          label: 'Zoom In',
          icon: 'magnify-plus-outline',
          shortcut: 'Ctrl+Plus',
          tooltip: 'Zoom in',
        },
        {
          id: 'tb-zoom-out',
          label: 'Zoom Out',
          icon: 'magnify-minus-outline',
          shortcut: 'Ctrl+Minus',
          tooltip: 'Zoom out',
        },
        {
          id: 'tb-zoom-reset',
          label: 'Reset',
          icon: 'magnify',
          shortcut: 'Ctrl+0',
          tooltip: 'Reset zoom level',
        },
        {
          id: 'tb-fit-screen',
          label: 'Fit',
          icon: 'fit-to-screen',
          shortcut: 'Ctrl+Shift+F',
          tooltip: 'Fit all nodes to screen',
        },
      ],
      divider: true,
    },
    {
      id: 'primary-tools',
      buttons: [
        {
          id: 'tb-validate',
          label: 'Validate',
          icon: 'check-circle-outline',
          tooltip: 'Validate blueprint graph',
        },
        {
          id: 'tb-execute',
          label: 'Execute',
          icon: 'play-outline',
          shortcut: 'F5',
          tooltip: 'Execute the blueprint',
          enabled: !state.isExecuting,
        },
        {
          id: 'tb-search',
          label: 'Search',
          icon: 'magnify',
          shortcut: 'Ctrl+F',
          tooltip: 'Search nodes',
        },
      ],
      divider: true,
    },
    {
      id: 'primary-view-options',
      buttons: [
        {
          id: 'tb-grid',
          label: 'Grid',
          icon: 'grid',
          pressed: state.gridVisible,
          tooltip: 'Toggle grid visibility',
        },
        {
          id: 'tb-snap',
          label: 'Snap',
          icon: 'magnet',
          pressed: state.snapEnabled,
          tooltip: 'Toggle grid snapping',
        },
        {
          id: 'tb-minimap',
          label: 'Minimap',
          icon: 'map-outline',
          pressed: state.showMinimap,
          tooltip: 'Toggle minimap',
        },
      ],
    },
  ];
}

// ===== NODE TOOLBAR =====

export function getNodeToolbar(state: ToolbarState): ToolbarGroup[] {
  return [
    {
      id: 'node-types',
      label: 'Quick Add',
      buttons: [
        {
          id: 'node-start',
          label: 'Start',
          icon: 'circle-outline',
          tooltip: 'Add start node',
        },
        {
          id: 'node-process',
          label: 'Process',
          icon: 'square-outline',
          tooltip: 'Add process node',
        },
        {
          id: 'node-decision',
          label: 'Decision',
          icon: 'diamond-outline',
          tooltip: 'Add decision node',
        },
        {
          id: 'node-end',
          label: 'End',
          icon: 'circle-slice-8',
          tooltip: 'Add end node',
        },
      ],
      divider: true,
    },
    {
      id: 'node-handlers',
      buttons: [
        {
          id: 'node-success',
          label: 'Success',
          icon: 'check-circle-outline',
          tooltip: 'Add success handler',
        },
        {
          id: 'node-error',
          label: 'Error',
          icon: 'alert-circle-outline',
          tooltip: 'Add error handler',
        },
        {
          id: 'node-validation',
          label: 'Validation',
          icon: 'shield-check-outline',
          tooltip: 'Add validation node',
        },
      ],
    },
  ];
}

// ===== ALIGNMENT TOOLBAR =====

export function getAlignmentToolbar(state: ToolbarState): ToolbarGroup[] {
  return [
    {
      id: 'align-group',
      label: 'Alignment',
      buttons: [
        {
          id: 'align-left',
          label: 'Left',
          icon: 'format-align-left',
          enabled: state.hasSelection,
          tooltip: 'Align left',
        },
        {
          id: 'align-center-h',
          label: 'Center',
          icon: 'format-align-center',
          enabled: state.hasSelection,
          tooltip: 'Align center horizontally',
        },
        {
          id: 'align-right',
          label: 'Right',
          icon: 'format-align-right',
          enabled: state.hasSelection,
          tooltip: 'Align right',
        },
      ],
      divider: true,
    },
    {
      id: 'valign-group',
      buttons: [
        {
          id: 'align-top',
          label: 'Top',
          icon: 'align-vertical-top',
          enabled: state.hasSelection,
          tooltip: 'Align top',
        },
        {
          id: 'align-center-v',
          label: 'Center',
          icon: 'align-vertical-center',
          enabled: state.hasSelection,
          tooltip: 'Align center vertically',
        },
        {
          id: 'align-bottom',
          label: 'Bottom',
          icon: 'align-vertical-bottom',
          enabled: state.hasSelection,
          tooltip: 'Align bottom',
        },
      ],
      divider: true,
    },
    {
      id: 'distribute-group',
      buttons: [
        {
          id: 'dist-h',
          label: 'Distribute H',
          icon: 'format-columns',
          enabled: state.hasSelection,
          tooltip: 'Distribute horizontally',
        },
        {
          id: 'dist-v',
          label: 'Distribute V',
          icon: 'format-rows',
          enabled: state.hasSelection,
          tooltip: 'Distribute vertically',
        },
      ],
    },
  ];
}

// ===== ARRANGE TOOLBAR =====

export function getArrangeToolbar(state: ToolbarState): ToolbarGroup[] {
  return [
    {
      id: 'order-group',
      label: 'Arrange',
      buttons: [
        {
          id: 'bring-forward',
          label: 'Forward',
          icon: 'arrange-bring-forward',
          enabled: state.hasSelection,
          tooltip: 'Bring forward',
        },
        {
          id: 'send-backward',
          label: 'Backward',
          icon: 'arrange-send-backward',
          enabled: state.hasSelection,
          tooltip: 'Send backward',
        },
        {
          id: 'bring-to-front',
          label: 'Front',
          icon: 'arrange-bring-to-front',
          enabled: state.hasSelection,
          tooltip: 'Bring to front',
        },
        {
          id: 'send-to-back',
          label: 'Back',
          icon: 'arrange-send-to-back',
          enabled: state.hasSelection,
          tooltip: 'Send to back',
        },
      ],
    },
  ];
}

// ===== LAYOUT TOOLBAR =====

export function getLayoutToolbar(state: ToolbarState): ToolbarGroup[] {
  return [
    {
      id: 'layout-group',
      label: 'Layout',
      buttons: [
        {
          id: 'layout-hierarchical',
          label: 'Hierarchical',
          icon: 'call-split',
          tooltip: 'Hierarchical layout',
        },
        {
          id: 'layout-circular',
          label: 'Circular',
          icon: 'circle-multiple-outline',
          tooltip: 'Circular layout',
        },
        {
          id: 'layout-grid',
          label: 'Grid',
          icon: 'table-grid',
          tooltip: 'Grid layout',
        },
        {
          id: 'layout-force',
          label: 'Force',
          icon: 'force-directed',
          tooltip: 'Force-directed layout',
        },
        {
          id: 'layout-tree',
          label: 'Tree',
          icon: 'file-tree',
          tooltip: 'Tree layout',
        },
      ],
    },
  ];
}

// ===== UTILITY TOOLBAR =====

export function getUtilityToolbar(state: ToolbarState): ToolbarGroup[] {
  return [
    {
      id: 'utility-group',
      buttons: [
        {
          id: 'util-templates',
          label: 'Templates',
          icon: 'library-outline',
          tooltip: 'Node templates library',
        },
        {
          id: 'util-comments',
          label: 'Comments',
          icon: 'message-outline',
          tooltip: 'Add comments',
        },
        {
          id: 'util-bookmarks',
          label: 'Bookmarks',
          icon: 'bookmark-outline',
          tooltip: 'Manage bookmarks',
        },
        {
          id: 'util-favorites',
          label: 'Favorites',
          icon: 'star-outline',
          tooltip: 'Manage favorites',
        },
      ],
      divider: true,
    },
    {
      id: 'analysis-group',
      buttons: [
        {
          id: 'analytics',
          label: 'Analytics',
          icon: 'chart-line',
          tooltip: 'View analytics',
        },
        {
          id: 'performance',
          label: 'Performance',
          icon: 'speedometer',
          tooltip: 'Performance metrics',
        },
        {
          id: 'debug',
          label: 'Debug',
          icon: 'bug-outline',
          tooltip: 'Debug tools',
        },
      ],
    },
  ];
}

// ===== GET ALL TOOLBAR GROUPS =====

export function getAllToolbarGroups(state: ToolbarState): {
  primary: ToolbarGroup[];
  node: ToolbarGroup[];
  alignment: ToolbarGroup[];
  arrange: ToolbarGroup[];
  layout: ToolbarGroup[];
  utility: ToolbarGroup[];
} {
  return {
    primary: getPrimaryToolbar(state),
    node: getNodeToolbar(state),
    alignment: getAlignmentToolbar(state),
    arrange: getArrangeToolbar(state),
    layout: getLayoutToolbar(state),
    utility: getUtilityToolbar(state),
  };
}

// ===== TOOLBAR ACTION HANDLER =====

export interface ToolbarActionPayload {
  buttonId: string;
  timestamp: number;
  state: ToolbarState;
}

export function handleToolbarAction(
  buttonId: string,
  state: ToolbarState
): ToolbarActionPayload {
  return {
    buttonId,
    timestamp: Date.now(),
    state,
  };
}

// ===== TOOLBAR STATE MANAGEMENT =====

export function updateToolbarState(
  prevState: ToolbarState,
  changes: Partial<ToolbarState>
): ToolbarState {
  return {
    ...prevState,
    ...changes,
  };
}

// ===== TOOLBAR VISIBILITY MANAGEMENT =====

export interface ToolbarVisibility {
  primary: boolean;
  node: boolean;
  alignment: boolean;
  arrange: boolean;
  layout: boolean;
  utility: boolean;
}

export function toggleToolbar(
  visibility: ToolbarVisibility,
  toolbarId: keyof ToolbarVisibility
): ToolbarVisibility {
  return {
    ...visibility,
    [toolbarId]: !visibility[toolbarId],
  };
}

export function getDefaultToolbarVisibility(): ToolbarVisibility {
  return {
    primary: true,
    node: true,
    alignment: true,
    arrange: true,
    layout: true,
    utility: true,
  };
}

// ===== BUTTON STATE VALIDATION =====

export function isButtonEnabled(
  button: ToolbarButton,
  state: ToolbarState
): boolean {
  if (button.enabled === undefined) return true;
  return button.enabled;
}

export function updateButtonState(
  button: ToolbarButton,
  updates: Partial<ToolbarButton>
): ToolbarButton {
  return {
    ...button,
    ...updates,
  };
}

// ===== CUSTOM TOOLBAR BUILDER =====

export function createCustomToolbar(buttons: ToolbarButton[]): ToolbarGroup {
  return {
    id: 'custom-toolbar-' + Date.now(),
    buttons,
  };
}

export function addButtonToToolbar(
  group: ToolbarGroup,
  button: ToolbarButton
): ToolbarGroup {
  return {
    ...group,
    buttons: [...group.buttons, button],
  };
}

export function removeButtonFromToolbar(
  group: ToolbarGroup,
  buttonId: string
): ToolbarGroup {
  return {
    ...group,
    buttons: group.buttons.filter((b) => b.id !== buttonId),
  };
}

// ===== SEARCH & FILTER =====

export function searchToolbarButtons(
  groups: ToolbarGroup[],
  query: string
): ToolbarButton[] {
  const lowerQuery = query.toLowerCase();
  const results: ToolbarButton[] = [];

  groups.forEach((group) => {
    group.buttons.forEach((button) => {
      if (
        button.label.toLowerCase().includes(lowerQuery) ||
        button.tooltip?.toLowerCase().includes(lowerQuery) ||
        button.id.toLowerCase().includes(lowerQuery)
      ) {
        results.push(button);
      }
    });
  });

  return results;
}

// ===== KEYBOARD SHORTCUT MAPPING =====

export interface KeyboardShortcut {
  shortcut: string;
  buttonId: string;
  description: string;
}

export function extractShortcuts(groups: ToolbarGroup[]): KeyboardShortcut[] {
  const shortcuts: KeyboardShortcut[] = [];

  groups.forEach((group) => {
    group.buttons.forEach((button) => {
      if (button.shortcut) {
        shortcuts.push({
          shortcut: button.shortcut,
          buttonId: button.id,
          description: button.tooltip || button.label,
        });
      }
    });
  });

  return shortcuts;
}
