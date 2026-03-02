/**
 * Compilation and Validation Type Definitions
 * Blueprint compilation, validation, and build system types
 */

import { EditorNode, EditorEdge } from './nodes';

/**
 * Compilation Request
 * Request to compile a blueprint
 */
export interface CompilationRequest {
  requestId: string;
  blueprintId: string;
  mode: CompilationMode;
  targetLanguage?: string;
  outputFormat: OutputFormat;
  options: CompilationOptions;
  timestamp: Date;
}

/**
 * Compilation Mode
 * Type of compilation
 */
export enum CompilationMode {
  Debug = 'Debug',
  Release = 'Release',
  Shipping = 'Shipping',
  Validation = 'Validation',
  GenerateCode = 'GenerateCode',
}

/**
 * Output Format
 * Output format for compilation
 */
export enum OutputFormat {
  ByteCode = 'ByteCode',
  NativeCode = 'NativeCode',
  SourceCode = 'SourceCode',
  IntermediateRepresentation = 'IR',
  JSON = 'JSON',
  YAML = 'YAML',
}

/**
 * Compilation Options
 * Options for compilation process
 */
export interface CompilationOptions {
  optimize: boolean;
  debugInfo: boolean;
  stripComments: boolean;
  stripWhitespace: boolean;
  validateTypes: boolean;
  validateConnections: boolean;
  checkDeadCode: boolean;
  checkCircularDependencies: boolean;
  inlineSimpleFunctions: boolean;
  parallelOptimization: boolean;
  maxCompilationTime: number;
}

/**
 * Compilation Status
 * Compilation progress and status
 */
export interface CompilationStatus {
  statusId: string;
  requestId: string;
  state: CompilationState;
  progress: number; // 0-100
  
  // Messages
  messages: CompilationMessage[];
  
  // Timing
  startTime: Date;
  currentTime: Date;
  estimatedTimeRemaining?: number;
  
  // Results
  result?: CompilationOutput;
  
  // Metadata
  isProcessing: boolean;
  isCancelled: boolean;
}

/**
 * Compilation State
 * State of compilation process
 */
export enum CompilationState {
  Queued = 'Queued',
  Initializing = 'Initializing',
  Parsing = 'Parsing',
  Analysis = 'Analysis',
  Optimization = 'Optimization',
  CodeGeneration = 'CodeGeneration',
  Assembly = 'Assembly',
  Linking = 'Linking',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

/**
 * Compilation Message
 * Message during compilation
 */
export interface CompilationMessage {
  messageId: string;
  type: CompilationMessageType;
  level: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  
  // Location
  nodeId?: string;
  nodeName?: string;
  line?: number;
  column?: number;
  
  // Additional Info
  suggestion?: string;
  relatedNodes?: string[];
}

/**
 * Compilation Message Type
 * Type of compilation message
 */
export enum CompilationMessageType {
  SyntaxError = 'SyntaxError',
  TypeMismatch = 'TypeMismatch',
  UnresolvedReference = 'UnresolvedReference',
  InvalidConnection = 'InvalidConnection',
  DeadCode = 'DeadCode',
  UnusedVariable = 'UnusedVariable',
  CircularDependency = 'CircularDependency',
  PerformanceWarning = 'PerformanceWarning',
  DeprecatedUsage = 'DeprecatedUsage',
  Info = 'Info',
}

/**
 * Compilation Output
 * Result of compilation
 */
export interface CompilationOutput {
  outputId: string;
  blueprintId: string;
  timestamp: Date;
  mode: CompilationMode;
  
  // Content
  code?: string;
  bytecode?: Uint8Array;
  ir?: string;
  
  // Metadata
  size: number;
  lineCount?: number;
  
  // Manifest
  manifest: CompilationManifest;
  
  // Diagnostics
  diagnostics: CompilationDiagnostics;
}

/**
 * Compilation Manifest
 * Manifest of compiled blueprint
 */
export interface CompilationManifest {
  version: string;
  blueprintId: string;
  blueprintName: string;
  timestamp: Date;
  
  // Dependencies
  dependencies: string[];
  externalReferences: string[];
  
  // Exports
  exportedFunctions: string[];
  exportedVariables: string[];
  exportedEvents: string[];
  
  // Metadata
  entryPoint?: string;
  mainFunction?: string;
}

/**
 * Compilation Diagnostics
 * Diagnostic information from compilation
 */
export interface CompilationDiagnostics {
  totalErrors: number;
  totalWarnings: number;
  totalInfos: number;
  
  // Performance
  compilationTime: number;
  optimizationTime?: number;
  codeGenTime?: number;
  
  // Size Analysis
  sourceSize: number;
  compiledSize: number;
  compressionRatio?: number;
  
  // Complexity
  cyclomatic: number;
  nestingDepth: number;
  fanOutMetrics: Record<string, number>;
}

/**
 * Validation Report
 * Blueprint validation report
 */
export interface ValidationReport {
  reportId: string;
  blueprintId: string;
  timestamp: Date;
  isValid: boolean;
  
  // Results
  issues: ValidationIssue[];
  
  // Checks Performed
  checksPerformed: ValidationCheckType[];
  
  // Summary
  summary: ValidationSummary;
}

/**
 * Validation Issue
 * Individual validation issue
 */
export interface ValidationIssue {
  issueId: string;
  checkType: ValidationCheckType;
  severity: 'error' | 'warning' | 'info';
  
  // Details
  message: string;
  description: string;
  
  // Location
  nodeId?: string;
  edgeId?: string;
  nodeType?: string;
  
  // Resolution
  suggestion?: string;
  autoFixAvailable: boolean;
}

/**
 * Validation Check Type
 * Types of validation checks
 */
export enum ValidationCheckType {
  TypeChecking = 'TypeChecking',
  ConnectionValidation = 'ConnectionValidation',
  DeadCodeDetection = 'DeadCodeDetection',
  CircularDependencyDetection = 'CircularDependencyDetection',
  UnresolvedReferences = 'UnresolvedReferences',
  PerformanceAnalysis = 'PerformanceAnalysis',
  ComplexityAnalysis = 'ComplexityAnalysis',
  AccessibilityCheck = 'AccessibilityCheck',
  SecurityAnalysis = 'SecurityAnalysis',
  CompatibilityCheck = 'CompatibilityCheck',
}

/**
 * Validation Summary
 * Summary of validation results
 */
export interface ValidationSummary {
  totalIssuesFound: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  autoFixableCount: number;
  estimatedFixTime?: number;
}

/**
 * Build Configuration
 * Build configuration for blueprint
 */
export interface BuildConfiguration {
  configId: string;
  blueprintId: string;
  name: string;
  description?: string;
  
  // Build Settings
  compilationMode: CompilationMode;
  targetPlatforms: string[];
  outputFormat: OutputFormat;
  
  // Optimization
  optimizationLevel: OptimizationLevel;
  enableInlining: boolean;
  enableVectorization: boolean;
  enableParallelization: boolean;
  
  // Debugging
  includeDebugInfo: boolean;
  includeProfiling: boolean;
  enableAssertions: boolean;
  
  // Output
  outputDirectory: string;
  outputFileName: string;
  
  // Pre/Post Build
  preBuildScript?: string;
  postBuildScript?: string;
}

/**
 * Optimization Level
 * Level of optimization
 */
export enum OptimizationLevel {
  O0 = 'O0', // No optimization
  O1 = 'O1', // Basic optimization
  O2 = 'O2', // Normal optimization
  O3 = 'O3', // Aggressive optimization
  Os = 'Os', // Size optimization
  Oz = 'Oz', // Minimal size
  Of = 'Of', // Fast optimization
}

/**
 * Build Result
 * Result of build process
 */
export interface BuildResult {
  buildId: string;
  configId: string;
  blueprintId: string;
  timestamp: Date;
  
  // Status
  success: boolean;
  duration: number;
  
  // Output
  outputFile?: string;
  outputSize?: number;
  
  // Artifacts
  artifacts: BuildArtifact[];
  
  // Issues
  buildIssues: BuildIssue[];
  
  // Metadata
  platform: string;
  version: string;
}

/**
 * Build Artifact
 * Artifact produced by build
 */
export interface BuildArtifact {
  id: string;
  type: BuildArtifactType;
  path: string;
  size: number;
  hash: string;
}

/**
 * Build Artifact Type
 * Type of build artifact
 */
export enum BuildArtifactType {
  Executable = 'Executable',
  Library = 'Library',
  Object = 'Object',
  Debug = 'Debug',
  Documentation = 'Documentation',
  Resource = 'Resource',
  Symbol = 'Symbol',
}

/**
 * Build Issue
 * Issue during build
 */
export interface BuildIssue {
  issueId: string;
  type: 'error' | 'warning' | 'note';
  message: string;
  file?: string;
  line?: number;
  column?: number;
}

/**
 * Link Configuration
 * Configuration for linking
 */
export interface LinkConfiguration {
  configId: string;
  blueprintId: string;
  
  // Link Settings
  linkMode: LinkMode;
  striping: boolean;
  debugSymbols: boolean;
  
  // Libraries
  linkedLibraries: string[];
  libraryPaths: string[];
  
  // Optimization
  deadCodeElimination: boolean;
  functionInlining: boolean;
  
  // Output
  outputName: string;
  outputPath: string;
}

/**
 * Link Mode
 * Linking mode
 */
export enum LinkMode {
  Static = 'Static',
  Dynamic = 'Dynamic',
  Shared = 'Shared',
  Executable = 'Executable',
}

/**
 * Dependency Graph
 * Graph of blueprint dependencies
 */
export interface DependencyGraph {
  graphId: string;
  blueprintId: string;
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  
  // Analysis
  hasCycles: boolean;
  cycles?: CircularDependency[];
}

/**
 * Dependency Node
 * Node in dependency graph
 */
export interface DependencyNode {
  blueprintId: string;
  blueprintName: string;
  version: string;
  
  // Types
  functionDependencies: number;
  variableDependencies: number;
  classDependencies: number;
}

/**
 * Dependency Edge
 * Edge in dependency graph
 */
export interface DependencyEdge {
  fromBlueprint: string;
  toBlueprint: string;
  dependencyCount: number;
  dependencyTypes: string[];
}

/**
 * Circular Dependency
 * Detected circular dependency
 */
export interface CircularDependency {
  cycleId: string;
  blueprints: string[];
  severity: 'warning' | 'error';
  suggestion: string;
}
