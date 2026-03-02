/**
 * Pin Class
 * Implementation of connection point on nodes
 */

import { Pin as IPinInterface, PinConnection, PinDirection } from '@/app/types/nodes';
import { DataType } from '@/app/types/blueprint';

/**
 * Pin
 * Connection point on a node
 */
export class Pin implements IPinInterface {
  id: string;
  name: string;
  direction: PinDirection;
  type: DataType;
  defaultValue?: any;
  connections: PinConnection[];
  displayName?: string;
  tooltip?: string;
  isAdvanced?: boolean;
  isHidden?: boolean;
  isArray?: boolean;
  isReference?: boolean;
  isConst?: boolean;
  isExecution?: boolean;
  isInputExecution?: boolean;
  isOutputExecution?: boolean;

  /**
   * Constructor
   */
  constructor(
    id: string,
    name: string,
    direction: PinDirection,
    type: DataType,
    defaultValue?: any
  ) {
    this.id = id;
    this.name = name;
    this.direction = direction;
    this.type = type;
    this.defaultValue = defaultValue;
    this.connections = [];
    this.displayName = name;
    this.isAdvanced = false;
    this.isHidden = false;
    this.isArray = false;
    this.isReference = false;
    this.isConst = false;
  }

  /**
   * Add connection
   */
  public addConnection(connection: PinConnection): void {
    if (!this.isConnected(connection)) {
      this.connections.push(connection);
    }
  }

  /**
   * Remove connection
   */
  public removeConnection(connectionId: string): void {
    this.connections = this.connections.filter((c) => c.id !== connectionId);
  }

  /**
   * Check if already connected
   */
  public isConnected(connection: PinConnection): boolean {
    return this.connections.some(
      (c) =>
        c.fromNodeId === connection.fromNodeId &&
        c.fromPinId === connection.fromPinId &&
        c.toNodeId === connection.toNodeId &&
        c.toPinId === connection.toPinId
    );
  }

  /**
   * Get connected pins
   */
  public getConnectedPins(): Array<{ nodeId: string; pinId: string }> {
    return this.connections.map((c) => {
      if (this.direction === 'Input') {
        return { nodeId: c.fromNodeId, pinId: c.fromPinId };
      } else {
        return { nodeId: c.toNodeId, pinId: c.toPinId };
      }
    });
  }

  /**
   * Clear all connections
   */
  public clearConnections(): void {
    this.connections = [];
  }

  /**
   * Get connection count
   */
  public getConnectionCount(): number {
    return this.connections.length;
  }

  /**
   * Is connected
   */
  public hasConnections(): boolean {
    return this.connections.length > 0;
  }

  /**
   * Can connect to pin
   */
  public canConnectTo(otherPin: Pin): boolean {
    // Different directions
    if (this.direction === otherPin.direction) {
      return false;
    }

    // Compatible types
    if (!this.isTypeCompatible(this.type, otherPin.type)) {
      return false;
    }

    // Not self-connection
    if (this.id === otherPin.id) {
      return false;
    }

    return true;
  }

  /**
   * Check type compatibility
   */
  private isTypeCompatible(type1: DataType, type2: DataType): boolean {
    // Same type
    if (type1 === type2) {
      return true;
    }

    // Wildcard types
    if (type1 === 'object' || type2 === 'object') {
      return true;
    }

    // Numeric compatibility
    const numericTypes = ['int', 'float', 'double', 'byte', 'int64'];
    if (numericTypes.includes(String(type1)) && numericTypes.includes(String(type2))) {
      return true;
    }

    // Void is not compatible with data pins
    if (type1 === 'void' || type2 === 'void') {
      return false;
    }

    return false;
  }

  /**
   * Set tooltip
   */
  public setTooltip(tooltip: string): void {
    this.tooltip = tooltip;
  }

  /**
   * Set advanced flag
   */
  public setAdvanced(advanced: boolean): void {
    this.isAdvanced = advanced;
  }

  /**
   * Set hidden flag
   */
  public setHidden(hidden: boolean): void {
    this.isHidden = hidden;
  }

  /**
   * Set array flag
   */
  public setArray(isArray: boolean): void {
    this.isArray = isArray;
  }

  /**
   * Set reference flag
   */
  public setReference(isReference: boolean): void {
    this.isReference = isReference;
  }

  /**
   * Set const flag
   */
  public setConst(isConst: boolean): void {
    this.isConst = isConst;
  }

  /**
   * Mark as execution pin
   */
  public markAsExecution(isInput: boolean): void {
    this.isExecution = true;
    this.isInputExecution = isInput;
    this.isOutputExecution = !isInput;
    this.type = 'void';
  }

  /**
   * Export pin
   */
  public export(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      direction: this.direction,
      type: this.type,
      defaultValue: this.defaultValue,
      isArray: this.isArray,
      isReference: this.isReference,
      isConst: this.isConst,
      isExecution: this.isExecution,
      connections: this.connections.length,
    });
  }

  /**
   * Clone pin
   */
  public clone(newId: string): Pin {
    const cloned = new Pin(newId, this.name, this.direction, this.type, this.defaultValue);

    cloned.displayName = this.displayName;
    cloned.tooltip = this.tooltip;
    cloned.isAdvanced = this.isAdvanced;
    cloned.isHidden = this.isHidden;
    cloned.isArray = this.isArray;
    cloned.isReference = this.isReference;
    cloned.isConst = this.isConst;
    cloned.isExecution = this.isExecution;
    cloned.isInputExecution = this.isInputExecution;
    cloned.isOutputExecution = this.isOutputExecution;

    return cloned;
  }
}

/**
 * Pin Factory
 * Factory for creating pins
 */
export class PinFactory {
  /**
   * Create input data pin
   */
  static createInputPin(
    nodeId: string,
    name: string,
    type: DataType,
    defaultValue?: any
  ): Pin {
    return new Pin(`${nodeId}_input_${name}`, name, 'Input', type, defaultValue);
  }

  /**
   * Create output data pin
   */
  static createOutputPin(
    nodeId: string,
    name: string,
    type: DataType
  ): Pin {
    return new Pin(`${nodeId}_output_${name}`, name, 'Output', type);
  }

  /**
   * Create input execution pin
   */
  static createInputExecPin(nodeId: string, name: string = 'Execute'): Pin {
    const pin = new Pin(`${nodeId}_exec_in_${name}`, name, 'Input', 'void');
    pin.markAsExecution(true);
    return pin;
  }

  /**
   * Create output execution pin
   */
  static createOutputExecPin(nodeId: string, name: string = 'Then'): Pin {
    const pin = new Pin(`${nodeId}_exec_out_${name}`, name, 'Output', 'void');
    pin.markAsExecution(false);
    return pin;
  }

  /**
   * Create array pin
   */
  static createArrayPin(
    nodeId: string,
    name: string,
    direction: PinDirection,
    elementType: DataType
  ): Pin {
    const pin = new Pin(`${nodeId}_array_${name}`, name, direction, 'array');
    pin.setArray(true);
    return pin;
  }

  /**
   * Create reference pin
   */
  static createReferencePin(
    nodeId: string,
    name: string,
    direction: PinDirection,
    type: DataType
  ): Pin {
    const pin = new Pin(`${nodeId}_ref_${name}`, name, direction, type);
    pin.setReference(true);
    return pin;
  }
}
