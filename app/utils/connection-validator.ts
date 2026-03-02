import { EditorNode } from '../types/editor';

export function canConnectPins(
  fromNode: EditorNode | undefined,
  fromPinId: string,
  toNode: EditorNode | undefined,
  toPinId: string
): boolean {
  if (!fromNode || !toNode) return false;

  // Can't connect to same node
  if (fromNode.id === toNode.id) return false;

  const fromPin = fromNode.pins.find((p) => p.id === fromPinId);
  const toPin = toNode.pins.find((p) => p.id === toPinId);

  if (!fromPin || !toPin) return false;

  // Output to Input only
  if (fromPin.type !== 'output' || toPin.type !== 'input') {
    return false;
  }

  // Check type compatibility
  const fromType = fromPin.dataType;
  const toType = toPin.dataType;

  // Exec pins can always connect
  if (fromType === 'exec' && toType === 'exec') {
    return true;
  }

  // Same type connections
  if (fromType === toType) {
    return true;
  }

  // Wildcard connections (if pin type is 'any')
  if (fromType === 'any' || toType === 'any') {
    return true;
  }

  // Number can implicitly cast to string
  if (fromType === 'number' && toType === 'string') {
    return true;
  }

  return false;
}

export function validateBlueprint(nodes: EditorNode[], edges: any[]): string[] {
  const errors: string[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  // Check for orphan nodes
  const connectedNodes = new Set<string>();
  edges.forEach((edge) => {
    connectedNodes.add(edge.fromNodeId);
    connectedNodes.add(edge.toNodeId);
  });

  nodes.forEach((node) => {
    if (!connectedNodes.has(node.id) && nodes.length > 1) {
      errors.push(`Node "${node.label}" is not connected to the blueprint`);
    }
  });

  // Check for invalid connections
  edges.forEach((edge) => {
    if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
      errors.push(`Edge references non-existent node`);
    }

    const fromNode = nodes.find((n) => n.id === edge.fromNodeId);
    const toNode = nodes.find((n) => n.id === edge.toNodeId);

    if (
      fromNode &&
      toNode &&
      !canConnectPins(fromNode, edge.fromPinId, toNode, edge.toPinId)
    ) {
      errors.push(
        `Incompatible pin types: ${fromNode.label} -> ${toNode.label}`
      );
    }
  });

  return errors;
}
