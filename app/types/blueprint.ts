/**
 * UE5 Blueprint Type Definitions
 * Complete type system for blueprint structures, properties, and metadata
 */

import { EditorNode, EditorEdge } from './nodes';
import { Variable, Function, Event } from './nodes';

/**
 * Main Blueprint Interface
 * Represents a complete blueprint with all its components
 */
export interface Blueprint {
  // Core Properties
  id: string;
  name: string;
  description: string;
  version: string;
  parentClass: BlueprintClass;
  
  // Content
  nodes: EditorNode[];
  edges: EditorEdge[];
  variables: Variable[];
  functions: Function[];
  events: Event[];
  
  // Metadata
  created: Date;
  modified: Date;
  author: string;
  tags: string[];
  category: BlueprintCategory;
  
  // State
  isDirty: boolean;
  isCompiled: boolean;
  lastCompiled?: Date;
  
  // Settings
  settings: BlueprintSettings;
  properties: BlueprintProperties;
}

/**
 * Blueprint Settings
 * Configuration options for blueprint behavior
 */
export interface BlueprintSettings {
  compileOnSave: boolean;
  autoFormat: boolean;
  enableValidation: boolean;
  enableDebugging: boolean;
  enableOptimization: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showComments: boolean;
  darkMode: boolean;
  fontSize: number;
}

/**
 * Blueprint Properties
 * Editable properties and metadata
 */
export interface BlueprintProperties {
  displayName: string;
  tooltip: string;
  category: string;
  isEditable: boolean;
  isInstantiable: boolean;
  isConstant: boolean;
  searchableText: string;
  keywords: string[];
  documentationUrl?: string;
  supportedPlatforms: Platform[];
}

/**
 * Blueprint Class Hierarchy
 * Represents the class inheritance structure
 */
export interface BlueprintClass {
  id: string;
  name: string;
  path: string;
  parentClassId?: string;
  interfaces: BlueprintInterface[];
  isAbstract: boolean;
  documentation?: string;
}

/**
 * Blueprint Interface
 * Defines contractual requirements for blueprints
 */
export interface BlueprintInterface {
  id: string;
  name: string;
  methods: InterfaceMethod[];
  properties: InterfaceProperty[];
}

/**
 * Interface Method
 * Method defined in a blueprint interface
 */
export interface InterfaceMethod {
  id: string;
  name: string;
  returnType: DataType;
  parameters: Parameter[];
  isRequired: boolean;
}

/**
 * Interface Property
 * Property defined in a blueprint interface
 */
export interface InterfaceProperty {
  id: string;
  name: string;
  type: DataType;
  isRequired: boolean;
  defaultValue?: any;
}

/**
 * Data Type Definition
 * Comprehensive type system for blueprint data
 */
export type DataType =
  | PrimitiveType
  | ContainerType
  | ObjectType
  | CustomType;

export type PrimitiveType =
  | 'bool'
  | 'byte'
  | 'int'
  | 'int64'
  | 'float'
  | 'double'
  | 'string'
  | 'text'
  | 'name'
  | 'void'
  | 'object';

export interface ContainerType {
  kind: 'array' | 'set' | 'map';
  valueType: DataType;
  keyType?: DataType;
}

export interface ObjectType {
  kind: 'class' | 'struct' | 'interface';
  className: string;
  isReference: boolean;
}

export interface CustomType {
  kind: 'custom' | 'enum';
  typeName: string;
  values?: string[];
}

/**
 * Parameter Definition
 * Used in functions, events, and interface methods
 */
export interface Parameter {
  id: string;
  name: string;
  type: DataType;
  defaultValue?: any;
  isOut: boolean;
  isReference: boolean;
  tooltip?: string;
}

/**
 * Blueprint Category
 * Categories for organizing blueprints
 */
export enum BlueprintCategory {
  Actor = 'Actor',
  Pawn = 'Pawn',
  Character = 'Character',
  GameMode = 'GameMode',
  Widget = 'Widget',
  Interface = 'Interface',
  Structure = 'Structure',
  Enumeration = 'Enumeration',
  FunctionLibrary = 'FunctionLibrary',
  DataAsset = 'DataAsset',
  Other = 'Other',
}

/**
 * Platform Support
 * Platforms where blueprint can run
 */
export enum Platform {
  Windows = 'Windows',
  Mac = 'Mac',
  Linux = 'Linux',
  iOS = 'iOS',
  Android = 'Android',
  Web = 'Web',
  Console = 'Console',
}

/**
 * Blueprint Compilation Result
 * Result of blueprint compilation process
 */
export interface CompilationResult {
  success: boolean;
  blueprintId: string;
  timestamp: Date;
  duration: number;
  errors: BlueprintError[];
  warnings: BlueprintWarning[];
  generatedCode?: string;
  generatedCodeSize?: number;
}

/**
 * Blueprint Error
 * Compilation error details
 */
export interface BlueprintError {
  id: string;
  code: string;
  message: string;
  nodeId?: string;
  nodeName?: string;
  line?: number;
  column?: number;
  severity: 'error' | 'critical';
}

/**
 * Blueprint Warning
 * Compilation warning details
 */
export interface BlueprintWarning {
  id: string;
  code: string;
  message: string;
  nodeId?: string;
  nodeName?: string;
  severity: 'warning' | 'info';
}

/**
 * Blueprint Version Info
 * Version control and history
 */
export interface BlueprintVersion {
  versionId: string;
  blueprintId: string;
  versionNumber: string;
  message: string;
  author: string;
  timestamp: Date;
  snapshot: BlueprintSnapshot;
  changes: VersionChange[];
}

/**
 * Blueprint Snapshot
 * Complete state snapshot for version control
 */
export interface BlueprintSnapshot {
  nodes: EditorNode[];
  edges: EditorEdge[];
  variables: Variable[];
  functions: Function[];
  events: Event[];
  properties: BlueprintProperties;
}

/**
 * Version Change
 * Specific changes made in a version
 */
export interface VersionChange {
  type: 'added' | 'modified' | 'deleted';
  targetType: 'node' | 'connection' | 'variable' | 'function' | 'event';
  targetId: string;
  targetName: string;
  details: string;
}

/**
 * Blueprint Metadata
 * Additional metadata for organization and search
 */
export interface BlueprintMetadata {
  blueprintId: string;
  searchTags: string[];
  relatedBlueprints: string[];
  dependencies: DependencyInfo[];
  statistics: BlueprintStatistics;
  performance: PerformanceMetrics;
}

/**
 * Dependency Info
 * External dependencies for a blueprint
 */
export interface DependencyInfo {
  id: string;
  blueprintId: string;
  blueprintName: string;
  version: string;
  isRequired: boolean;
}

/**
 * Blueprint Statistics
 * Statistical information about blueprint
 */
export interface BlueprintStatistics {
  nodeCount: number;
  connectionCount: number;
  variableCount: number;
  functionCount: number;
  eventCount: number;
  totalComplexity: number;
  nestingLevel: number;
  branchingFactor: number;
}

/**
 * Performance Metrics
 * Performance-related metrics
 */
export interface PerformanceMetrics {
  estimatedExecutionTime: number;
  memoryFootprint: number;
  cpuUsage: number;
  lastProfiledAt: Date;
  profiledCount: number;
}

/**
 * Blueprint Serialization Format
 * Format for saving/loading blueprints
 */
export interface BlueprintSerializable {
  version: string;
  formatVersion: string;
  blueprint: Blueprint;
  metadata: BlueprintMetadata;
  checksums: SerializationChecksums;
}

/**
 * Serialization Checksums
 * For data integrity verification
 */
export interface SerializationChecksums {
  blueprintHash: string;
  contentHash: string;
  dataHash: string;
  timestamp: Date;
}

/**
 * Blueprint Template
 * Reusable blueprint template
 */
export interface BlueprintTemplate {
  id: string;
  name: string;
  description: string;
  category: BlueprintCategory;
  thumbnail?: string;
  basedOn?: BlueprintClass;
  defaultNodes: EditorNode[];
  defaultVariables: Variable[];
  defaultFunctions: Function[];
  keywords: string[];
  isPublic: boolean;
}

/**
 * Blueprint Diff
 * Differences between blueprint versions
 */
export interface BlueprintDiff {
  fromVersion: string;
  toVersion: string;
  added: DiffItem[];
  modified: DiffItem[];
  deleted: DiffItem[];
  summary: string;
}

/**
 * Diff Item
 * Individual change item
 */
export interface DiffItem {
  id: string;
  type: string;
  name: string;
  oldValue?: any;
  newValue?: any;
  changeType: 'added' | 'modified' | 'deleted';
}
