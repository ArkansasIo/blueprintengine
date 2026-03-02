import { EditorNode, Edge } from '../types/editor';

export interface ExecutionContext {
  visitedNodes: Set<string>;
  nodeOutputs: Record<string, any>;
  executionPath: string[];
  errors: string[];
}

export class GraphExecutor {
  private nodes: EditorNode[];
  private edges: Edge[];

  constructor(nodes: EditorNode[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  execute(startNodeId?: string): ExecutionContext {
    const context: ExecutionContext = {
      visitedNodes: new Set(),
      nodeOutputs: {},
      executionPath: [],
      errors: [],
    };

    // Find start node (first input node or specified node)
    const start = startNodeId
      ? this.nodes.find((n) => n.id === startNodeId)
      : this.nodes.find((n) => n.type === 'input');

    if (!start) {
      context.errors.push('No start node found');
      return context;
    }

    // Execute from start node
    this.executeNode(start.id, context);

    return context;
  }

  private executeNode(nodeId: string, context: ExecutionContext, depth = 0): void {
    // Prevent infinite loops
    if (depth > 100) {
      context.errors.push('Execution depth exceeded (circular reference?)');
      return;
    }

    if (context.visitedNodes.has(nodeId)) {
      return; // Already visited
    }

    context.visitedNodes.add(nodeId);
    context.executionPath.push(nodeId);

    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Execute node logic
    context.nodeOutputs[nodeId] = this.evaluateNode(node, context);

    // Find outgoing edges
    const outgoingEdges = this.edges.filter((e) => e.fromNodeId === nodeId);

    // Follow execution
    outgoingEdges.forEach((edge) => {
      this.executeNode(edge.toNodeId, context, depth + 1);
    });
  }

  private evaluateNode(node: EditorNode, context: ExecutionContext): any {
    switch (node.type) {
      case 'input':
        return {
          status: 'input',
          value: node.data?.defaultValue || null,
        };

      case 'logic':
        return {
          status: 'processed',
          result: this.applyLogic(node),
        };

      case 'condition':
        return {
          status: 'evaluated',
          condition: node.data?.condition || false,
        };

      case 'action':
        return {
          status: 'executed',
          action: node.label,
        };

      case 'output':
        return {
          status: 'output',
          value: context.nodeOutputs[node.id] || null,
        };

      default:
        return { status: 'unknown' };
    }
  }

  private applyLogic(node: EditorNode): any {
    const operation = node.data?.operation || 'pass';
    const value = node.data?.value || 0;

    switch (operation) {
      case 'increment':
        return value + 1;
      case 'decrement':
        return value - 1;
      case 'double':
        return value * 2;
      case 'negate':
        return -value;
      default:
        return value;
    }
  }

  validateGraph(): string[] {
    const errors: string[] = [];

    // Check for cycles using DFS
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoingEdges = this.edges.filter((e) => e.fromNodeId === nodeId);

      for (const edge of outgoingEdges) {
        if (!visited.has(edge.toNodeId)) {
          if (hasCycle(edge.toNodeId)) return true;
        } else if (recursionStack.has(edge.toNodeId)) {
          return true; // Cycle found
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) {
          errors.push(`Circular reference detected starting from ${node.label}`);
        }
      }
    }

    // Check for orphan nodes
    const connectedNodes = new Set<string>();
    this.edges.forEach((e) => {
      connectedNodes.add(e.fromNodeId);
      connectedNodes.add(e.toNodeId);
    });

    this.nodes.forEach((node) => {
      if (!connectedNodes.has(node.id) && this.nodes.length > 1) {
        errors.push(`Node "${node.label}" is disconnected`);
      }
    });

    return errors;
  }
}
