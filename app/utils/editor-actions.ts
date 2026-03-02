import { EditorNode, Edge, NodePin } from '../types/editor';
import { nanoid } from './id-generator';

/**
 * Core Editor Actions - All fundamental operations for the blueprint editor
 */

export interface EditorAction {
  type: string;
  timestamp: number;
  payload: any;
}

// ===== NODE OPERATIONS =====

export function createNode(
  label: string,
  type: string,
  position: { x: number; y: number },
  color: string = '#3b82f6'
): EditorNode {
  const id = nanoid();
  const inPin: NodePin = {
    id: nanoid(),
    name: 'in',
    type: 'exec',
    direction: 'input',
  };
  const outPin: NodePin = {
    id: nanoid(),
    name: 'out',
    type: 'exec',
    direction: 'output',
  };

  return {
    id,
    label,
    type,
    position,
    color,
    pins: [inPin, outPin],
    data: {},
  };
}

export function duplicateNode(node: EditorNode, offset: { x: number; y: number }): EditorNode {
  return {
    ...node,
    id: nanoid(),
    position: {
      x: node.position.x + offset.x,
      y: node.position.y + offset.y,
    },
    pins: node.pins.map((pin) => ({
      ...pin,
      id: nanoid(),
    })),
  };
}

export function updateNodePosition(node: EditorNode, position: { x: number; y: number }): EditorNode {
  return {
    ...node,
    position,
  };
}

export function updateNodeLabel(node: EditorNode, label: string): EditorNode {
  return {
    ...node,
    label,
  };
}

export function updateNodeColor(node: EditorNode, color: string): EditorNode {
  return {
    ...node,
    color,
  };
}

export function updateNodeData(node: EditorNode, data: Record<string, any>): EditorNode {
  return {
    ...node,
    data: {
      ...node.data,
      ...data,
    },
  };
}

export function addPinToNode(node: EditorNode, pin: NodePin): EditorNode {
  return {
    ...node,
    pins: [...node.pins, pin],
  };
}

export function removePinFromNode(node: EditorNode, pinId: string): EditorNode {
  return {
    ...node,
    pins: node.pins.filter((p) => p.id !== pinId),
  };
}

// ===== EDGE OPERATIONS =====

export function createEdge(
  id: string,
  fromNodeId: string,
  toNodeId: string,
  fromPinId: string,
  toPinId: string
): Edge {
  return {
    id,
    fromNodeId,
    toNodeId,
    fromPinId,
    toPinId,
  };
}

export function validateEdge(
  fromNode: EditorNode,
  toNode: EditorNode,
  fromPin: NodePin,
  toPin: NodePin
): { valid: boolean; reason?: string } {
  // Prevent self-loops
  if (fromNode.id === toNode.id) {
    return { valid: false, reason: 'Cannot connect node to itself' };
  }

  // Validate pin directions
  if (fromPin.direction !== 'output') {
    return { valid: false, reason: 'Source pin must be an output' };
  }
  if (toPin.direction !== 'input') {
    return { valid: false, reason: 'Target pin must be an input' };
  }

  // Validate pin types match
  if (fromPin.type !== toPin.type) {
    return { valid: false, reason: 'Pin types do not match' };
  }

  return { valid: true };
}

// ===== SELECTION OPERATIONS =====

export function selectNode(nodes: EditorNode[], nodeId: string): EditorNode[] {
  return nodes.map((n) => ({
    ...n,
    selected: n.id === nodeId,
  }));
}

export function selectMultipleNodes(nodes: EditorNode[], nodeIds: string[]): EditorNode[] {
  const idSet = new Set(nodeIds);
  return nodes.map((n) => ({
    ...n,
    selected: idSet.has(n.id),
  }));
}

export function deselectAll(nodes: EditorNode[]): EditorNode[] {
  return nodes.map((n) => ({
    ...n,
    selected: false,
  }));
}

export function toggleNodeSelection(nodes: EditorNode[], nodeId: string): EditorNode[] {
  return nodes.map((n) => ({
    ...n,
    selected: n.id === nodeId ? !n.selected : n.selected,
  }));
}

// ===== ALIGNMENT OPERATIONS =====

export function alignNodesLeft(nodes: EditorNode[]): EditorNode[] {
  const minX = Math.min(...nodes.map((n) => n.position.x));
  return nodes.map((n) => ({
    ...n,
    position: { ...n.position, x: minX },
  }));
}

export function alignNodesRight(nodes: EditorNode[]): EditorNode[] {
  const maxX = Math.max(...nodes.map((n) => n.position.x));
  return nodes.map((n) => ({
    ...n,
    position: { ...n.position, x: maxX },
  }));
}

export function alignNodesTop(nodes: EditorNode[]): EditorNode[] {
  const minY = Math.min(...nodes.map((n) => n.position.y));
  return nodes.map((n) => ({
    ...n,
    position: { ...n.position, y: minY },
  }));
}

export function alignNodesBottom(nodes: EditorNode[]): EditorNode[] {
  const maxY = Math.max(...nodes.map((n) => n.position.y));
  return nodes.map((n) => ({
    ...n,
    position: { ...n.position, y: maxY },
  }));
}

export function alignNodesCenterHorizontal(nodes: EditorNode[]): EditorNode[] {
  const avgX = nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
  return nodes.map((n) => ({
    ...n,
    position: { ...n.position, x: avgX },
  }));
}

export function alignNodesCenterVertical(nodes: EditorNode[]): EditorNode[] {
  const avgY = nodes.reduce((sum, n) => sum + n.position.y, 0) / nodes.length;
  return nodes.map((n) => ({
    ...n,
    position: { ...n.position, y: avgY },
  }));
}

export function distributeNodesHorizontally(nodes: EditorNode[]): EditorNode[] {
  if (nodes.length <= 2) return nodes;

  const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x);
  const minX = sorted[0].position.x;
  const maxX = sorted[sorted.length - 1].position.x;
  const spacing = (maxX - minX) / (nodes.length - 1);

  return nodes.map((n) => {
    const idx = sorted.findIndex((s) => s.id === n.id);
    return {
      ...n,
      position: { ...n.position, x: minX + idx * spacing },
    };
  });
}

export function distributeNodesVertically(nodes: EditorNode[]): EditorNode[] {
  if (nodes.length <= 2) return nodes;

  const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);
  const minY = sorted[0].position.y;
  const maxY = sorted[sorted.length - 1].position.y;
  const spacing = (maxY - minY) / (nodes.length - 1);

  return nodes.map((n) => {
    const idx = sorted.findIndex((s) => s.id === n.id);
    return {
      ...n,
      position: { ...n.position, y: minY + idx * spacing },
    };
  });
}

// ===== BULK OPERATIONS =====

export function deleteNodes(nodes: EditorNode[], nodeIds: string[]): EditorNode[] {
  return nodes.filter((n) => !nodeIds.includes(n.id));
}

export function deleteEdges(edges: Edge[], edgeIds: string[]): Edge[] {
  return edges.filter((e) => !edgeIds.includes(e.id));
}

export function deleteNodesAndConnections(
  nodes: EditorNode[],
  edges: Edge[],
  nodeIds: string[]
): { nodes: EditorNode[]; edges: Edge[] } {
  const remainingNodes = deleteNodes(nodes, nodeIds);
  const nodeIdSet = new Set(nodeIds);
  const remainingEdges = edges.filter(
    (e) => !nodeIdSet.has(e.fromNodeId) && !nodeIdSet.has(e.toNodeId)
  );

  return { nodes: remainingNodes, edges: remainingEdges };
}

export function copyNodes(nodes: EditorNode[]): string {
  return JSON.stringify(nodes);
}

export function pasteNodes(nodes: EditorNode[], clipboard: string, offset: { x: number; y: number }): EditorNode[] {
  try {
    const copied = JSON.parse(clipboard) as EditorNode[];
    const pasted = copied.map((node) => duplicateNode(node, offset));
    return [...nodes, ...pasted];
  } catch {
    return nodes;
  }
}

// ===== ZOOM & PAN OPERATIONS =====

export interface CanvasTransform {
  scale: number;
  panX: number;
  panY: number;
}

export function zoomIn(transform: CanvasTransform, factor: number = 1.2): CanvasTransform {
  return {
    ...transform,
    scale: Math.min(transform.scale * factor, 5),
  };
}

export function zoomOut(transform: CanvasTransform, factor: number = 1.2): CanvasTransform {
  return {
    ...transform,
    scale: Math.max(transform.scale / factor, 0.1),
  };
}

export function resetZoom(transform: CanvasTransform): CanvasTransform {
  return {
    ...transform,
    scale: 1,
  };
}

export function pan(transform: CanvasTransform, deltaX: number, deltaY: number): CanvasTransform {
  return {
    ...transform,
    panX: transform.panX + deltaX,
    panY: transform.panY + deltaY,
  };
}

export function fitToScreen(nodes: EditorNode[], canvasWidth: number, canvasHeight: number): CanvasTransform {
  if (nodes.length === 0) {
    return { scale: 1, panX: 0, panY: 0 };
  }

  const minX = Math.min(...nodes.map((n) => n.position.x));
  const maxX = Math.max(...nodes.map((n) => n.position.x + 160));
  const minY = Math.min(...nodes.map((n) => n.position.y));
  const maxY = Math.max(...nodes.map((n) => n.position.y + 100));

  const graphWidth = maxX - minX;
  const graphHeight = maxY - minY;

  const scaleX = canvasWidth / graphWidth;
  const scaleY = canvasHeight / graphHeight;
  const scale = Math.min(scaleX, scaleY, 1) * 0.9;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    scale,
    panX: canvasWidth / 2 - centerX * scale,
    panY: canvasHeight / 2 - centerY * scale,
  };
}

// ===== GRID & SNAP OPERATIONS =====

export function snapToGrid(position: { x: number; y: number }, gridSize: number): { x: number; y: number } {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

export function snapNodesToGrid(nodes: EditorNode[], gridSize: number): EditorNode[] {
  return nodes.map((n) => ({
    ...n,
    position: snapToGrid(n.position, gridSize),
  }));
}

// ===== SEARCH & FILTER OPERATIONS =====

export function searchNodes(nodes: EditorNode[], query: string): EditorNode[] {
  const lowerQuery = query.toLowerCase();
  return nodes.filter(
    (n) =>
      n.label.toLowerCase().includes(lowerQuery) ||
      n.type.toLowerCase().includes(lowerQuery)
  );
}

export function filterNodesByType(nodes: EditorNode[], type: string): EditorNode[] {
  return nodes.filter((n) => n.type === type);
}

export function filterNodesByColor(nodes: EditorNode[], color: string): EditorNode[] {
  return nodes.filter((n) => n.color === color);
}

// ===== VALIDATION OPERATIONS =====

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateGraph(nodes: EditorNode[], edges: Edge[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for orphan nodes
  nodes.forEach((node) => {
    const hasIncoming = edges.some((e) => e.toNodeId === node.id);
    const hasOutgoing = edges.some((e) => e.fromNodeId === node.id);

    if (!hasIncoming && node.type !== 'Start' && nodes.length > 1) {
      warnings.push(`Node "${node.label}" has no incoming connections`);
    }
    if (!hasOutgoing && node.type !== 'End' && nodes.length > 1) {
      warnings.push(`Node "${node.label}" has no outgoing connections`);
    }
  });

  // Check for missing start/end nodes
  if (nodes.length > 0 && !nodes.some((n) => n.type === 'Start')) {
    errors.push('Graph must have at least one Start node');
  }
  if (nodes.length > 0 && !nodes.some((n) => n.type === 'End')) {
    errors.push('Graph must have at least one End node');
  }

  // Check for circular references
  const adjList = new Map<string, string[]>();
  nodes.forEach((n) => adjList.set(n.id, []));
  edges.forEach((e) => {
    adjList.get(e.fromNodeId)?.push(e.toNodeId);
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    for (const neighbor of adjList.get(nodeId) || []) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  for (const nodeId of adjList.keys()) {
    if (!visited.has(nodeId) && hasCycle(nodeId)) {
      errors.push('Graph contains circular references');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ===== EXPORT OPERATIONS =====

export function exportAsJSON(nodes: EditorNode[], edges: Edge[]): string {
  return JSON.stringify({ nodes, edges }, null, 2);
}

export function exportAsJSON_Compact(nodes: EditorNode[], edges: Edge[]): string {
  return JSON.stringify({ nodes, edges });
}

// ===== IMPORT OPERATIONS =====

export function importFromJSON(jsonString: string): { nodes: EditorNode[]; edges: Edge[] } | null {
  try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

// ===== UTILITY OPERATIONS =====

export function getNodeById(nodes: EditorNode[], id: string): EditorNode | undefined {
  return nodes.find((n) => n.id === id);
}

export function getEdgeById(edges: Edge[], id: string): Edge | undefined {
  return edges.find((e) => e.id === id);
}

export function getConnectedNodes(nodes: EditorNode[], edges: Edge[], nodeId: string): EditorNode[] {
  const connectedIds = new Set<string>();
  edges.forEach((e) => {
    if (e.fromNodeId === nodeId) connectedIds.add(e.toNodeId);
    if (e.toNodeId === nodeId) connectedIds.add(e.fromNodeId);
  });
  return nodes.filter((n) => connectedIds.has(n.id));
}

export function getIncomingEdges(edges: Edge[], nodeId: string): Edge[] {
  return edges.filter((e) => e.toNodeId === nodeId);
}

export function getOutgoingEdges(edges: Edge[], nodeId: string): Edge[] {
  return edges.filter((e) => e.fromNodeId === nodeId);
}

export function getGraphMetrics(nodes: EditorNode[], edges: Edge[]): Record<string, number> {
  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    density: nodes.length > 1 ? edges.length / (nodes.length * (nodes.length - 1) / 2) : 0,
    avgDegree: edges.length > 0 ? (2 * edges.length) / nodes.length : 0,
  };
}
