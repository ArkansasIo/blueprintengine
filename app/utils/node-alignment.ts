import { EditorNode } from '../types/editor';

export type AlignmentType = 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v' | 'distribute-h' | 'distribute-v';

export function alignNodes(nodes: EditorNode[], selectedIds: string[], type: AlignmentType): EditorNode[] {
  if (selectedIds.length < 2) return nodes;

  const selectedNodes = nodes.filter((n) => selectedIds.includes(n.id));
  const nodeWidth = 160;
  const nodeHeight = 100;

  let minX = Math.min(...selectedNodes.map((n) => n.position.x));
  let maxX = Math.max(...selectedNodes.map((n) => n.position.x));
  let minY = Math.min(...selectedNodes.map((n) => n.position.y));
  let maxY = Math.max(...selectedNodes.map((n) => n.position.y));

  const updated = nodes.map((node) => {
    if (!selectedIds.includes(node.id)) return node;

    const newNode = { ...node };

    switch (type) {
      case 'left':
        newNode.position.x = minX;
        break;
      case 'right':
        newNode.position.x = maxX;
        break;
      case 'top':
        newNode.position.y = minY;
        break;
      case 'bottom':
        newNode.position.y = maxY;
        break;
      case 'center-h':
        newNode.position.x = (minX + maxX) / 2 - nodeWidth / 2;
        break;
      case 'center-v':
        newNode.position.y = (minY + maxY) / 2 - nodeHeight / 2;
        break;
    }

    return newNode;
  });

  // Handle distribution
  if (type === 'distribute-h' || type === 'distribute-v') {
    return distributeNodes(updated, selectedIds, type);
  }

  return updated;
}

function distributeNodes(
  nodes: EditorNode[],
  selectedIds: string[],
  type: 'distribute-h' | 'distribute-v'
): EditorNode[] {
  const selectedNodes = nodes.filter((n) => selectedIds.includes(n.id));
  const nodeWidth = 160;
  const nodeHeight = 100;

  if (type === 'distribute-h') {
    const sorted = [...selectedNodes].sort((a, b) => a.position.x - b.position.x);
    const minX = sorted[0].position.x;
    const maxX = sorted[sorted.length - 1].position.x;
    const totalSpacing = maxX - minX;
    const gap = totalSpacing / (sorted.length - 1);

    return nodes.map((node) => {
      const idx = sorted.findIndex((n) => n.id === node.id);
      if (idx === -1) return node;

      return {
        ...node,
        position: {
          ...node.position,
          x: minX + idx * gap,
        },
      };
    });
  } else {
    const sorted = [...selectedNodes].sort((a, b) => a.position.y - b.position.y);
    const minY = sorted[0].position.y;
    const maxY = sorted[sorted.length - 1].position.y;
    const totalSpacing = maxY - minY;
    const gap = totalSpacing / (sorted.length - 1);

    return nodes.map((node) => {
      const idx = sorted.findIndex((n) => n.id === node.id);
      if (idx === -1) return node;

      return {
        ...node,
        position: {
          ...node.position,
          y: minY + idx * gap,
        },
      };
    });
  }
}
