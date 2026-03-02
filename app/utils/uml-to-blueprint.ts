/**
 * UML to Blueprint Converter - Transform UML diagrams into executable UE5 blueprints
 * Supports: Class Diagrams, Sequence Diagrams, State Diagrams, Activity Diagrams
 */

import {
  BlueprintClass,
  BlueprintFunction,
  BlueprintVariable,
  BlueprintEvent,
  BlueprintNode,
  BlueprintEdge,
  BlueprintType,
  NodeType,
  PinType,
  blueprintGenerator,
} from './ue5-blueprint-generator';

// ===== UML STRUCTURES =====

export interface UMLClass {
  name: string;
  stereotype?: string;
  attributes: UMLAttribute[];
  methods: UMLMethod[];
  associations: UMLAssociation[];
}

export interface UMLAttribute {
  name: string;
  type: string;
  visibility: 'public' | 'private' | 'protected';
  isStatic?: boolean;
  defaultValue?: any;
}

export interface UMLMethod {
  name: string;
  visibility: 'public' | 'private' | 'protected';
  returnType: string;
  parameters: UMLParameter[];
  isAbstract?: boolean;
  isStatic?: boolean;
}

export interface UMLParameter {
  name: string;
  type: string;
  direction?: 'in' | 'out' | 'inout';
  defaultValue?: any;
}

export interface UMLAssociation {
  targetClass: string;
  relationshipType: 'association' | 'composition' | 'aggregation' | 'inheritance';
  multiplicity?: string;
  label?: string;
}

export interface UMLSequenceDiagram {
  name: string;
  actors: UMLActor[];
  messages: UMLMessage[];
  interactions: UMLInteraction[];
}

export interface UMLActor {
  name: string;
  type: 'object' | 'class';
}

export interface UMLMessage {
  from: string;
  to: string;
  name: string;
  sequence: number;
  messageType: 'synchronous' | 'asynchronous' | 'return';
  parameters?: string[];
}

export interface UMLInteraction {
  type: 'alt' | 'loop' | 'par' | 'neg' | 'opt';
  condition?: string;
  messages: UMLMessage[];
}

export interface UMLStateDiagram {
  name: string;
  states: UMLState[];
  transitions: UMLTransition[];
  initialState?: string;
  finalStates?: string[];
}

export interface UMLState {
  name: string;
  type: 'simple' | 'composite' | 'history';
  entry?: string;
  exit?: string;
  activities?: string[];
}

export interface UMLTransition {
  from: string;
  to: string;
  event: string;
  guard?: string;
  action?: string;
}

// ===== CLASS DIAGRAM CONVERTER =====

export class UMLClassToBlueprintConverter {
  convert(umlClass: UMLClass, baseClass: string = 'Actor'): BlueprintClass {
    // Determine blueprint type from stereotype
    const type = this.getBlueprintTypeFromStereotype(umlClass.stereotype);

    const blueprint = blueprintGenerator.generateBlueprint(
      `BP_${umlClass.name}`,
      baseClass,
      type,
      {
        category: 'Generated/UML',
        description: `Generated from UML class diagram: ${umlClass.name}`,
        tags: ['UML', 'Generated', umlClass.name],
      }
    );

    // Convert attributes to variables
    blueprint.variables = umlClass.attributes.map((attr) =>
      blueprintGenerator.generateVariable(attr.name, this.mapUMLTypeToPinType(attr.type), {
        defaultValue: attr.defaultValue,
        bInstanceEditable: attr.visibility === 'public',
        bBlueprintReadOnly: attr.visibility === 'private',
        category: this.getVariableCategory(attr),
      })
    );

    // Convert methods to functions
    blueprint.functions = umlClass.methods.map((method) =>
      blueprintGenerator.generateFunction(method.name, {
        displayName: method.name,
        description: `Method from UML: ${method.name}`,
        category: 'Methods',
        inputs: method.parameters.map((param) => ({
          id: '',
          name: param.name,
          type: this.mapUMLTypeToPinType(param.type),
          direction: 'Input',
        })),
        outputs:
          method.returnType && method.returnType !== 'void'
            ? [
              {
                id: '',
                name: 'Result',
                type: this.mapUMLTypeToPinType(method.returnType),
                direction: 'Output',
              },
            ]
            : [],
        bPure: !method.isStatic,
      })
    );

    // Handle associations
    blueprint.components = umlClass.associations
      .filter((a) => a.relationshipType === 'composition' || a.relationshipType === 'aggregation')
      .map((a) => a.targetClass);

    blueprint.interfaces = umlClass.associations
      .filter((a) => a.relationshipType === 'inheritance')
      .map((a) => a.targetClass);

    return blueprint;
  }

  private getBlueprintTypeFromStereotype(stereotype?: string): BlueprintType {
    if (!stereotype) return BlueprintType.Actor;

    const stereotypeMap: Record<string, BlueprintType> = {
      '<<Actor>>': BlueprintType.Actor,
      '<<Character>>': BlueprintType.Character,
      '<<Pawn>>': BlueprintType.Pawn,
      '<<Component>>': BlueprintType.Component,
      '<<Interface>>': BlueprintType.Interface,
      '<<Widget>>': BlueprintType.Widget,
      '<<Subsystem>>': BlueprintType.Subsystem,
    };

    return stereotypeMap[stereotype] || BlueprintType.Actor;
  }

  private mapUMLTypeToPinType(umlType: string): PinType {
    const typeMap: Record<string, PinType> = {
      'boolean': PinType.Bool,
      'int': PinType.Int,
      'float': PinType.Float,
      'double': PinType.Float,
      'string': PinType.String,
      'String': PinType.String,
      'void': PinType.Exec,
      'Vector': PinType.Vector,
      'Rotator': PinType.Rotator,
      'Transform': PinType.Transform,
      'Object': PinType.Object,
    };

    return typeMap[umlType] || PinType.Object;
  }

  private getVariableCategory(attr: UMLAttribute): string {
    if (attr.visibility === 'private') return 'Private';
    if (attr.isStatic) return 'Static';
    return 'Public';
  }
}

// ===== SEQUENCE DIAGRAM CONVERTER =====

export class UMLSequenceDiagramToFunctionConverter {
  convert(sequence: UMLSequenceDiagram): BlueprintFunction {
    const func = blueprintGenerator.generateFunction(sequence.name, {
      displayName: sequence.name,
      description: `Generated from UML sequence diagram: ${sequence.name}`,
      category: 'Sequences',
    });

    // Create nodes for each message
    let yPos = 100;
    const nodeMap = new Map<string, string>();

    sequence.messages.forEach((message, index) => {
      const callNode = blueprintGenerator.generateFunctionCallNode(
        message.name,
        message.parameters?.map((p) => ({
          id: '',
          name: p,
          type: PinType.Object,
          direction: 'Input',
        })) || [],
        [],
        { x: 100 + index * 150, y: yPos }
      );

      func.nodes.push(callNode);
      nodeMap.set(`${message.from}->${message.to}`, callNode.id);
      yPos += 80;
    });

    // Create edges between messages
    const messageIds = Array.from(nodeMap.values());
    for (let i = 0; i < messageIds.length - 1; i++) {
      func.edges.push({
        id: `edge_${i}`,
        fromNodeId: messageIds[i],
        toNodeId: messageIds[i + 1],
        fromPinId: 'then',
        toPinId: 'execute',
      });
    }

    return func;
  }
}

// ===== STATE DIAGRAM CONVERTER =====

export class UMLStateDiagramToBlueprintConverter {
  convert(
    stateDiagram: UMLStateDiagram,
    characterName: string = 'Character'
  ): BlueprintClass {
    const blueprint = blueprintGenerator.generateBlueprint(
      `BP_StateMachine_${characterName}`,
      'Actor',
      BlueprintType.Actor,
      {
        category: 'State Machines',
        description: `State machine from UML: ${stateDiagram.name}`,
        tags: ['StateMachine', 'UML', 'Generated'],
      }
    );

    // Create state variables
    blueprint.variables.push(
      blueprintGenerator.generateVariable('CurrentState', PinType.String, {
        defaultValue: stateDiagram.initialState || 'Idle',
        bInstanceEditable: true,
        category: 'State',
      }),
      blueprintGenerator.generateVariable('PreviousState', PinType.String, {
        category: 'State',
      })
    );

    // Create event for each transition
    blueprint.events = stateDiagram.transitions.map((transition) =>
      blueprintGenerator.generateEvent(`On${transition.event}`, {
        displayName: `On ${transition.event}`,
        category: 'State Transitions',
      })
    );

    // Create state change function
    const stateChangeFunc = blueprintGenerator.generateFunction('ChangeState', {
      displayName: 'Change State',
      category: 'State Management',
      inputs: [
        {
          id: '',
          name: 'NewState',
          type: PinType.String,
          direction: 'Input',
        },
      ],
    });

    // Add switch statement for state transitions
    blueprint.functions.push(stateChangeFunc);

    return blueprint;
  }
}

// ===== ACTIVITY DIAGRAM CONVERTER =====

export class UMLActivityDiagramToFunctionConverter {
  convert(
    activities: { name: string; type: 'action' | 'decision' | 'merge' }[],
    transitions: { from: string; to: string; guard?: string }[]
  ): BlueprintFunction {
    const func = blueprintGenerator.generateFunction('ActivityFlow', {
      displayName: 'Activity Flow',
      category: 'Activities',
    });

    // Create nodes for each activity
    const nodeMap = new Map<string, string>();
    let yPos = 100;

    activities.forEach((activity, index) => {
      let node: BlueprintNode;

      if (activity.type === 'action') {
        node = blueprintGenerator.generateNode(NodeType.FunctionCall, {
          name: activity.name,
          position: { x: 100, y: yPos },
        });
      } else if (activity.type === 'decision') {
        node = blueprintGenerator.generateBranchNode({ x: 100, y: yPos });
      } else {
        node = blueprintGenerator.generateNode(NodeType.Sequence, {
          name: activity.name,
          position: { x: 100, y: yPos },
        });
      }

      func.nodes.push(node);
      nodeMap.set(activity.name, node.id);
      yPos += 100;
    });

    // Create edges based on transitions
    transitions.forEach((transition) => {
      const fromId = nodeMap.get(transition.from);
      const toId = nodeMap.get(transition.to);

      if (fromId && toId) {
        func.edges.push({
          id: `edge_${transition.from}_${transition.to}`,
          fromNodeId: fromId,
          toNodeId: toId,
          fromPinId: 'then',
          toPinId: 'execute',
        });
      }
    });

    return func;
  }
}

// ===== UNIFIED UML CONVERTER =====

export class UMLToBlueprintConverter {
  convertClass(umlClass: UMLClass, baseClass?: string): BlueprintClass {
    return new UMLClassToBlueprintConverter().convert(umlClass, baseClass);
  }

  convertSequence(sequence: UMLSequenceDiagram): BlueprintFunction {
    return new UMLSequenceDiagramToFunctionConverter().convert(sequence);
  }

  convertStateMachine(stateDiagram: UMLStateDiagram, characterName?: string): BlueprintClass {
    return new UMLStateDiagramToBlueprintConverter().convert(stateDiagram, characterName);
  }

  convertActivities(
    activities: { name: string; type: 'action' | 'decision' | 'merge' }[],
    transitions: { from: string; to: string; guard?: string }[]
  ): BlueprintFunction {
    return new UMLActivityDiagramToFunctionConverter().convert(activities, transitions);
  }

  /**
   * Parse PlantUML text format and convert to blueprint
   */
  parsePlantUML(plantUmlText: string): BlueprintClass | BlueprintFunction | null {
    // Simple PlantUML parser
    const lines = plantUmlText.split('\n').filter((line) => line.trim() && !line.startsWith("'"));

    // Detect diagram type
    if (plantUmlText.includes('@startuml')) {
      if (plantUmlText.includes('class') || plantUmlText.includes('actor')) {
        return this.parsePlantUMLClass(lines);
      } else if (plantUmlText.includes('participant') || plantUmlText.includes('->')) {
        return this.parsePlantUMLSequence(lines);
      } else if (plantUmlText.includes('state')) {
        return this.parsePlantUMLStateMachine(lines);
      }
    }

    return null;
  }

  private parsePlantUMLClass(lines: string[]): BlueprintClass | null {
    const umlClass: UMLClass = {
      name: 'GeneratedClass',
      attributes: [],
      methods: [],
      associations: [],
    };

    lines.forEach((line) => {
      if (line.includes('class ')) {
        const match = line.match(/class\s+(\w+)/);
        if (match) umlClass.name = match[1];
      } else if (line.includes('{')) {
        // Parse class body
        const match = line.match(/(\w+)\s*:\s*(\w+)/);
        if (match) {
          umlClass.attributes.push({
            name: match[1],
            type: match[2],
            visibility: 'public',
          });
        }
      } else if (line.includes('()')) {
        const match = line.match(/(\w+)\s*\(\)/);
        if (match) {
          umlClass.methods.push({
            name: match[1],
            visibility: 'public',
            returnType: 'void',
            parameters: [],
          });
        }
      }
    });

    return new UMLClassToBlueprintConverter().convert(umlClass);
  }

  private parsePlantUMLSequence(lines: string[]): BlueprintFunction | null {
    const messages: UMLMessage[] = [];
    let sequence = 0;

    lines.forEach((line) => {
      if (line.includes('->')) {
        const match = line.match(/(\w+)\s*->\s*(\w+)\s*:\s*(.+)/);
        if (match) {
          messages.push({
            from: match[1],
            to: match[2],
            name: match[3].trim(),
            sequence: sequence++,
            messageType: 'synchronous',
          });
        }
      }
    });

    const sequence_obj: UMLSequenceDiagram = {
      name: 'SequenceFlow',
      actors: [],
      messages,
      interactions: [],
    };

    return new UMLSequenceDiagramToFunctionConverter().convert(sequence_obj);
  }

  private parsePlantUMLStateMachine(lines: string[]): BlueprintClass | null {
    const states: UMLState[] = [];
    const transitions: UMLTransition[] = [];

    lines.forEach((line) => {
      if (line.includes('state ')) {
        const match = line.match(/state\s+(\w+)/);
        if (match) {
          states.push({
            name: match[1],
            type: 'simple',
          });
        }
      } else if (line.includes('-->')) {
        const match = line.match(/(\w+)\s*-->\s*(\w+)\s*:\s*(.+)?/);
        if (match) {
          transitions.push({
            from: match[1],
            to: match[2],
            event: match[3]?.trim() || 'Transition',
          });
        }
      }
    });

    return new UMLStateDiagramToBlueprintConverter().convert({
      name: 'StateMachine',
      states,
      transitions,
      initialState: states[0]?.name,
    });
  }
}

export const umlConverter = new UMLToBlueprintConverter();
