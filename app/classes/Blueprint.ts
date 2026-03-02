/**
 * Blueprint Class
 * Main blueprint implementation with all core functionality
 */

import {
  Blueprint as IBlueprintInterface,
  BlueprintSettings,
  BlueprintProperties,
  BlueprintClass,
  CompilationResult,
  BlueprintVersion,
  BlueprintMetadata,
  BlueprintStatistics,
  PerformanceMetrics,
} from '@/app/types/blueprint';
import { EditorNode, EditorEdge, Variable, Function, Event } from '@/app/types/nodes';
import { CompilationRequest, CompilationMode, OutputFormat } from '@/app/types/compilation';

/**
 * Blueprint
 * Complete blueprint implementation
 */
export class Blueprint implements IBlueprintInterface {
  // Identity
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
  category: any;

  // State
  isDirty: boolean;
  isCompiled: boolean;
  lastCompiled?: Date;

  // Settings
  settings: BlueprintSettings;
  properties: BlueprintProperties;

  // Private properties
  private compilationHistory: CompilationResult[] = [];
  private versionHistory: BlueprintVersion[] = [];
  private metadata: BlueprintMetadata;

  /**
   * Constructor
   */
  constructor(id: string, name: string, parentClass?: BlueprintClass) {
    this.id = id;
    this.name = name;
    this.description = '';
    this.version = '1.0.0';
    this.parentClass = parentClass || this.getDefaultParentClass();

    // Initialize collections
    this.nodes = [];
    this.edges = [];
    this.variables = [];
    this.functions = [];
    this.events = [];

    // Initialize metadata
    this.created = new Date();
    this.modified = new Date();
    this.author = 'System';
    this.tags = [];

    // Initialize state
    this.isDirty = false;
    this.isCompiled = false;

    // Initialize settings
    this.settings = this.getDefaultSettings();
    this.properties = this.getDefaultProperties();

    // Initialize metadata
    this.metadata = this.createMetadata();
  }

  /**
   * Add node to blueprint
   */
  public addNode(node: EditorNode): void {
    this.nodes.push(node);
    this.markDirty();
    this.invalidateCompilation();
  }

  /**
   * Remove node from blueprint
   */
  public removeNode(nodeId: string): void {
    this.nodes = this.nodes.filter((n) => n.id !== nodeId);
    this.edges = this.edges.filter(
      (e) => e.fromNodeId !== nodeId && e.toNodeId !== nodeId
    );
    this.markDirty();
    this.invalidateCompilation();
  }

  /**
   * Get node by ID
   */
  public getNode(nodeId: string): EditorNode | undefined {
    return this.nodes.find((n) => n.id === nodeId);
  }

  /**
   * Get all nodes of a specific type
   */
  public getNodesByType(type: string): EditorNode[] {
    return this.nodes.filter((n) => n.type === type);
  }

  /**
   * Add edge (connection) to blueprint
   */
  public addEdge(edge: EditorEdge): void {
    this.edges.push(edge);
    this.markDirty();
    this.invalidateCompilation();
  }

  /**
   * Remove edge from blueprint
   */
  public removeEdge(edgeId: string): void {
    this.edges = this.edges.filter((e) => e.id !== edgeId);
    this.markDirty();
    this.invalidateCompilation();
  }

  /**
   * Get edge by ID
   */
  public getEdge(edgeId: string): EditorEdge | undefined {
    return this.edges.find((e) => e.id === edgeId);
  }

  /**
   * Get edges connected to a node
   */
  public getNodeConnections(nodeId: string): EditorEdge[] {
    return this.edges.filter(
      (e) => e.fromNodeId === nodeId || e.toNodeId === nodeId
    );
  }

  /**
   * Add variable to blueprint
   */
  public addVariable(variable: Variable): void {
    this.variables.push(variable);
    this.markDirty();
  }

  /**
   * Remove variable from blueprint
   */
  public removeVariable(variableId: string): void {
    this.variables = this.variables.filter((v) => v.id !== variableId);
    this.markDirty();
  }

  /**
   * Get variable by ID
   */
  public getVariable(variableId: string): Variable | undefined {
    return this.variables.find((v) => v.id === variableId);
  }

  /**
   * Get variable by name
   */
  public getVariableByName(name: string): Variable | undefined {
    return this.variables.find((v) => v.name === name);
  }

  /**
   * Add function to blueprint
   */
  public addFunction(func: Function): void {
    this.functions.push(func);
    this.markDirty();
  }

  /**
   * Remove function from blueprint
   */
  public removeFunction(functionId: string): void {
    this.functions = this.functions.filter((f) => f.id !== functionId);
    this.markDirty();
  }

  /**
   * Get function by ID
   */
  public getFunction(functionId: string): Function | undefined {
    return this.functions.find((f) => f.id === functionId);
  }

  /**
   * Get function by name
   */
  public getFunctionByName(name: string): Function | undefined {
    return this.functions.find((f) => f.name === name);
  }

  /**
   * Add event to blueprint
   */
  public addEvent(event: Event): void {
    this.events.push(event);
    this.markDirty();
  }

  /**
   * Remove event from blueprint
   */
  public removeEvent(eventId: string): void {
    this.events = this.events.filter((e) => e.id !== eventId);
    this.markDirty();
  }

  /**
   * Get event by ID
   */
  public getEvent(eventId: string): Event | undefined {
    return this.events.find((e) => e.id === eventId);
  }

  /**
   * Get event by name
   */
  public getEventByName(name: string): Event | undefined {
    return this.events.find((e) => e.name === name);
  }

  /**
   * Validate blueprint
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for cycles
    if (this.hasCycles()) {
      errors.push('Blueprint contains circular connections');
    }

    // Check for unconnected nodes
    const unresolvedNodes = this.nodes.filter(
      (node) => this.getNodeConnections(node.id).length === 0
    );
    if (unresolvedNodes.length > 0) {
      errors.push(`Blueprint has ${unresolvedNodes.length} unconnected nodes`);
    }

    // Check for type mismatches
    for (const edge of this.edges) {
      const fromNode = this.getNode(edge.fromNodeId);
      const toNode = this.getNode(edge.toNodeId);

      if (fromNode && toNode) {
        // Add type checking logic here
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if blueprint has cycles
   */
  public hasCycles(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleDFS = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const connectedEdges = this.edges.filter((e) => e.fromNodeId === nodeId);

      for (const edge of connectedEdges) {
        const targetNodeId = edge.toNodeId;

        if (!visited.has(targetNodeId)) {
          if (hasCycleDFS(targetNodeId)) {
            return true;
          }
        } else if (recursionStack.has(targetNodeId)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        if (hasCycleDFS(node.id)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get blueprint statistics
   */
  public getStatistics(): BlueprintStatistics {
    return {
      nodeCount: this.nodes.length,
      connectionCount: this.edges.length,
      variableCount: this.variables.length,
      functionCount: this.functions.length,
      eventCount: this.events.length,
      totalComplexity: this.calculateComplexity(),
      nestingLevel: this.calculateMaxNestingLevel(),
      branchingFactor: this.calculateAverageBranchingFactor(),
    };
  }

  /**
   * Calculate blueprint complexity
   */
  private calculateComplexity(): number {
    let complexity = 0;

    // Count nodes and edges
    complexity += this.nodes.length * 2;
    complexity += this.edges.length;

    // Count variables
    complexity += this.variables.length;

    // Count functions and events
    complexity += this.functions.length * 3;
    complexity += this.events.length * 2;

    return complexity;
  }

  /**
   * Calculate maximum nesting level
   */
  private calculateMaxNestingLevel(): number {
    let maxLevel = 0;

    const getDepth = (nodeId: string, visited = new Set<string>()): number => {
      if (visited.has(nodeId)) return 0;
      visited.add(nodeId);

      const connectedEdges = this.edges.filter((e) => e.fromNodeId === nodeId);
      let maxChildDepth = 0;

      for (const edge of connectedEdges) {
        const childDepth = getDepth(edge.toNodeId, new Set(visited));
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      }

      return maxChildDepth + 1;
    };

    for (const node of this.nodes) {
      const depth = getDepth(node.id);
      maxLevel = Math.max(maxLevel, depth);
    }

    return maxLevel;
  }

  /**
   * Calculate average branching factor
   */
  private calculateAverageBranchingFactor(): number {
    if (this.nodes.length === 0) return 0;

    let totalBranches = 0;

    for (const node of this.nodes) {
      const outgoingEdges = this.edges.filter((e) => e.fromNodeId === node.id);
      totalBranches += outgoingEdges.length;
    }

    return totalBranches / this.nodes.length;
  }

  /**
   * Compile blueprint
   */
  public async compile(mode: CompilationMode = CompilationMode.Debug): Promise<CompilationResult> {
    const request: CompilationRequest = {
      requestId: this.generateId(),
      blueprintId: this.id,
      mode,
      outputFormat: OutputFormat.ByteCode,
      options: {
        optimize: mode === CompilationMode.Release,
        debugInfo: mode === CompilationMode.Debug,
        stripComments: false,
        stripWhitespace: false,
        validateTypes: true,
        validateConnections: true,
        checkDeadCode: true,
        checkCircularDependencies: true,
        inlineSimpleFunctions: mode !== CompilationMode.Debug,
        parallelOptimization: true,
        maxCompilationTime: 30000,
      },
      timestamp: new Date(),
    };

    // Simulate compilation
    const result: CompilationResult = {
      success: !this.hasCycles(),
      blueprintId: this.id,
      timestamp: new Date(),
      duration: Math.random() * 5000 + 1000,
      errors: this.hasCycles() ? [
        {
          id: this.generateId(),
          code: 'CYCLE_DETECTED',
          message: 'Circular dependency detected in blueprint',
          severity: 'critical',
        },
      ] : [],
      warnings: [],
      generatedCode: '// Generated code would go here',
      generatedCodeSize: 1024,
    };

    this.compilationHistory.push(result);

    if (result.success) {
      this.isCompiled = true;
      this.lastCompiled = new Date();
      this.isDirty = false;
    }

    return result;
  }

  /**
   * Create version snapshot
   */
  public createSnapshot(message: string): BlueprintVersion {
    const snapshot: BlueprintVersion = {
      versionId: this.generateId(),
      blueprintId: this.id,
      versionNumber: this.version,
      message,
      author: this.author,
      timestamp: new Date(),
      snapshot: {
        nodes: JSON.parse(JSON.stringify(this.nodes)),
        edges: JSON.parse(JSON.stringify(this.edges)),
        variables: JSON.parse(JSON.stringify(this.variables)),
        functions: JSON.parse(JSON.stringify(this.functions)),
        events: JSON.parse(JSON.stringify(this.events)),
        properties: JSON.parse(JSON.stringify(this.properties)),
      },
      changes: [],
    };

    this.versionHistory.push(snapshot);
    return snapshot;
  }

  /**
   * Restore from snapshot
   */
  public restoreSnapshot(versionId: string): boolean {
    const version = this.versionHistory.find((v) => v.versionId === versionId);

    if (!version) {
      return false;
    }

    this.nodes = JSON.parse(JSON.stringify(version.snapshot.nodes));
    this.edges = JSON.parse(JSON.stringify(version.snapshot.edges));
    this.variables = JSON.parse(JSON.stringify(version.snapshot.variables));
    this.functions = JSON.parse(JSON.stringify(version.snapshot.functions));
    this.events = JSON.parse(JSON.stringify(version.snapshot.events));
    this.properties = JSON.parse(JSON.stringify(version.snapshot.properties));

    this.markDirty();
    this.invalidateCompilation();

    return true;
  }

  /**
   * Mark blueprint as dirty
   */
  private markDirty(): void {
    this.isDirty = true;
    this.modified = new Date();
  }

  /**
   * Invalidate compilation
   */
  private invalidateCompilation(): void {
    this.isCompiled = false;
  }

  /**
   * Get default parent class
   */
  private getDefaultParentClass(): BlueprintClass {
    return {
      id: 'blueprint_base',
      name: 'Blueprint',
      path: '/Engine/Classes/Blueprint',
      isAbstract: false,
      interfaces: [],
    };
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): BlueprintSettings {
    return {
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
  }

  /**
   * Get default properties
   */
  private getDefaultProperties(): BlueprintProperties {
    return {
      displayName: this.name,
      tooltip: this.description,
      category: 'Custom',
      isEditable: true,
      isInstantiable: true,
      isConstant: false,
      searchableText: this.name,
      keywords: [],
      supportedPlatforms: ['Windows', 'Mac', 'iOS', 'Android'],
    };
  }

  /**
   * Create metadata
   */
  private createMetadata(): BlueprintMetadata {
    return {
      blueprintId: this.id,
      searchTags: [],
      relatedBlueprints: [],
      dependencies: [],
      statistics: this.getStatistics(),
      performance: {
        estimatedExecutionTime: 0,
        memoryFootprint: 0,
        cpuUsage: 0,
        lastProfiledAt: new Date(),
        profiledCount: 0,
      },
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export blueprint
   */
  public export(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      nodes: this.nodes,
      edges: this.edges,
      variables: this.variables,
      functions: this.functions,
      events: this.events,
      properties: this.properties,
      settings: this.settings,
      created: this.created,
      modified: this.modified,
    });
  }

  /**
   * Import blueprint
   */
  public static import(jsonData: string): Blueprint {
    const data = JSON.parse(jsonData);
    const blueprint = new Blueprint(data.id, data.name);

    blueprint.description = data.description;
    blueprint.version = data.version;
    blueprint.nodes = data.nodes || [];
    blueprint.edges = data.edges || [];
    blueprint.variables = data.variables || [];
    blueprint.functions = data.functions || [];
    blueprint.events = data.events || [];
    blueprint.properties = data.properties || blueprint.properties;
    blueprint.settings = data.settings || blueprint.settings;
    blueprint.created = new Date(data.created);
    blueprint.modified = new Date(data.modified);

    return blueprint;
  }
}
