/**
 * Blueprint Constants
 * Global constants and defaults for the blueprint system
 */

import { BlueprintCategory, Platform } from '@/app/types/blueprint';
import { NodeType, NodeCategory, VariableScope } from '@/app/types/nodes';

/**
 * Default Blueprint Settings
 */
export const DEFAULT_BLUEPRINT_SETTINGS = {
  compileOnSave: true,
  autoFormat: true,
  enableValidation: true,
  enableDebugging: true,
  enableOptimization: true,
  snapToGrid: true,
  gridSize: 8,
  showComments: true,
  darkMode: true,
  fontSize: 12,
};

/**
 * Default Compilation Options
 */
export const DEFAULT_COMPILATION_OPTIONS = {
  optimize: false,
  debugInfo: true,
  stripComments: false,
  stripWhitespace: false,
  validateTypes: true,
  validateConnections: true,
  checkDeadCode: true,
  checkCircularDependencies: true,
  inlineSimpleFunctions: false,
  parallelOptimization: false,
  maxCompilationTime: 30000,
};

/**
 * Node Type Configurations
 */
export const NODE_TYPE_CONFIG: Record<NodeType, {
  displayName: string;
  category: NodeCategory;
  color: string;
  icon: string;
  description: string;
}> = {
  [NodeType.Branch]: {
    displayName: 'Branch',
    category: NodeCategory.Control,
    color: '#3b82f6',
    icon: 'call-split',
    description: 'Execute different paths based on boolean condition',
  },
  [NodeType.Switch]: {
    displayName: 'Switch',
    category: NodeCategory.Control,
    color: '#3b82f6',
    icon: 'electric-switch',
    description: 'Execute one of multiple paths based on value',
  },
  [NodeType.Sequence]: {
    displayName: 'Sequence',
    category: NodeCategory.Control,
    color: '#3b82f6',
    icon: 'format-list-numbered',
    description: 'Execute pins in sequence',
  },
  [NodeType.DoOnce]: {
    displayName: 'Do Once',
    category: NodeCategory.Control,
    color: '#3b82f6',
    icon: 'checkbox-marked-circle',
    description: 'Execute only once',
  },
  [NodeType.FlipFlop]: {
    displayName: 'Flip Flop',
    category: NodeCategory.Control,
    color: '#3b82f6',
    icon: 'toggle-switch',
    description: 'Toggle between two outputs',
  },
  [NodeType.VariableGet]: {
    displayName: 'Get Variable',
    category: NodeCategory.Data,
    color: '#06b6d4',
    icon: 'variable-box',
    description: 'Get variable value',
  },
  [NodeType.VariableSet]: {
    displayName: 'Set Variable',
    category: NodeCategory.Data,
    color: '#06b6d4',
    icon: 'variable-box',
    description: 'Set variable value',
  },
  [NodeType.PropertyGet]: {
    displayName: 'Get Property',
    category: NodeCategory.Data,
    color: '#06b6d4',
    icon: 'shape-rectangle',
    description: 'Get property value',
  },
  [NodeType.PropertySet]: {
    displayName: 'Set Property',
    category: NodeCategory.Data,
    color: '#06b6d4',
    icon: 'shape-rectangle',
    description: 'Set property value',
  },
  [NodeType.EventDispatcher]: {
    displayName: 'Call Event Dispatcher',
    category: NodeCategory.Events,
    color: '#f59e0b',
    icon: 'bell',
    description: 'Call event dispatcher',
  },
  [NodeType.CustomEvent]: {
    displayName: 'Custom Event',
    category: NodeCategory.Events,
    color: '#f59e0b',
    icon: 'bell-ring',
    description: 'Create custom event',
  },
  [NodeType.EventBeginPlay]: {
    displayName: 'Event Begin Play',
    category: NodeCategory.Events,
    color: '#f59e0b',
    icon: 'play-circle',
    description: 'Called when actor spawns',
  },
  [NodeType.EventEndPlay]: {
    displayName: 'Event End Play',
    category: NodeCategory.Events,
    color: '#f59e0b',
    icon: 'stop-circle',
    description: 'Called when actor is destroyed',
  },
  [NodeType.FunctionCall]: {
    displayName: 'Function Call',
    category: NodeCategory.Functions,
    color: '#8b5cf6',
    icon: 'function',
    description: 'Call a function',
  },
  [NodeType.PureFunction]: {
    displayName: 'Pure Function',
    category: NodeCategory.Functions,
    color: '#8b5cf6',
    icon: 'function-variant',
    description: 'Call a pure function',
  },
  [NodeType.Constructor]: {
    displayName: 'Construct Object',
    category: NodeCategory.Functions,
    color: '#8b5cf6',
    icon: 'hammer-wrench',
    description: 'Construct an object',
  },
  [NodeType.Add]: {
    displayName: 'Add',
    category: NodeCategory.Math,
    color: '#10b981',
    icon: 'plus',
    description: 'Add two numbers',
  },
  [NodeType.Subtract]: {
    displayName: 'Subtract',
    category: NodeCategory.Math,
    color: '#10b981',
    icon: 'minus',
    description: 'Subtract two numbers',
  },
  [NodeType.Multiply]: {
    displayName: 'Multiply',
    category: NodeCategory.Math,
    color: '#10b981',
    icon: 'multiplication',
    description: 'Multiply two numbers',
  },
  [NodeType.Divide]: {
    displayName: 'Divide',
    category: NodeCategory.Math,
    color: '#10b981',
    icon: 'division',
    description: 'Divide two numbers',
  },
  [NodeType.Modulo]: {
    displayName: 'Modulo',
    category: NodeCategory.Math,
    color: '#10b981',
    icon: 'percent',
    description: 'Modulo operation',
  },
  [NodeType.And]: {
    displayName: 'And',
    category: NodeCategory.Logic,
    color: '#ec4899',
    icon: 'plus-circle',
    description: 'Logical AND',
  },
  [NodeType.Or]: {
    displayName: 'Or',
    category: NodeCategory.Logic,
    color: '#ec4899',
    icon: 'plus-circle',
    description: 'Logical OR',
  },
  [NodeType.Not]: {
    displayName: 'Not',
    category: NodeCategory.Logic,
    color: '#ec4899',
    icon: 'close-circle',
    description: 'Logical NOT',
  },
  [NodeType.Equal]: {
    displayName: 'Equal',
    category: NodeCategory.Logic,
    color: '#ec4899',
    icon: 'equal',
    description: 'Equality comparison',
  },
  [NodeType.NotEqual]: {
    displayName: 'Not Equal',
    category: NodeCategory.Logic,
    color: '#ec4899',
    icon: 'not-equal',
    description: 'Inequality comparison',
  },
  [NodeType.Less]: {
    displayName: 'Less',
    category: NodeCategory.Logic,
    color: '#ec4899',
    icon: 'less-than',
    description: 'Less than comparison',
  },
  [NodeType.Greater]: {
    displayName: 'Greater',
    category: NodeCategory.Logic,
    color: '#ec4899',
    icon: 'greater-than',
    description: 'Greater than comparison',
  },
  [NodeType.StringConcat]: {
    displayName: 'Append String',
    category: NodeCategory.String,
    color: '#14b8a6',
    icon: 'format-text',
    description: 'Concatenate strings',
  },
  [NodeType.StringLength]: {
    displayName: 'String Length',
    category: NodeCategory.String,
    color: '#14b8a6',
    icon: 'numeric',
    description: 'Get string length',
  },
  [NodeType.StringSubstring]: {
    displayName: 'Substring',
    category: NodeCategory.String,
    color: '#14b8a6',
    icon: 'text-box',
    description: 'Extract substring',
  },
  [NodeType.StringReplace]: {
    displayName: 'Replace String',
    category: NodeCategory.String,
    color: '#14b8a6',
    icon: 'find-replace',
    description: 'Replace string content',
  },
  [NodeType.ArrayLength]: {
    displayName: 'Array Length',
    category: NodeCategory.Array,
    color: '#a855f7',
    icon: 'format-list-numbered',
    description: 'Get array length',
  },
  [NodeType.ArrayGet]: {
    displayName: 'Array Get',
    category: NodeCategory.Array,
    color: '#a855f7',
    icon: 'inbox-multiple',
    description: 'Get array element',
  },
  [NodeType.ArraySet]: {
    displayName: 'Array Set',
    category: NodeCategory.Array,
    color: '#a855f7',
    icon: 'inbox-multiple',
    description: 'Set array element',
  },
  [NodeType.ArrayAppend]: {
    displayName: 'Array Append',
    category: NodeCategory.Array,
    color: '#a855f7',
    icon: 'plus-box',
    description: 'Append to array',
  },
  [NodeType.ArrayRemove]: {
    displayName: 'Array Remove',
    category: NodeCategory.Array,
    color: '#a855f7',
    icon: 'minus-box',
    description: 'Remove from array',
  },
  [NodeType.Cast]: {
    displayName: 'Cast',
    category: NodeCategory.Cast,
    color: '#06b6d4',
    icon: 'arrow-right',
    description: 'Type cast',
  },
  [NodeType.IsValid]: {
    displayName: 'Is Valid',
    category: NodeCategory.Cast,
    color: '#06b6d4',
    icon: 'check-circle',
    description: 'Check if valid',
  },
  [NodeType.IsNotNull]: {
    displayName: 'Is Not Null',
    category: NodeCategory.Cast,
    color: '#06b6d4',
    icon: 'close-circle',
    description: 'Check if not null',
  },
  [NodeType.Custom]: {
    displayName: 'Custom',
    category: NodeCategory.Custom,
    color: '#64748b',
    icon: 'cube',
    description: 'Custom node',
  },
  [NodeType.Macro]: {
    displayName: 'Macro',
    category: NodeCategory.Custom,
    color: '#64748b',
    icon: 'group',
    description: 'Macro node',
  },
  [NodeType.Collapse]: {
    displayName: 'Collapse',
    category: NodeCategory.Custom,
    color: '#64748b',
    icon: 'arrow-collapse',
    description: 'Collapsed node',
  },
  [NodeType.Input]: {
    displayName: 'Input',
    category: NodeCategory.IO,
    color: '#06b6d4',
    icon: 'arrow-left',
    description: 'Blueprint input',
  },
  [NodeType.Output]: {
    displayName: 'Output',
    category: NodeCategory.IO,
    color: '#06b6d4',
    icon: 'arrow-right',
    description: 'Blueprint output',
  },
  [NodeType.Comment]: {
    displayName: 'Comment',
    category: NodeCategory.IO,
    color: '#94a3b8',
    icon: 'message-text',
    description: 'Comment node',
  },
};

/**
 * Blueprint Categories
 */
export const BLUEPRINT_CATEGORIES = [
  BlueprintCategory.Actor,
  BlueprintCategory.Pawn,
  BlueprintCategory.Character,
  BlueprintCategory.GameMode,
  BlueprintCategory.Widget,
  BlueprintCategory.Interface,
  BlueprintCategory.Structure,
  BlueprintCategory.Enumeration,
  BlueprintCategory.FunctionLibrary,
  BlueprintCategory.DataAsset,
  BlueprintCategory.Other,
];

/**
 * Supported Platforms
 */
export const SUPPORTED_PLATFORMS = [
  Platform.Windows,
  Platform.Mac,
  Platform.iOS,
  Platform.Android,
  Platform.Web,
];

/**
 * Variable Scopes
 */
export const VARIABLE_SCOPES = [
  VariableScope.Local,
  VariableScope.Instance,
  VariableScope.Blueprint,
  VariableScope.Global,
];

/**
 * Primitive Types
 */
export const PRIMITIVE_TYPES = [
  'bool',
  'byte',
  'int',
  'int64',
  'float',
  'double',
  'string',
  'text',
  'name',
  'void',
  'object',
];

/**
 * Container Types
 */
export const CONTAINER_TYPES = [
  'array',
  'set',
  'map',
];

/**
 * Color Scheme
 */
export const COLOR_SCHEME = {
  // Nodes
  controlFlow: '#3b82f6',
  data: '#06b6d4',
  events: '#f59e0b',
  functions: '#8b5cf6',
  math: '#10b981',
  logic: '#ec4899',
  string: '#14b8a6',
  array: '#a855f7',
  cast: '#06b6d4',
  io: '#06b6d4',
  custom: '#64748b',

  // UI
  background: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  text: '#e2e8f0',
  textSecondary: '#94a3b8',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

/**
 * Default Values
 */
export const DEFAULT_VALUES: Record<string, any> = {
  bool: false,
  byte: 0,
  int: 0,
  int64: 0,
  float: 0.0,
  double: 0.0,
  string: '',
  text: '',
  name: '',
  void: null,
  object: null,
  array: [],
};

/**
 * Grid Constants
 */
export const GRID_CONSTANTS = {
  defaultSize: 8,
  minSize: 4,
  maxSize: 32,
  snapThreshold: 5,
};

/**
 * Canvas Constants
 */
export const CANVAS_CONSTANTS = {
  minZoom: 0.1,
  maxZoom: 4.0,
  defaultZoom: 1.0,
  zoomStep: 0.1,
  panSpeed: 1.0,
};

/**
 * Node Constants
 */
export const NODE_CONSTANTS = {
  defaultWidth: 200,
  defaultHeight: 100,
  minWidth: 100,
  minHeight: 50,
  maxWidth: 600,
  maxHeight: 400,
  titleBarHeight: 30,
  pinSize: 10,
  pinSpacing: 20,
};

/**
 * Connection Constants
 */
export const CONNECTION_CONSTANTS = {
  thickness: 2,
  selectedThickness: 3,
  hoverThickness: 2.5,
  minDistance: 10,
  snapDistance: 20,
};

/**
 * Performance Constants
 */
export const PERFORMANCE_CONSTANTS = {
  maxFrameTime: 16.67, // 60 FPS
  maxCompilationTime: 30000,
  maxDebugTraceSize: 10000,
  maxMemoryUsage: 1024 * 1024 * 100, // 100 MB
};

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  enableCollaboration: false,
  enableAI: true,
  enableCloudSync: false,
  enableAdvancedDebugging: true,
  enablePerformanceProfiling: true,
  enableCodeGeneration: true,
  enableOptimization: true,
};

/**
 * Keyboard Shortcut Config
 */
export const KEYBOARD_SHORTCUTS = {
  newBlueprint: 'Ctrl+N',
  openBlueprint: 'Ctrl+O',
  saveBlueprint: 'Ctrl+S',
  saveAsBlueprint: 'Ctrl+Shift+S',
  exportBlueprint: 'Ctrl+E',
  importBlueprint: 'Ctrl+I',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Y',
  cut: 'Ctrl+X',
  copy: 'Ctrl+C',
  paste: 'Ctrl+V',
  duplicate: 'Ctrl+D',
  delete: 'Delete',
  selectAll: 'Ctrl+A',
  deselectAll: 'Ctrl+Shift+A',
  zoomIn: 'Ctrl+Plus',
  zoomOut: 'Ctrl+Minus',
  zoomFit: 'Ctrl+0',
  toggleGrid: 'Ctrl+G',
  toggleDarkMode: 'Ctrl+L',
  toggleNodeTree: 'Ctrl+T',
  toggleDetailsPanel: 'Ctrl+P',
  compile: 'F5',
  validate: 'Ctrl+Shift+V',
  search: 'Ctrl+F',
  find: 'Ctrl+H',
  replace: 'Ctrl+Alt+H',
  preferences: 'Ctrl+,',
  shortcuts: 'Ctrl+Shift+?',
};
