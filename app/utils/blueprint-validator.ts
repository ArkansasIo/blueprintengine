import { Blueprint, EditorNode, Edge } from '../types/editor';

export interface ValidationError {
  type: 'orphan-node' | 'disconnected-pin' | 'invalid-connection' | 'circular-ref';
  nodeId: string;
  message: string;
}

export interface ExecutionContext {
  nodeOutputs: Record<string, any>;
  visitedNodes: Set<string>;
  maxIterations: number;
}

// Validate blueprint structure
export function validateBlueprint(blueprint: Blueprint): ValidationError[] {
  const errors: ValidationError[] = [];
  const nodeIds = new Set(blueprint.nodes.map((n) => n.id));
  const connectedNodes = new Set<string>();

  // Check for orphan edges
  blueprint.edges.forEach((edge) => {
    if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
      errors.push({
        type: 'invalid-connection',
        nodeId: edge.fromNodeId,
        message: `Invalid connection: node not found`,
      });
    } else {
      connectedNodes.add(edge.fromNodeId);
      connectedNodes.add(edge.toNodeId);
    }
  });

  // Check for disconnected nodes
  blueprint.nodes.forEach((node) => {
    if (node.type !== 'input' && !connectedNodes.has(node.id)) {
      errors.push({
        type: 'orphan-node',
        nodeId: node.id,
        message: `Node "${node.label}" is not connected`,
      });
    }
  });

  // Check for circular references (simple DFS)
  blueprint.nodes.forEach((node) => {
    if (hasCircularRef(node.id, blueprint)) {
      errors.push({
        type: 'circular-ref',
        nodeId: node.id,
        message: `Circular reference detected at "${node.label}"`,
      });
    }
  });

  return errors;
}

// Check if node has circular reference
function hasCircularRef(nodeId: string, blueprint: Blueprint): boolean {
  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(id: string): boolean {
    if (stack.has(id)) return true;
    if (visited.has(id)) return false;

    visited.add(id);
    stack.add(id);

    const childNodes = blueprint.edges
      .filter((e) => e.fromNodeId === id)
      .map((e) => e.toNodeId);

    for (const child of childNodes) {
      if (dfs(child)) return true;
    }

    stack.delete(id);
    return false;
  }

  return dfs(nodeId);
}

// Execute blueprint (simple simulation)
export function executeBlueprint(
  blueprint: Blueprint,
  startNodeId?: string
): ExecutionContext {
  const context: ExecutionContext = {
    nodeOutputs: {},
    visitedNodes: new Set(),
    maxIterations: 1000,
  };

  const inputNodes = blueprint.nodes.filter((n) => n.type === 'input');
  const entryPoint = startNodeId || inputNodes[0]?.id;

  if (!entryPoint) {
    console.warn('No entry point found in blueprint');
    return context;
  }

  let iterations = 0;
  let currentNodeId: string | null = entryPoint;

  while (currentNodeId && iterations < context.maxIterations) {
    const node = blueprint.nodes.find((n) => n.id === currentNodeId);
    if (!node) break;

    context.visitedNodes.add(currentNodeId);
    executeNode(node, blueprint, context);

    // Find next node
    const outgoingEdge = blueprint.edges.find(
      (e) => e.fromNodeId === currentNodeId && e.fromPinId === 'out'
    );
    currentNodeId = outgoingEdge ? outgoingEdge.toNodeId : null;

    iterations++;
  }

  return context;
}

// Simulate execution of a single node
function executeNode(
  node: EditorNode,
  blueprint: Blueprint,
  context: ExecutionContext
): void {
  const inputs: Record<string, any> = {};

  // Collect inputs from connected edges
  blueprint.edges.forEach((edge) => {
    if (edge.toNodeId === node.id) {
      const fromNode = blueprint.nodes.find((n) => n.id === edge.fromNodeId);
      const fromPinId = edge.fromPinId;
      if (fromNode && context.nodeOutputs[fromNode.id]) {
        inputs[edge.toPinId] = context.nodeOutputs[fromNode.id][fromPinId];
      }
    }
  });

  // Execute node logic based on type
  const output: Record<string, any> = {};

  switch (node.data?.nodeType || node.type) {
    case 'calculate-damage': {
      const attack = inputs.attack || 10;
      const defense = inputs.defense || 5;
      output.damage = Math.max(1, attack - defense * 0.5);
      output.out = 'done';
      break;
    }
    case 'delay': {
      output.out = 'done';
      break;
    }
    case 'branch': {
      output['out-true'] = inputs.condition ? 'done' : null;
      output['out-false'] = !inputs.condition ? 'done' : null;
      break;
    }
    default:
      output.out = 'done';
  }

  context.nodeOutputs[node.id] = output;
}

// Get blueprint execution report
export function getBlueprintReport(blueprint: Blueprint) {
  const errors = validateBlueprint(blueprint);
  const context = errors.length === 0 ? executeBlueprint(blueprint) : null;

  return {
    valid: errors.length === 0,
    errors,
    nodeCount: blueprint.nodes.length,
    edgeCount: blueprint.edges.length,
    executionVisited: context?.visitedNodes.size || 0,
    executionOutput: context?.nodeOutputs || {},
  };
}