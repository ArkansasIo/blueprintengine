import { EditorNode, Edge } from '../types/editor';

export type LayoutType = 'hierarchical' | 'circular' | 'grid' | 'force-directed' | 'tree';

export interface LayoutOptions {
  spacing: number;
  nodeWidth: number;
  nodeHeight: number;
}

const DEFAULT_OPTIONS: LayoutOptions = {
  spacing: 100,
  nodeWidth: 160,
  nodeHeight: 100,
};

export function applyLayout(
  nodes: EditorNode[],
  edges: Edge[],
  type: LayoutType,
  options: Partial<LayoutOptions> = {}
): EditorNode[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  switch (type) {
    case 'hierarchical':
      return applyHierarchicalLayout(nodes, edges, opts);
    case 'circular':
      return applyCircularLayout(nodes, opts);
    case 'grid':
      return applyGridLayout(nodes, opts);
    case 'force-directed':
      return applyForceDirectedLayout(nodes, edges, opts);
    case 'tree':
      return applyTreeLayout(nodes, edges, opts);
    default:
      return nodes;
  }
}

function applyHierarchicalLayout(
  nodes: EditorNode[],
  edges: Edge[],
  opts: LayoutOptions
): EditorNode[] {
  const levels: Map<string, number> = new Map();
  const visited = new Set<string>();

  // Assign levels to nodes
  const assignLevel = (nodeId: string, level: number): void => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    levels.set(nodeId, Math.max(levels.get(nodeId) || 0, level));

    const outgoing = edges.filter((e) => e.fromNodeId === nodeId);
    outgoing.forEach((e) => assignLevel(e.toNodeId, level + 1));
  };

  // Start from root nodes (no incoming edges)
  const rootNodes = nodes.filter(
    (n) => !edges.some((e) => e.toNodeId === n.id)
  );
  rootNodes.forEach((n) => assignLevel(n.id, 0));

  // Group nodes by level
  const levelGroups = new Map<number, EditorNode[]>();
  nodes.forEach((node) => {
    const level = levels.get(node.id) || 0;
    if (!levelGroups.has(level)) levelGroups.set(level, []);
    levelGroups.get(level)!.push(node);
  });

  // Position nodes
  const updated: EditorNode[] = [];
  const maxLevel = Math.max(...Array.from(levels.values()), 0);

  levelGroups.forEach((nodesInLevel, level) => {
    const x = level * opts.spacing;
    const totalHeight = nodesInLevel.length * (opts.nodeHeight + opts.spacing);
    const startY = -totalHeight / 2;

    nodesInLevel.forEach((node, idx) => {
      const y = startY + idx * (opts.nodeHeight + opts.spacing);
      updated.push({
        ...node,
        position: { x, y },
      });
    });
  });

  return updated;
}

function applyCircularLayout(
  nodes: EditorNode[],
  opts: LayoutOptions
): EditorNode[] {
  const radius = Math.max(150, (nodes.length * opts.spacing) / (2 * Math.PI));
  const angleSlice = (2 * Math.PI) / nodes.length;

  return nodes.map((node, idx) => {
    const angle = idx * angleSlice;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      ...node,
      position: { x, y },
    };
  });
}

function applyGridLayout(
  nodes: EditorNode[],
  opts: LayoutOptions
): EditorNode[] {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / cols);

  return nodes.map((node, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = col * opts.spacing;
    const y = row * opts.spacing;

    return {
      ...node,
      position: { x, y },
    };
  });
}

function applyForceDirectedLayout(
  nodes: EditorNode[],
  edges: Edge[],
  opts: LayoutOptions
): EditorNode[] {
  const iterations = 50;
  const repulsiveForce = 300;
  const attractiveForce = 0.1;
  const damping = 0.85;

  // Initialize velocities
  const velocities = new Map<string, { x: number; y: number }>(
    nodes.map((n) => [n.id, { x: 0, y: 0 }])
  );

  let updated = [...nodes];

  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => forces.set(n.id, { x: 0, y: 0 }));

    // Repulsive forces
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = updated[i];
        const n2 = updated[j];
        const dx = n2.position.x - n1.position.x;
        const dy = n2.position.y - n1.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const force = repulsiveForce / (dist * dist);

        const f1 = forces.get(n1.id)!;
        const f2 = forces.get(n2.id)!;
        f1.x -= (force * dx) / dist;
        f1.y -= (force * dy) / dist;
        f2.x += (force * dx) / dist;
        f2.y += (force * dy) / dist;
      }
    }

    // Attractive forces
    edges.forEach((edge) => {
      const from = updated.find((n) => n.id === edge.fromNodeId);
      const to = updated.find((n) => n.id === edge.toNodeId);
      if (!from || !to) return;

      const dx = to.position.x - from.position.x;
      const dy = to.position.y - from.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
      const force = attractiveForce * dist;

      const f1 = forces.get(from.id)!;
      const f2 = forces.get(to.id)!;
      f1.x += (force * dx) / dist;
      f1.y += (force * dy) / dist;
      f2.x -= (force * dx) / dist;
      f2.y -= (force * dy) / dist;
    });

    // Update positions
    updated = updated.map((node) => {
      const f = forces.get(node.id)!;
      const v = velocities.get(node.id)!;
      v.x = (v.x + f.x) * damping;
      v.y = (v.y + f.y) * damping;

      return {
        ...node,
        position: {
          x: node.position.x + v.x,
          y: node.position.y + v.y,
        },
      };
    });
  }

  return updated;
}

function applyTreeLayout(
  nodes: EditorNode[],
  edges: Edge[],
  opts: LayoutOptions
): EditorNode[] {
  const positions = new Map<string, { x: number; y: number }>();
  const visited = new Set<string>();

  const placeNode = (
    nodeId: string,
    x: number,
    y: number,
    depth: number
  ): number => {
    if (visited.has(nodeId)) return x;
    visited.add(nodeId);
    positions.set(nodeId, { x, y });

    const children = edges
      .filter((e) => e.fromNodeId === nodeId)
      .map((e) => e.toNodeId);

    const childSpacing = opts.spacing;
    let nextX = x - ((children.length - 1) * childSpacing) / 2;

    children.forEach((childId) => {
      const newY = y + opts.nodeHeight + opts.spacing;
      placeNode(childId, nextX, newY, depth + 1);
      nextX += childSpacing;
    });

    return nextX;
  };

  // Start from root nodes
  const rootNodes = nodes.filter(
    (n) => !edges.some((e) => e.toNodeId === n.id)
  );
  rootNodes.forEach((n, idx) => {
    placeNode(n.id, idx * opts.spacing * 2, 0, 0);
  });

  // Position remaining nodes
  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) || node.position,
  }));
}
