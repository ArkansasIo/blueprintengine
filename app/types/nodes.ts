/**
 * Node and Component Type Definitions
 * Complete type system for nodes, pins, variables, functions, and events
 */

import { DataType, Parameter } from './blueprint';

/**
 * Editor Node
 * Base node in the blueprint graph
 */
export interface EditorNode {
  // Identity
  id: string;
  type: NodeType;
  nodeClass: string;
  
  // Position & Layout
  position: Position;
  size: NodeSize;
  isCollapsed: boolean;
  
  // Content
  displayName: string;
  description: string;
  category: NodeCategory;
  
  // I/O
  inputPins: Pin[];
  outputPins: Pin[];
  
  // Properties
  properties: NodeProperty[];
  metadata: NodeMetadata;
  
  // State
  isEnabled: boolean;
  isBreakpoint: boolean;
  comments: NodeComment[];
  
  // Style
  color?: string;
  icon?: string;
  tags: string[];
}

/**
 * Node Type
 * Classification of different node types
 */
export enum NodeType {
  // Control Flow
  Branch = 'Branch',
  Switch = 'Switch',
  Sequence = 'Sequence',
  DoOnce = 'DoOnce',
  FlipFlop = 'FlipFlop',
  
  // Data
  VariableGet = 'VariableGet',
  VariableSet = 'VariableSet',
  PropertyGet = 'PropertyGet',
  PropertySet = 'PropertySet',
  
  // Events
  EventDispatcher = 'EventDispatcher',
  CustomEvent = 'CustomEvent',
  EventBeginPlay = 'EventBeginPlay',
  EventEndPlay = 'EventEndPlay',
  
  // Functions
  FunctionCall = 'FunctionCall',
  PureFunction = 'PureFunction',
  Constructor = 'Constructor',
  
  // Math
  Add = 'Add',
  Subtract = 'Subtract',
  Multiply = 'Multiply',
  Divide = 'Divide',
  Modulo = 'Modulo',
  
  // Logic
  And = 'And',
  Or = 'Or',
  Not = 'Not',
  Equal = 'Equal',
  NotEqual = 'NotEqual',
  Less = 'Less',
  Greater = 'Greater',
  
  // String
  StringConcat = 'StringConcat',
  StringLength = 'StringLength',
  StringSubstring = 'StringSubstring',
  StringReplace = 'StringReplace',
  
  // Array
  ArrayLength = 'ArrayLength',
  ArrayGet = 'ArrayGet',
  ArraySet = 'ArraySet',
  ArrayAppend = 'ArrayAppend',
  ArrayRemove = 'ArrayRemove',
  
  // Cast
  Cast = 'Cast',
  IsValid = 'IsValid',
  IsNotNull = 'IsNotNull',
  
  // Custom
  Custom = 'Custom',
  Macro = 'Macro',
  Collapse = 'Collapse',
  
  // Input/Output
  Input = 'Input',
  Output = 'Output',
  Comment = 'Comment',
}

/**
 * Node Category
 * Categorization of nodes
 */
export enum NodeCategory {
  Control = 'Control',
  Data = 'Data',
  Events = 'Events',
  Functions = 'Functions',
  Math = 'Math',
  Logic = 'Logic',
  String = 'String',
  Array = 'Array',
  Cast = 'Cast',
  IO = 'Input/Output',
  Custom = 'Custom',
}

/**
 * Pin (Connection Point)
 * Input/output connection point on a node
 */
export interface Pin {
  id: string;
  name: string;
  direction: PinDirection;
  type: DataType;
  defaultValue?: any;
  
  // Connections
  connections: PinConnection[];
  
  // Display
  displayName?: string;
  tooltip?: string;
  isAdvanced?: boolean;
  isHidden?: boolean;
  
  // Validation
  isArray?: boolean;
  isReference?: boolean;
  isConst?: boolean;
  
  // Execution
  isExecution?: boolean; // For execution pins
  isInputExecution?: boolean;
  isOutputExecution?: boolean;
}

/**
 * Pin Direction
 * Direction of pin connection
 */
export enum PinDirection {
  Input = 'Input',
  Output = 'Output',
}

/**
 * Pin Connection
 * Connection from one pin to another
 */
export interface PinConnection {
  id: string;
  fromNodeId: string;
  fromPinId: string;
  toNodeId: string;
  toPinId: string;
  isEnabled: boolean;
}

/**
 * Editor Edge (Connection)
 * Visual representation of a connection between pins
 */
export interface EditorEdge {
  id: string;
  fromNodeId: string;
  fromPinId: string;
  toNodeId: string;
  toPinId: string;
  
  // Display
  color?: string;
  thickness?: number;
  
  // State
  isEnabled: boolean;
  isHighlighted?: boolean;
  
  // Validation
  isValid: boolean;
  errors?: string[];
}

/**
 * Node Property
 * Property that can be edited in node details
 */
export interface NodeProperty {
  id: string;
  name: string;
  type: DataType;
  value: any;
  defaultValue: any;
  
  // Display
  displayName?: string;
  tooltip?: string;
  isAdvanced?: boolean;
  isEditable: boolean;
  
  // Validation
  minValue?: number;
  maxValue?: number;
  allowedValues?: any[];
}

/**
 * Node Metadata
 * Additional metadata for nodes
 */
export interface NodeMetadata {
  nodeId: string;
  createdAt: Date;
  modifiedAt: Date;
  author?: string;
  version: string;
  
  // Performance
  executionTime?: number;
  callCount?: number;
  
  // Organization
  groupId?: string;
  bookmarked?: boolean;
  custom?: Record<string, any>;
}

/**
 * Node Comment
 * Comment or documentation on a node
 */
export interface NodeComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
}

/**
 * Node Group
 * Group of related nodes
 */
export interface NodeGroup {
  id: string;
  name: string;
  description?: string;
  nodes: string[]; // Node IDs
  color?: string;
  isCollapsed: boolean;
  bounds: Bounds;
}

/**
 * Variable
 * Blueprint variable definition
 */
export interface Variable {
  id: string;
  name: string;
  type: DataType;
  defaultValue?: any;
  
  // Scope
  scope: VariableScope;
  
  // Access
  isPublic: boolean;
  isEditable: boolean;
  isExposed: boolean;
  
  // Display
  displayName?: string;
  tooltip?: string;
  category?: string;
  
  // Replication
  isReplicated?: boolean;
  replicationCondition?: ReplicationCondition;
  
  // Metadata
  createdAt: Date;
  modifiedAt: Date;
}

/**
 * Variable Scope
 * Scope of variable visibility
 */
export enum VariableScope {
  Local = 'Local',
  Instance = 'Instance',
  Blueprint = 'Blueprint',
  Global = 'Global',
}

/**
 * Replication Condition
 * When to replicate variable changes
 */
export enum ReplicationCondition {
  Always = 'Always',
  Owner = 'Owner',
  SkipOwner = 'SkipOwner',
  SimulatedOnly = 'SimulatedOnly',
  ServerOnly = 'ServerOnly',
}

/**
 * Function
 * Blueprint function definition
 */
export interface Function {
  id: string;
  name: string;
  description?: string;
  
  // Signature
  returnType: DataType;
  inputs: Parameter[];
  outputs: Parameter[];
  
  // Access
  isPublic: boolean;
  isPure: boolean;
  isEvent: boolean;
  isOverride: boolean;
  
  // Implementation
  nodeGraphId: string; // Reference to function's node graph
  nodes: EditorNode[];
  
  // Metadata
  createdAt: Date;
  modifiedAt: Date;
  author?: string;
  
  // Replication
  isNetworked?: boolean;
  callOnServer?: boolean;
  callOnOwner?: boolean;
}

/**
 * Event
 * Blueprint event definition
 */
export interface Event {
  id: string;
  name: string;
  description?: string;
  
  // Signature
  outputs: Parameter[];
  
  // Access
  isPublic: boolean;
  isNative: boolean;
  
  // Implementation
  nodeGraphId: string; // Reference to event's node graph
  nodes: EditorNode[];
  
  // Dispatcher
  boundVariables: string[]; // Variable IDs
  
  // Metadata
  createdAt: Date;
  modifiedAt: Date;
  
  // Replication
  isNetworked?: boolean;
}

/**
 * Macro
 * Reusable node group/macro
 */
export interface Macro {
  id: string;
  name: string;
  description?: string;
  
  // Content
  nodes: EditorNode[];
  edges: EditorEdge[];
  
  // I/O
  inputs: Parameter[];
  outputs: Parameter[];
  
  // Display
  thumbnail?: string;
  icon?: string;
  
  // Metadata
  createdAt: Date;
  version: string;
  isPublic: boolean;
}

/**
 * Position
 * 2D position on canvas
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Node Size
 * Physical size of node
 */
export interface NodeSize {
  width: number;
  height: number;
}

/**
 * Bounds
 * Rectangular bounds area
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Pin Type Info
 * Type information for a pin
 */
export interface PinTypeInfo {
  baseType: DataType;
  isArray: boolean;
  isReference: boolean;
  isConst: boolean;
  containerType?: string;
}

/**
 * Node Execution Context
 * Runtime execution context for a node
 */
export interface NodeExecutionContext {
  nodeId: string;
  nodeType: NodeType;
  nodeName: string;
  inputValues: Record<string, any>;
  outputValues: Record<string, any>;
  localVariables: Record<string, any>;
  executionTime: number;
  callStack: string[];
}
