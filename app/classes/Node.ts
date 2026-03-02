/**
 * Node Class
 * Implementation of blueprint node with full functionality
 */

import { EditorNode, NodeType, NodeCategory, Pin, NodeProperty, Position, NodeSize } from '@/app/types/nodes';
import { DataType } from '@/app/types/blueprint';
import { Pin as PinClass } from './Pin';

/**
 * Node
 * Complete node implementation
 */
export class Node implements EditorNode {
  id: string;
  type: NodeType;
  nodeClass: string;
  position: Position;
  size: NodeSize;
  isCollapsed: boolean;
  displayName: string;
  description: string;
  category: NodeCategory;
  inputPins: Pin[];
  outputPins: Pin[];
  properties: NodeProperty[];
  metadata: any;
  isEnabled: boolean;
  isBreakpoint: boolean;
  comments: any[];
  color?: string;
  icon?: string;
  tags: string[];

  /**
   * Constructor
   */
  constructor(
    id: string,
    type: NodeType,
    position: Position,
    displayName?: string,
    description?: string
  ) {
    this.id = id;
    this.type = type;
    this.nodeClass = this.getNodeClass(type);
    this.position = position;
    this.size = { width: 200, height: 100 };
    this.isCollapsed = false;

    this.displayName = displayName || this.getDefaultDisplayName(type);
    this.description = description || '';
    this.category = this.getCategory(type);

    this.inputPins = [];
    this.outputPins = [];
    this.properties = [];
    this.comments = [];

    this.isEnabled = true;
    this.isBreakpoint = false;
    this.tags = [];

    this.metadata = {
      nodeId: id,
      createdAt: new Date(),
      modifiedAt: new Date(),
      version: '1.0.0',
    };

    this.initializePins();
  }

  /**
   * Initialize pins based on node type
   */
  private initializePins(): void {
    switch (this.type) {
      case NodeType.Branch:
        this.addInputExecutionPin('Execute');
        this.addInputPin('Condition', 'bool');
        this.addOutputExecutionPin('True');
        this.addOutputExecutionPin('False');
        break;

      case NodeType.Add:
      case NodeType.Subtract:
      case NodeType.Multiply:
      case NodeType.Divide:
        this.addInputPin('A', 'float');
        this.addInputPin('B', 'float');
        this.addOutputPin('Result', 'float');
        break;

      case NodeType.VariableGet:
        this.addOutputPin('Value', 'object');
        break;

      case NodeType.VariableSet:
        this.addInputExecutionPin('Execute');
        this.addInputPin('Value', 'object');
        this.addOutputExecutionPin('Completed');
        break;

      case NodeType.FunctionCall:
      case NodeType.PureFunction:
        this.addInputExecutionPin('Execute');
        this.addOutputExecutionPin('Completed');
        break;

      case NodeType.And:
      case NodeType.Or:
        this.addInputPin('A', 'bool');
        this.addInputPin('B', 'bool');
        this.addOutputPin('Result', 'bool');
        break;

      case NodeType.Not:
        this.addInputPin('A', 'bool');
        this.addOutputPin('Result', 'bool');
        break;

      case NodeType.Equal:
      case NodeType.NotEqual:
      case NodeType.Less:
      case NodeType.Greater:
        this.addInputPin('A', 'object');
        this.addInputPin('B', 'object');
        this.addOutputPin('Result', 'bool');
        break;

      case NodeType.StringConcat:
        this.addInputPin('A', 'string');
        this.addInputPin('B', 'string');
        this.addOutputPin('Result', 'string');
        break;

      case NodeType.ArrayLength:
        this.addInputPin('Array', 'array');
        this.addOutputPin('Length', 'int');
        break;

      case NodeType.EventBeginPlay:
      case NodeType.EventEndPlay:
        this.addOutputExecutionPin('Event');
        break;

      default:
        // Default: one input execution, one output execution
        this.addInputExecutionPin('In');
        this.addOutputExecutionPin('Out');
    }
  }

  /**
   * Add input data pin
   */
  public addInputPin(name: string, type: DataType, defaultValue?: any): Pin {
    const pin: Pin = {
      id: `${this.id}_input_${name}`,
      name,
      direction: 'Input' as any,
      type,
      defaultValue,
      connections: [],
      displayName: name,
      isAdvanced: false,
      isHidden: false,
      isArray: false,
      isReference: false,
      isConst: false,
    };

    this.inputPins.push(pin);
    return pin;
  }

  /**
   * Add output data pin
   */
  public addOutputPin(name: string, type: DataType): Pin {
    const pin: Pin = {
      id: `${this.id}_output_${name}`,
      name,
      direction: 'Output' as any,
      type,
      connections: [],
      displayName: name,
      isAdvanced: false,
      isHidden: false,
      isArray: false,
      isReference: false,
      isConst: false,
    };

    this.outputPins.push(pin);
    return pin;
  }

  /**
   * Add input execution pin
   */
  public addInputExecutionPin(name: string = 'Execute'): Pin {
    const pin: Pin = {
      id: `${this.id}_exec_input_${name}`,
      name,
      direction: 'Input' as any,
      type: 'void',
      connections: [],
      displayName: name,
      isExecution: true,
      isInputExecution: true,
      isArray: false,
      isReference: false,
      isConst: false,
    };

    this.inputPins.push(pin);
    return pin;
  }

  /**
   * Add output execution pin
   */
  public addOutputExecutionPin(name: string = 'Then'): Pin {
    const pin: Pin = {
      id: `${this.id}_exec_output_${name}`,
      name,
      direction: 'Output' as any,
      type: 'void',
      connections: [],
      displayName: name,
      isExecution: true,
      isOutputExecution: true,
      isArray: false,
      isReference: false,
      isConst: false,
    };

    this.outputPins.push(pin);
    return pin;
  }

  /**
   * Get input pin by name
   */
  public getInputPin(name: string): Pin | undefined {
    return this.inputPins.find((p) => p.name === name);
  }

  /**
   * Get output pin by name
   */
  public getOutputPin(name: string): Pin | undefined {
    return this.outputPins.find((p) => p.name === name);
  }

  /**
   * Get pin by ID
   */
  public getPinById(pinId: string): Pin | undefined {
    return [
      ...this.inputPins,
      ...this.outputPins,
    ].find((p) => p.id === pinId);
  }

  /**
   * Add property
   */
  public addProperty(property: NodeProperty): void {
    this.properties.push(property);
    this.metadata.modifiedAt = new Date();
  }

  /**
   * Get property by name
   */
  public getProperty(name: string): NodeProperty | undefined {
    return this.properties.find((p) => p.name === name);
  }

  /**
   * Set property value
   */
  public setPropertyValue(name: string, value: any): void {
    const property = this.getProperty(name);
    if (property) {
      property.value = value;
      this.metadata.modifiedAt = new Date();
    }
  }

  /**
   * Move node
   */
  public move(x: number, y: number): void {
    this.position = { x, y };
    this.metadata.modifiedAt = new Date();
  }

  /**
   * Resize node
   */
  public resize(width: number, height: number): void {
    this.size = { width, height };
    this.metadata.modifiedAt = new Date();
  }

  /**
   * Toggle collapsed state
   */
  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.metadata.modifiedAt = new Date();
  }

  /**
   * Enable/disable node
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.metadata.modifiedAt = new Date();
  }

  /**
   * Set breakpoint
   */
  public setBreakpoint(enabled: boolean): void {
    this.isBreakpoint = enabled;
    this.metadata.modifiedAt = new Date();
  }

  /**
   * Add comment
   */
  public addComment(author: string, content: string): void {
    this.comments.push({
      id: this.generateId(),
      author,
      content,
      timestamp: new Date(),
      resolved: false,
    });
    this.metadata.modifiedAt = new Date();
  }

  /**
   * Validate node
   */
  public validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if node has required pins connected
    const requiredInputs = this.inputPins.filter(
      (p) => !p.isAdvanced && !p.isHidden
    );

    for (const pin of requiredInputs) {
      if (pin.connections.length === 0 && pin.defaultValue === undefined) {
        errors.push(`Required pin '${pin.name}' is not connected`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clone node
   */
  public clone(newId: string, newPosition: Position): Node {
    const cloned = new Node(newId, this.type, newPosition, this.displayName, this.description);

    // Clone properties
    cloned.properties = this.properties.map((p) => ({ ...p }));
    cloned.color = this.color;
    cloned.icon = this.icon;
    cloned.tags = [...this.tags];

    return cloned;
  }

  /**
   * Export node
   */
  public export(): string {
    return JSON.stringify({
      id: this.id,
      type: this.type,
      nodeClass: this.nodeClass,
      position: this.position,
      size: this.size,
      displayName: this.displayName,
      description: this.description,
      inputPins: this.inputPins,
      outputPins: this.outputPins,
      properties: this.properties,
      isEnabled: this.isEnabled,
      color: this.color,
      tags: this.tags,
    });
  }

  /**
   * Get node class for type
   */
  private getNodeClass(type: NodeType): string {
    return `BP_${type}`;
  }

  /**
   * Get default display name
   */
  private getDefaultDisplayName(type: NodeType): string {
    return type
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }

  /**
   * Get category for node type
   */
  private getCategory(type: NodeType): NodeCategory {
    if ([NodeType.Branch, NodeType.Switch, NodeType.Sequence].includes(type)) {
      return NodeCategory.Control;
    }
    if ([NodeType.VariableGet, NodeType.VariableSet].includes(type)) {
      return NodeCategory.Data;
    }
    if ([NodeType.Add, NodeType.Subtract, NodeType.Multiply, NodeType.Divide].includes(type)) {
      return NodeCategory.Math;
    }
    if ([NodeType.And, NodeType.Or, NodeType.Not].includes(type)) {
      return NodeCategory.Logic;
    }
    if ([NodeType.StringConcat, NodeType.StringLength].includes(type)) {
      return NodeCategory.String;
    }
    if ([NodeType.ArrayLength, NodeType.ArrayGet].includes(type)) {
      return NodeCategory.Array;
    }
    if ([NodeType.EventBeginPlay, NodeType.EventEndPlay].includes(type)) {
      return NodeCategory.Events;
    }
    return NodeCategory.Custom;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
