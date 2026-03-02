import { EditorNode, Edge } from '../types/editor';

export type ExportFormat = 'json' | 'csv' | 'svg' | 'yaml';

export interface ExportOptions {
  includeMetadata?: boolean;
  includeComments?: boolean;
  prettyPrint?: boolean;
  fileName?: string;
}

export function exportBlueprint(
  nodes: EditorNode[],
  edges: Edge[],
  format: ExportFormat,
  options: ExportOptions = {}
): string {
  const { includeMetadata = true, prettyPrint = true } = options;

  const blueprint = {
    metadata: includeMetadata
      ? {
          exportDate: new Date().toISOString(),
          nodeCount: nodes.length,
          edgeCount: edges.length,
          version: '1.0',
        }
      : undefined,
    nodes,
    edges,
  };

  switch (format) {
    case 'json':
      return prettyPrint
        ? JSON.stringify(blueprint, null, 2)
        : JSON.stringify(blueprint);
    case 'csv':
      return exportAsCSV(nodes, edges);
    case 'svg':
      return exportAsSVG(nodes, edges);
    case 'yaml':
      return exportAsYAML(blueprint);
    default:
      return JSON.stringify(blueprint);
  }
}

function exportAsCSV(nodes: EditorNode[], edges: Edge[]): string {
  const lines: string[] = [];

  // Nodes CSV
  lines.push('NODES');
  lines.push('ID,Label,Type,X,Y,Color,Pins');
  nodes.forEach((node) => {
    const row = [
      node.id,
      node.label,
      node.type,
      node.position.x,
      node.position.y,
      node.color || '',
      node.pins.length,
    ].join(',');
    lines.push(row);
  });

  lines.push('');
  lines.push('EDGES');
  lines.push('ID,FromNode,ToNode,FromPin,ToPin');
  edges.forEach((edge) => {
    const row = [
      edge.id,
      edge.fromNodeId,
      edge.toNodeId,
      edge.fromPinId,
      edge.toPinId,
    ].join(',');
    lines.push(row);
  });

  return lines.join('\n');
}

function exportAsSVG(nodes: EditorNode[], edges: Edge[]): string {
  const padding = 40;
  const nodeWidth = 160;
  const nodeHeight = 100;

  // Calculate bounds
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    maxX = Math.max(maxX, node.position.x + nodeWidth);
    minY = Math.min(minY, node.position.y);
    maxY = Math.max(maxY, node.position.y + nodeHeight);
  });

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<style>
    .node { fill: white; stroke: #333; stroke-width: 2; }
    .node-label { font-family: Arial; font-size: 12px; text-anchor: middle; }
    .edge { stroke: #666; stroke-width: 2; fill: none; }
  </style>`;

  // Draw edges
  edges.forEach((edge) => {
    const fromNode = nodes.find((n) => n.id === edge.fromNodeId);
    const toNode = nodes.find((n) => n.id === edge.toNodeId);
    if (!fromNode || !toNode) return;

    const x1 = fromNode.position.x - minX + padding + nodeWidth / 2;
    const y1 = fromNode.position.y - minY + padding + nodeHeight / 2;
    const x2 = toNode.position.x - minX + padding + nodeWidth / 2;
    const y2 = toNode.position.y - minY + padding + nodeHeight / 2;

    svg += `<path class="edge" d="M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2} ${x2} ${y2}" />`;
  });

  // Draw nodes
  nodes.forEach((node) => {
    const x = node.position.x - minX + padding;
    const y = node.position.y - minY + padding;

    svg += `<rect class="node" x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="8" />`;
    svg += `<text class="node-label" x="${x + nodeWidth / 2}" y="${y + nodeHeight / 2}">${node.label}</text>`;
  });

  svg += '</svg>';
  return svg;
}

function exportAsYAML(data: any, indent = 0): string {
  const spaces = ' '.repeat(indent);
  let yaml = '';

  if (Array.isArray(data)) {
    data.forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        yaml += `${spaces}- `;
        const itemYaml = exportAsYAML(item, indent + 2);
        yaml += itemYaml.trimStart() + '\n';
      } else {
        yaml += `${spaces}- ${item}\n`;
      }
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined) return;
      if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n`;
        yaml += exportAsYAML(value, indent + 2);
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    });
  } else {
    yaml += `${spaces}${data}\n`;
  }

  return yaml;
}
