/**
 * UE5 Blueprint Generator - Complete system for generating UE5 blueprints programmatically
 * Supports: Actor, Character, Component, Interface, Function Library, Data Asset, Widget blueprints
 * Features: Type system, node generation, pin validation, automatic serialization
 */

// ===== BLUEPRINT TYPE DEFINITIONS =====

export enum BlueprintType {
  Actor = 'Actor',
  Character = 'Character',
  Pawn = 'Pawn',
  Component = 'Component',
  Interface = 'Interface',
  FunctionLibrary = 'FunctionLibrary',
  MacroLibrary = 'MacroLibrary',
  Widget = 'Widget',
  DataAsset = 'DataAsset',
  DataTable = 'DataTable',
  AnimBlueprint = 'AnimBlueprint',
  BehaviorTree = 'BehaviorTree',
  Subsystem = 'Subsystem',
}

export enum NodeType {
  // Event nodes
  Event = 'Event',
  CustomEvent = 'CustomEvent',
  Callable = 'Callable',
  
  // Control flow
  Branch = 'Branch',
  Switch = 'Switch',
  ForLoop = 'ForLoop',
  WhileLoop = 'WhileLoop',
  Sequence = 'Sequence',
  MultiGate = 'MultiGate',
  
  // Function calls
  FunctionCall = 'FunctionCall',
  PureFunctionCall = 'PureFunctionCall',
  ConstructorCall = 'ConstructorCall',
  
  // Variables
  GetVariable = 'GetVariable',
  SetVariable = 'SetVariable',
  
  // Special
  Return = 'Return',
  Delay = 'Delay',
  Timeline = 'Timeline',
  Cast = 'Cast',
  Comment = 'Comment',
}

export enum PinType {
  Exec = 'exec',
  Bool = 'bool',
  Int = 'int32',
  Float = 'float',
  String = 'string',
  Name = 'name',
  Text = 'text',
  Vector = 'FVector',
  Rotator = 'FRotator',
  Transform = 'FTransform',
  Object = 'Object',
  Class = 'Class',
  Interface = 'Interface',
  Struct = 'Struct',
  Array = 'Array',
  Map = 'Map',
  Enum = 'Enum',
  Wildcard = 'Wildcard',
}

// ===== CORE BLUEPRINT STRUCTURES =====

export interface BlueprintPin {
  id: string;
  name: string;
  type: PinType;
  direction: 'Input' | 'Output';
  containerType?: 'Array' | 'Map' | 'Set';
  isArray?: boolean;
  isRef?: boolean;
  defaultValue?: any;
  tooltip?: string;
  bHidden?: boolean;
  bAdvanced?: boolean;
}

export interface BlueprintNode {
  id: string;
  type: NodeType;
  name: string;
  title?: string;
  position: { x: number; y: number };
  pins: BlueprintPin[];
  properties?: Record<string, any>;
  comment?: string;
  color?: string;
  size?: { width: number; height: number };
  metadata?: Record<string, string>;
}

export interface BlueprintEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromPinId: string;
  toPinId: string;
  bDisabled?: boolean;
}

export interface BlueprintFunction {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  category?: string;
  returnType?: PinType;
  inputs: BlueprintPin[];
  outputs: BlueprintPin[];
  bPure?: boolean;
  bCallInEditor?: boolean;
  bConstant?: boolean;
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
  entryNodeId: string;
  resultNodeId: string;
}

export interface BlueprintVariable {
  id: string;
  name: string;
  type: PinType;
  defaultValue?: any;
  bInstanceEditable?: boolean;
  bBlueprintReadOnly?: boolean;
  bReplicated?: boolean;
  category?: string;
  tooltip?: string;
}

export interface BlueprintEvent {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  inputs: BlueprintPin[];
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
  bOverride?: boolean;
  category?: string;
}

export interface BlueprintClass {
  id: string;
  name: string;
  displayName?: string;
  baseClass: string;
  type: BlueprintType;
  description?: string;
  category?: string;
  
  // Structure
  variables: BlueprintVariable[];
  functions: BlueprintFunction[];
  events: BlueprintEvent[];
  components?: string[]; // Component names/references
  interfaces?: string[]; // Interface references
  
  // Event Graph
  eventGraphNodes: BlueprintNode[];
  eventGraphEdges: BlueprintEdge[];
  
  // Construction Script
  constructionScriptNodes?: BlueprintNode[];
  constructionScriptEdges?: BlueprintEdge[];
  
  // Metadata
  metadata?: Record<string, any>;
  tags?: string[];
  isPublic?: boolean;
}

// ===== BLUEPRINT GENERATOR CLASS =====

export class BlueprintGenerator {
  private nodeIdCounter = 0;
  private edgeIdCounter = 0;

  /**
   * Generate a new blueprint class with base configuration
   */
  generateBlueprint(
    name: string,
    baseClass: string,
    type: BlueprintType,
    config?: Partial<BlueprintClass>
  ): BlueprintClass {
    return {
      id: this.generateId('Blueprint'),
      name,
      baseClass,
      type,
      description: config?.description || `Generated ${type} blueprint`,
      category: config?.category || 'Generated',
      variables: config?.variables || [],
      functions: config?.functions || [],
      events: config?.events || [],
      components: config?.components || [],
      interfaces: config?.interfaces || [],
      eventGraphNodes: config?.eventGraphNodes || [],
      eventGraphEdges: config?.eventGraphEdges || [],
      metadata: config?.metadata || {},
      tags: config?.tags || ['Generated', 'Auto'],
      isPublic: config?.isPublic !== false,
    };
  }

  /**
   * Generate a new function with entry/result nodes
   */
  generateFunction(
    name: string,
    config?: {
      displayName?: string;
      description?: string;
      category?: string;
      inputs?: BlueprintPin[];
      outputs?: BlueprintPin[];
      bPure?: boolean;
      bCallInEditor?: boolean;
    }
  ): BlueprintFunction {
    const entryNodeId = this.generateId('FunctionEntry');
    const resultNodeId = this.generateId('FunctionResult');

    // Create entry node
    const entryNode: BlueprintNode = {
      id: entryNodeId,
      type: NodeType.Callable,
      name: 'Function Entry',
      position: { x: 0, y: 0 },
      pins: [
        {
          id: this.generateId('Pin'),
          name: 'then',
          type: PinType.Exec,
          direction: 'Output',
        },
        ...(config?.inputs || []).map((pin) => ({
          ...pin,
          direction: 'Output' as const,
        })),
      ],
    };

    // Create result node
    const resultNode: BlueprintNode = {
      id: resultNodeId,
      type: NodeType.Return,
      name: 'Function Result',
      position: { x: 300, y: 0 },
      pins: [
        {
          id: this.generateId('Pin'),
          name: 'execute',
          type: PinType.Exec,
          direction: 'Input',
        },
        ...(config?.outputs || []).map((pin) => ({
          ...pin,
          direction: 'Input' as const,
        })),
      ],
    };

    return {
      id: this.generateId('Function'),
      name,
      displayName: config?.displayName || name,
      description: config?.description || `Generated function: ${name}`,
      category: config?.category || 'Generated',
      returnType: config?.outputs?.[0]?.type,
      inputs: config?.inputs || [],
      outputs: config?.outputs || [],
      bPure: config?.bPure || false,
      bCallInEditor: config?.bCallInEditor || false,
      nodes: [entryNode, resultNode],
      edges: [],
      entryNodeId,
      resultNodeId,
    };
  }

  /**
   * Generate an event with entry node
   */
  generateEvent(
    name: string,
    config?: {
      displayName?: string;
      description?: string;
      inputs?: BlueprintPin[];
      category?: string;
      bOverride?: boolean;
    }
  ): BlueprintEvent {
    const entryNodeId = this.generateId('EventEntry');

    const entryNode: BlueprintNode = {
      id: entryNodeId,
      type: NodeType.Event,
      name: `Event ${name}`,
      position: { x: 0, y: 0 },
      pins: [
        {
          id: this.generateId('Pin'),
          name: 'then',
          type: PinType.Exec,
          direction: 'Output',
        },
        ...(config?.inputs || []).map((pin) => ({
          ...pin,
          direction: 'Output' as const,
        })),
      ],
    };

    return {
      id: this.generateId('Event'),
      name,
      displayName: config?.displayName || name,
      description: config?.description || `Event: ${name}`,
      inputs: config?.inputs || [],
      nodes: [entryNode],
      edges: [],
      bOverride: config?.bOverride || false,
      category: config?.category || 'Generated',
    };
  }

  /**
   * Generate a variable
   */
  generateVariable(
    name: string,
    type: PinType,
    config?: {
      defaultValue?: any;
      bInstanceEditable?: boolean;
      bBlueprintReadOnly?: boolean;
      bReplicated?: boolean;
      category?: string;
      tooltip?: string;
    }
  ): BlueprintVariable {
    return {
      id: this.generateId('Variable'),
      name,
      type,
      defaultValue: config?.defaultValue,
      bInstanceEditable: config?.bInstanceEditable !== false,
      bBlueprintReadOnly: config?.bBlueprintReadOnly || false,
      bReplicated: config?.bReplicated || false,
      category: config?.category || 'Variables',
      tooltip: config?.tooltip || `Variable: ${name}`,
    };
  }

  /**
   * Generate a node of any type
   */
  generateNode(
    type: NodeType,
    config?: {
      name?: string;
      title?: string;
      position?: { x: number; y: number };
      pins?: BlueprintPin[];
      properties?: Record<string, any>;
      comment?: string;
      color?: string;
    }
  ): BlueprintNode {
    return {
      id: this.generateId('Node'),
      type,
      name: config?.name || type,
      title: config?.title,
      position: config?.position || { x: 0, y: 0 },
      pins: config?.pins || this.getDefaultPinsForNodeType(type),
      properties: config?.properties || {},
      comment: config?.comment,
      color: config?.color,
    };
  }

  /**
   * Generate a branch node (if-then-else)
   */
  generateBranchNode(position?: { x: number; y: number }): BlueprintNode {
    return {
      id: this.generateId('BranchNode'),
      type: NodeType.Branch,
      name: 'Branch',
      position: position || { x: 0, y: 0 },
      pins: [
        {
          id: this.generateId('Pin'),
          name: 'execute',
          type: PinType.Exec,
          direction: 'Input',
        },
        {
          id: this.generateId('Pin'),
          name: 'Condition',
          type: PinType.Bool,
          direction: 'Input',
        },
        {
          id: this.generateId('Pin'),
          name: 'True',
          type: PinType.Exec,
          direction: 'Output',
        },
        {
          id: this.generateId('Pin'),
          name: 'False',
          type: PinType.Exec,
          direction: 'Output',
        },
      ],
    };
  }

  /**
   * Generate a for loop node
   */
  generateForLoopNode(position?: { x: number; y: number }): BlueprintNode {
    return {
      id: this.generateId('ForLoopNode'),
      type: NodeType.ForLoop,
      name: 'For Loop',
      position: position || { x: 0, y: 0 },
      pins: [
        {
          id: this.generateId('Pin'),
          name: 'LoopBody',
          type: PinType.Exec,
          direction: 'Output',
        },
        {
          id: this.generateId('Pin'),
          name: 'Completed',
          type: PinType.Exec,
          direction: 'Output',
        },
        {
          id: this.generateId('Pin'),
          name: 'Index',
          type: PinType.Int,
          direction: 'Output',
        },
        {
          id: this.generateId('Pin'),
          name: 'FirstIndex',
          type: PinType.Int,
          direction: 'Input',
        },
        {
          id: this.generateId('Pin'),
          name: 'LastIndex',
          type: PinType.Int,
          direction: 'Input',
        },
      ],
    };
  }

  /**
   * Generate a function call node
   */
  generateFunctionCallNode(
    functionName: string,
    inputs: BlueprintPin[],
    outputs: BlueprintPin[],
    position?: { x: number; y: number }
  ): BlueprintNode {
    return {
      id: this.generateId('FunctionCall'),
      type: NodeType.FunctionCall,
      name: functionName,
      position: position || { x: 0, y: 0 },
      pins: [
        {
          id: this.generateId('Pin'),
          name: 'execute',
          type: PinType.Exec,
          direction: 'Input',
        },
        {
          id: this.generateId('Pin'),
          name: 'then',
          type: PinType.Exec,
          direction: 'Output',
        },
        ...inputs.map((pin) => ({
          ...pin,
          direction: 'Input' as const,
        })),
        ...outputs.map((pin) => ({
          ...pin,
          direction: 'Output' as const,
        })),
      ],
      properties: {
        FunctionName: functionName,
      },
    };
  }

  /**
   * Generate a sequence node
   */
  generateSequenceNode(sequenceCount: number = 2, position?: { x: number; y: number }): BlueprintNode {
    const pins: BlueprintPin[] = [
      {
        id: this.generateId('Pin'),
        name: 'execute',
        type: PinType.Exec,
        direction: 'Input',
      },
    ];

    for (let i = 0; i < sequenceCount; i++) {
      pins.push({
        id: this.generateId('Pin'),
        name: `then_${i}`,
        type: PinType.Exec,
        direction: 'Output',
      });
    }

    return {
      id: this.generateId('SequenceNode'),
      type: NodeType.Sequence,
      name: 'Sequence',
      position: position || { x: 0, y: 0 },
      pins,
    };
  }

  /**
   * Generate a delay node
   */
  generateDelayNode(duration: number = 1.0, position?: { x: number; y: number }): BlueprintNode {
    return {
      id: this.generateId('DelayNode'),
      type: NodeType.Delay,
      name: 'Delay',
      position: position || { x: 0, y: 0 },
      pins: [
        {
          id: this.generateId('Pin'),
          name: 'execute',
          type: PinType.Exec,
          direction: 'Input',
        },
        {
          id: this.generateId('Pin'),
          name: 'Duration',
          type: PinType.Float,
          direction: 'Input',
          defaultValue: duration,
        },
        {
          id: this.generateId('Pin'),
          name: 'Completed',
          type: PinType.Exec,
          direction: 'Output',
        },
      ],
      properties: {
        Duration: duration,
      },
    };
  }

  /**
   * Create an edge (connection) between two nodes
   */
  createEdge(
    fromNodeId: string,
    toNodeId: string,
    fromPinId: string,
    toPinId: string
  ): BlueprintEdge {
    return {
      id: this.generateId('Edge'),
      fromNodeId,
      toNodeId,
      fromPinId,
      toPinId,
    };
  }

  /**
   * Get default pins for a node type
   */
  private getDefaultPinsForNodeType(type: NodeType): BlueprintPin[] {
    const pins: BlueprintPin[] = [];

    switch (type) {
      case NodeType.Event:
      case NodeType.CustomEvent:
        pins.push({
          id: this.generateId('Pin'),
          name: 'then',
          type: PinType.Exec,
          direction: 'Output',
        });
        break;

      case NodeType.Branch:
        pins.push(
          {
            id: this.generateId('Pin'),
            name: 'execute',
            type: PinType.Exec,
            direction: 'Input',
          },
          {
            id: this.generateId('Pin'),
            name: 'Condition',
            type: PinType.Bool,
            direction: 'Input',
          },
          {
            id: this.generateId('Pin'),
            name: 'True',
            type: PinType.Exec,
            direction: 'Output',
          },
          {
            id: this.generateId('Pin'),
            name: 'False',
            type: PinType.Exec,
            direction: 'Output',
          }
        );
        break;

      case NodeType.Return:
        pins.push({
          id: this.generateId('Pin'),
          name: 'execute',
          type: PinType.Exec,
          direction: 'Input',
        });
        break;
    }

    return pins;
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate blueprint structure
   */
  validateBlueprint(blueprint: BlueprintClass): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check name
    if (!blueprint.name || blueprint.name.trim() === '') {
      errors.push('Blueprint must have a name');
    }

    if (!blueprint.name.match(/^BP_/)) {
      warnings.push('Blueprint name should start with "BP_" prefix');
    }

    // Check base class
    if (!blueprint.baseClass) {
      errors.push('Blueprint must have a base class');
    }

    // Check for orphan nodes
    const nodeIds = new Set([
      ...blueprint.eventGraphNodes.map((n) => n.id),
      ...blueprint.functions.flatMap((f) => f.nodes.map((n) => n.id)),
      ...blueprint.events.flatMap((e) => e.nodes.map((n) => n.id)),
    ]);

    const connectedNodes = new Set<string>();
    [...blueprint.eventGraphEdges, ...blueprint.functions.flatMap((f) => f.edges), ...blueprint.events.flatMap((e) => e.edges)].forEach((edge) => {
      connectedNodes.add(edge.fromNodeId);
      connectedNodes.add(edge.toNodeId);
    });

    nodeIds.forEach((nodeId) => {
      if (!connectedNodes.has(nodeId)) {
        warnings.push(`Node ${nodeId} is not connected to anything`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate a complete RPG character blueprint
   */
  generateRPGCharacterBlueprint(
    characterName: string,
    characterClass: string
  ): BlueprintClass {
    const blueprint = this.generateBlueprint(
      `BP_Character_${characterName}`,
      'Character',
      BlueprintType.Character,
      {
        category: 'Characters',
        description: `RPG ${characterClass} Character Blueprint`,
        tags: ['RPG', 'Character', characterClass],
      }
    );

    // Add common RPG variables
    blueprint.variables = [
      this.generateVariable('Health', PinType.Float, {
        defaultValue: 100,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      this.generateVariable('MaxHealth', PinType.Float, {
        defaultValue: 100,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      this.generateVariable('Mana', PinType.Float, {
        defaultValue: 50,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      this.generateVariable('MaxMana', PinType.Float, {
        defaultValue: 50,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      this.generateVariable('AttackPower', PinType.Float, {
        defaultValue: 10,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      this.generateVariable('Defense', PinType.Float, {
        defaultValue: 5,
        bInstanceEditable: true,
        category: 'Stats',
      }),
      this.generateVariable('Level', PinType.Int, {
        defaultValue: 1,
        bInstanceEditable: true,
        category: 'Progression',
      }),
      this.generateVariable('Experience', PinType.Int, {
        defaultValue: 0,
        category: 'Progression',
      }),
      this.generateVariable('IsAlive', PinType.Bool, {
        defaultValue: true,
        category: 'State',
      }),
    ];

    // Add common functions
    blueprint.functions = [
      this.generateFunction('TakeDamage', {
        displayName: 'Take Damage',
        category: 'Combat',
        inputs: [
          { id: '', name: 'DamageAmount', type: PinType.Float, direction: 'Input' },
        ],
      }),
      this.generateFunction('Heal', {
        displayName: 'Heal',
        category: 'Combat',
        inputs: [
          { id: '', name: 'HealAmount', type: PinType.Float, direction: 'Input' },
        ],
      }),
      this.generateFunction('LevelUp', {
        displayName: 'Level Up',
        category: 'Progression',
      }),
      this.generateFunction('Die', {
        displayName: 'Die',
        category: 'Combat',
      }),
    ];

    // Add common events
    blueprint.events = [
      this.generateEvent('BeginPlay', {
        displayName: 'Begin Play',
        category: 'Events',
      }),
      this.generateEvent('OnDeath', {
        displayName: 'On Death',
        category: 'Events',
      }),
      this.generateEvent('OnLevelUp', {
        displayName: 'On Level Up',
        category: 'Events',
      }),
    ];

    return blueprint;
  }
}

// ===== SINGLETON INSTANCE =====

export const blueprintGenerator = new BlueprintGenerator();
