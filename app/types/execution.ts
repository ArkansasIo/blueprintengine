/**
 * Execution and Debugging Type Definitions
 * Runtime execution, debugging, and profiling types
 */

import { EditorNode, Pin, Variable } from './nodes';

/**
 * Execution Context
 * Complete execution state at runtime
 */
export interface ExecutionContext {
  contextId: string;
  blueprintId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  
  // State
  executionStack: ExecutionFrame[];
  variables: VariableState[];
  breakpoints: Breakpoint[];
  
  // Results
  returnValue?: any;
  errors: ExecutionError[];
  warnings: ExecutionWarning[];
  
  // Performance
  metrics: ExecutionMetrics;
}

/**
 * Execution Frame
 * Stack frame during execution
 */
export interface ExecutionFrame {
  frameId: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  
  // Timing
  startTime: number;
  endTime?: number;
  duration?: number;
  
  // State
  inputValues: Record<string, any>;
  outputValues: Record<string, any>;
  localVariables: Record<string, any>;
  
  // Execution Path
  parentFrameId?: string;
  childFrameIds: string[];
  callStack: string[];
}

/**
 * Variable State
 * Runtime state of a variable
 */
export interface VariableState {
  variableId: string;
  name: string;
  type: string;
  value: any;
  scope: string;
  frameId?: string;
  previousValue?: any;
  changed: boolean;
  changeTime?: number;
}

/**
 * Breakpoint
 * Debugger breakpoint
 */
export interface Breakpoint {
  id: string;
  nodeId: string;
  nodeName: string;
  isEnabled: boolean;
  
  // Conditions
  condition?: string;
  hitCount?: number;
  currentHits: number;
  
  // Actions
  actions: BreakpointAction[];
  
  // Metadata
  createdAt: Date;
  label?: string;
}

/**
 * Breakpoint Action
 * Action when breakpoint is hit
 */
export enum BreakpointAction {
  Break = 'Break',
  Log = 'Log',
  Continue = 'Continue',
  Conditional = 'Conditional',
  Script = 'Script',
}

/**
 * Execution Error
 * Error during execution
 */
export interface ExecutionError {
  id: string;
  timestamp: Date;
  nodeId?: string;
  nodeName?: string;
  message: string;
  stackTrace: string;
  severity: ErrorSeverity;
  context?: Record<string, any>;
}

/**
 * Execution Warning
 * Warning during execution
 */
export interface ExecutionWarning {
  id: string;
  timestamp: Date;
  nodeId?: string;
  message: string;
  severity: 'warning' | 'info';
}

/**
 * Error Severity
 * Severity level of error
 */
export enum ErrorSeverity {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error',
  Critical = 'Critical',
  Fatal = 'Fatal',
}

/**
 * Execution Metrics
 * Performance metrics during execution
 */
export interface ExecutionMetrics {
  totalTime: number;
  nodeExecutionCount: number;
  slowestNode: {
    nodeId: string;
    nodeName: string;
    time: number;
  };
  fastestNode: {
    nodeId: string;
    nodeName: string;
    time: number;
  };
  averageNodeTime: number;
  memoryUsed: number;
  callCount: number;
  branchingCount: number;
  loopIterations: number;
  exceptionCount: number;
}

/**
 * Execution Event
 * Event fired during execution
 */
export interface ExecutionEvent {
  eventId: string;
  type: ExecutionEventType;
  timestamp: number;
  nodeId: string;
  framId?: string;
  data: Record<string, any>;
}

/**
 * Execution Event Type
 * Types of execution events
 */
export enum ExecutionEventType {
  NodeEnter = 'NodeEnter',
  NodeExit = 'NodeExit',
  PinConnection = 'PinConnection',
  VariableChange = 'VariableChange',
  FunctionCall = 'FunctionCall',
  EventFire = 'EventFire',
  BreakpointHit = 'BreakpointHit',
  Error = 'Error',
  Return = 'Return',
}

/**
 * Execution Trace
 * Complete record of an execution
 */
export interface ExecutionTrace {
  traceId: string;
  blueprintId: string;
  startTime: Date;
  duration: number;
  status: ExecutionStatus;
  
  // Events
  events: ExecutionEvent[];
  frames: ExecutionFrame[];
  
  // Results
  returnValue?: any;
  errors: ExecutionError[];
  
  // Performance
  metrics: ExecutionMetrics;
  
  // Metadata
  tags: string[];
}

/**
 * Execution Status
 * Status of execution
 */
export enum ExecutionStatus {
  Running = 'Running',
  Paused = 'Paused',
  Completed = 'Completed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
  Timeout = 'Timeout',
}

/**
 * Debug Session
 * Debugging session
 */
export interface DebugSession {
  sessionId: string;
  blueprintId: string;
  startTime: Date;
  endTime?: Date;
  
  // State
  isActive: boolean;
  isPaused: boolean;
  currentFrameId?: string;
  
  // Breakpoints
  breakpoints: Breakpoint[];
  
  // Watches
  watches: Watch[];
  
  // History
  executionHistory: ExecutionTrace[];
  currentTrace?: ExecutionTrace;
  
  // Settings
  settings: DebugSettings;
}

/**
 * Watch Expression
 * Expression being watched
 */
export interface Watch {
  id: string;
  expression: string;
  value?: any;
  type?: string;
  isValid: boolean;
  error?: string;
}

/**
 * Debug Settings
 * Debugging configuration
 */
export interface DebugSettings {
  breakOnErrors: boolean;
  breakOnWarnings: boolean;
  breakOnExceptions: boolean;
  traceExecution: boolean;
  recordVariables: boolean;
  recordPerformance: boolean;
  maxStackDepth: number;
  maxTraceSize: number;
}

/**
 * Profiling Data
 * Performance profiling information
 */
export interface ProfilingData {
  profilingId: string;
  blueprintId: string;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  
  // Samples
  samples: ProfilingSample[];
  
  // Aggregates
  nodeStats: Map<string, NodeProfilingStats>;
  pinStats: Map<string, PinProfilingStats>;
  
  // Summary
  summary: ProfilingSummary;
}

/**
 * Profiling Sample
 * Single profiling sample
 */
export interface ProfilingSample {
  timestamp: number;
  nodeId: string;
  duration: number;
  memoryDelta: number;
  cpuTime: number;
}

/**
 * Node Profiling Stats
 * Profiling stats for a node
 */
export interface NodeProfilingStats {
  nodeId: string;
  nodeName: string;
  callCount: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  stdDeviation: number;
  memoryUsed: number;
}

/**
 * Pin Profiling Stats
 * Profiling stats for pin connections
 */
export interface PinProfilingStats {
  pinId: string;
  fromNode: string;
  toNode: string;
  connectionCount: number;
  totalTime: number;
  averageTime: number;
}

/**
 * Profiling Summary
 * Summary of profiling data
 */
export interface ProfilingSummary {
  totalTime: number;
  totalMemory: number;
  nodeCount: number;
  edgeCount: number;
  avgNodeTime: number;
  slowestNode: NodeProfilingStats;
  fastestNode: NodeProfilingStats;
  bottleneckNodes: NodeProfilingStats[];
}

/**
 * Memory Analysis
 * Memory usage analysis
 */
export interface MemoryAnalysis {
  analysisId: string;
  timestamp: Date;
  totalMemory: number;
  usedMemory: number;
  
  // Allocations
  allocations: MemoryAllocation[];
  
  // Leaks
  potentialLeaks: MemoryLeak[];
  
  // Growth
  memoryGrowth: MemoryGrowthData[];
}

/**
 * Memory Allocation
 * Memory allocation info
 */
export interface MemoryAllocation {
  variableId: string;
  variableName: string;
  size: number;
  allocatedAt: Date;
  scope: string;
}

/**
 * Memory Leak
 * Potential memory leak
 */
export interface MemoryLeak {
  leakId: string;
  variableId: string;
  variableName: string;
  allocatedSize: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestion: string;
}

/**
 * Memory Growth Data
 * Memory growth over time
 */
export interface MemoryGrowthData {
  timestamp: Date;
  memoryUsage: number;
  growthRate: number;
}

/**
 * Call Graph
 * Function call graph during execution
 */
export interface CallGraph {
  graphId: string;
  rootNodeId: string;
  nodes: CallGraphNode[];
  edges: CallGraphEdge[];
}

/**
 * Call Graph Node
 * Node in call graph
 */
export interface CallGraphNode {
  nodeId: string;
  nodeName: string;
  callCount: number;
  totalTime: number;
  level: number;
}

/**
 * Call Graph Edge
 * Edge in call graph
 */
export interface CallGraphEdge {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  callCount: number;
  totalTime: number;
}

/**
 * Code Generation Result
 * Result of code generation
 */
export interface CodeGenerationResult {
  blueprintId: string;
  language: CodeLanguage;
  code: string;
  lineCount: number;
  hasErrors: boolean;
  errors: string[];
  warnings: string[];
  generatedAt: Date;
}

/**
 * Code Language
 * Target code generation language
 */
export enum CodeLanguage {
  C = 'C',
  CPP = 'C++',
  CSharp = 'C#',
  Python = 'Python',
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  Java = 'Java',
  Kotlin = 'Kotlin',
  Go = 'Go',
  Rust = 'Rust',
}
