import { EditorNode, Edge } from '../types/editor';
import { nanoid } from './id-generator';

export interface NodeGroup {
  id: string;
  name: string;
  nodeIds: string[];
  position: { x: number; y: number };
  color: string;
}

export function createNodeGroup(
  nodes: EditorNode[],
  nodeIds: string[],
  name: string = 'Group'
): NodeGroup {
  const selectedNodes = nodes.filter((n) => nodeIds.includes(n.id));
  
  if (selectedNodes.length === 0) {
    throw new Error('No nodes to group');
  }

  // Calculate group bounds
  const xs = selectedNodes.map((n) => n.position.x);
  const ys = selectedNodes.map((n) => n.position.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  return {
    id: nanoid(),
    name,
    nodeIds,
    position: { x: minX - 20, y: minY - 30 },
    color: '#8b5cf6',
  };
}

export function getGroupNodes(
  nodes: EditorNode[],
  group: NodeGroup
): EditorNode[] {
  return nodes.filter((n) => group.nodeIds.includes(n.id));
}

export function getGroupBounds(
  nodes: EditorNode[],
  group: NodeGroup
): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } {
  const groupNodes = getGroupNodes(nodes, group);
  
  if (groupNodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  const xs = groupNodes.map((n) => n.position.x);
  const ys = groupNodes.map((n) => n.position.y);
  
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs, ...xs.map((x) => x + 160)); // Rough node width
  const maxY = Math.max(...ys, ...ys.map((y) => y + 100)); // Rough node height

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 40,
    height: maxY - minY + 60,
  };
}

export function getInternalEdges(edges: Edge[], group: NodeGroup): Edge[] {
  const nodeSet = new Set(group.nodeIds);
  return edges.filter(
    (e) => nodeSet.has(e.fromNodeId) && nodeSet.has(e.toNodeId)
  );
}

export function getExternalEdges(edges: Edge[], group: NodeGroup): Edge[] {
  const nodeSet = new Set(group.nodeIds);
  return edges.filter(
    (e) =>
      (nodeSet.has(e.fromNodeId) && !nodeSet.has(e.toNodeId)) ||
      (!nodeSet.has(e.fromNodeId) && nodeSet.has(e.toNodeId))
  );
}
