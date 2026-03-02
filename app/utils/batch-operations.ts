import { EditorNode, Pin } from '../types/editor';
import { nanoid } from './id-generator';

export interface BatchOperationResult {
  success: boolean;
  affectedNodes: number;
  message: string;
}

export function batchDeleteNodes(
  nodes: EditorNode[],
  nodeIds: string[]
): EditorNode[] {
  return nodes.filter((n) => !nodeIds.includes(n.id));
}

export function batchDuplicateNodes(
  nodes: EditorNode[],
  nodeIds: string[],
  offsetX: number = 50,
  offsetY: number = 50
): EditorNode[] {
  const nodesToDuplicate = nodes.filter((n) => nodeIds.includes(n.id));
  const duplicates = nodesToDuplicate.map((node) => ({
    ...JSON.parse(JSON.stringify(node)),
    id: nanoid(),
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY,
    },
  }));
  return [...nodes, ...duplicates];
}

export function batchUpdateNodeProperty(
  nodes: EditorNode[],
  nodeIds: string[],
  property: string,
  value: any
): EditorNode[] {
  return nodes.map((node) => {
    if (!nodeIds.includes(node.id)) return node;

    const updated = { ...node };
    if (property === 'color' || property === 'label') {
      (updated as any)[property] = value;
    } else if (property === 'data') {
      updated.data = { ...updated.data, ...value };
    }
    return updated;
  });
}

export function batchUpdateNodeColor(
  nodes: EditorNode[],
  nodeIds: string[],
  color: string
): EditorNode[] {
  return nodes.map((node) =>
    nodeIds.includes(node.id) ? { ...node, color } : node
  );
}

export function batchUpdateNodeLabel(
  nodes: EditorNode[],
  nodeIds: string[],
  prefix: string
): EditorNode[] {
  return nodes.map((node, idx) =>
    nodeIds.includes(node.id)
      ? { ...node, label: `${prefix}_${idx}` }
      : node
  );
}

export function batchGroupNodes(
  nodes: EditorNode[],
  nodeIds: string[],
  groupId: string
): EditorNode[] {
  return nodes.map((node) =>
    nodeIds.includes(node.id)
      ? { ...node, data: { ...node.data, groupId } }
      : node
  );
}

export function getNodesInGroup(
  nodes: EditorNode[],
  groupId: string
): EditorNode[] {
  return nodes.filter((n) => n.data?.groupId === groupId);
}

export function batchLockNodes(
  nodes: EditorNode[],
  nodeIds: string[],
  locked: boolean = true
): EditorNode[] {
  return nodes.map((node) =>
    nodeIds.includes(node.id)
      ? { ...node, data: { ...node.data, locked } }
      : node
  );
}

export function batchHideNodes(
  nodes: EditorNode[],
  nodeIds: string[],
  hidden: boolean = true
): EditorNode[] {
  return nodes.map((node) =>
    nodeIds.includes(node.id)
      ? { ...node, data: { ...node.data, hidden } }
      : node
  );
}

export function batchAddPinToNodes(
  nodes: EditorNode[],
  nodeIds: string[],
  pinType: 'input' | 'output',
  dataType: string = 'exec'
): EditorNode[] {
  return nodes.map((node) => {
    if (!nodeIds.includes(node.id)) return node;

    const newPin: Pin = {
      id: nanoid(),
      name: `${dataType}_${node.pins.length}`,
      type: dataType,
      direction: pinType,
    };

    return {
      ...node,
      pins: [...node.pins, newPin],
    };
  });
}
