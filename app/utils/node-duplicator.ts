import { EditorNode } from '../types/editor';
import { nanoid } from './id-generator';

export function duplicateNode(node: EditorNode, offsetX = 50, offsetY = 50): EditorNode {
  return {
    ...node,
    id: nanoid(),
    position: {
      x: node.position.x + offsetX,
      y: node.position.y + offsetY,
    },
    pins: node.pins.map((pin) => ({
      ...pin,
      id: nanoid(),
    })),
  };
}

export function duplicateMultipleNodes(
  nodes: EditorNode[],
  nodeIds: string[],
  offsetX = 50,
  offsetY = 50
): { newNodes: EditorNode[]; idMap: Record<string, string> } {
  const idMap: Record<string, string> = {};
  const newNodes: EditorNode[] = [];

  nodes.forEach((node) => {
    if (nodeIds.includes(node.id)) {
      const duplicated = duplicateNode(node, offsetX, offsetY);
      idMap[node.id] = duplicated.id;
      newNodes.push(duplicated);
    }
  });

  return { newNodes, idMap };
}
