import { EditorNode, Edge } from '../types/editor';

export interface NodeSuggestion {
  id: string;
  type: string;
  label: string;
  description: string;
  reason: string;
  confidence: number;
  icon: string;
  color: string;
}

export function suggestNodesForContext(
  nodes: EditorNode[],
  edges: Edge[],
  selectedNodeId: string | null
): NodeSuggestion[] {
  const suggestions: NodeSuggestion[] = [];

  if (!selectedNodeId) return suggestions;

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) return suggestions;

  // Analyze outgoing connections
  const outgoing = edges.filter((e) => e.fromNodeId === selectedNodeId);
  const incoming = edges.filter((e) => e.toNodeId === selectedNodeId);

  // Suggest complementary nodes based on type
  const nodeTypes = new Map<string, number>();
  nodes.forEach((n) => {
    nodeTypes.set(n.type, (nodeTypes.get(n.type) || 0) + 1);
  });

  // Missing process nodes
  if (selectedNode.type === 'Start' && outgoing.length === 0) {
    suggestions.push({
      id: 'suggest_process_1',
      type: 'Process',
      label: 'Process',
      description: 'Add a processing step',
      reason: 'Start nodes typically connect to process nodes',
      confidence: 0.9,
      icon: 'cog',
      color: '#3b82f6',
    });
  }

  // Missing decision nodes
  if ((selectedNode.type === 'Process' || selectedNode.type === 'Start') && outgoing.length <= 1) {
    suggestions.push({
      id: 'suggest_decision_1',
      type: 'Decision',
      label: 'Decision',
      description: 'Add a branching logic node',
      reason: 'Processes often lead to decision points',
      confidence: 0.75,
      icon: 'diamond-outline',
      color: '#f59e0b',
    });
  }

  // Missing end nodes
  const endNodeCount = nodes.filter((n) => n.type === 'End').length;
  const processNodeCount = nodes.filter((n) => n.type !== 'End' && n.type !== 'Start').length;
  if (endNodeCount === 0 && processNodeCount > 0) {
    suggestions.push({
      id: 'suggest_end_1',
      type: 'End',
      label: 'End',
      description: 'Terminate the flow',
      reason: 'Graph needs an end node',
      confidence: 0.95,
      icon: 'stop-circle-outline',
      color: '#ef4444',
    });
  }

  // Missing success handler
  if (selectedNode.type === 'Process' && !nodes.some((n) => n.type === 'Success')) {
    suggestions.push({
      id: 'suggest_success_1',
      type: 'Success',
      label: 'Success Handler',
      description: 'Handle successful completion',
      reason: 'Process nodes often need success handlers',
      confidence: 0.7,
      icon: 'check-circle-outline',
      color: '#10b981',
    });
  }

  // Missing error handler
  if (selectedNode.type === 'Process' && !nodes.some((n) => n.type === 'Error')) {
    suggestions.push({
      id: 'suggest_error_1',
      type: 'Error',
      label: 'Error Handler',
      description: 'Handle error cases',
      reason: 'Process nodes should have error handlers',
      confidence: 0.65,
      icon: 'alert-circle-outline',
      color: '#ef4444',
    });
  }

  // Suggest parallel nodes
  if (selectedNode.type === 'Process' && outgoing.length > 1) {
    suggestions.push({
      id: 'suggest_merge_1',
      type: 'Merge',
      label: 'Merge',
      description: 'Combine parallel branches',
      reason: 'Multiple outgoing edges suggest parallel execution',
      confidence: 0.8,
      icon: 'call-merge',
      color: '#8b5cf6',
    });
  }

  // Suggest data validation
  if (incoming.length > 0 && selectedNode.type !== 'Validation') {
    suggestions.push({
      id: 'suggest_validation_1',
      type: 'Validation',
      label: 'Validation',
      description: 'Validate input data',
      reason: 'Incoming data should be validated',
      confidence: 0.6,
      icon: 'shield-check-outline',
      color: '#06b6d4',
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

export function suggestConnectionsForNode(
  nodes: EditorNode[],
  edges: Edge[],
  nodeId: string
): { targetNodeId: string; reason: string; confidence: number }[] {
  const suggestions: {
    targetNodeId: string;
    reason: string;
    confidence: number;
  }[] = [];

  const sourceNode = nodes.find((n) => n.id === nodeId);
  if (!sourceNode) return suggestions;

  // Already connected nodes
  const connectedIds = new Set(edges.filter((e) => e.fromNodeId === nodeId).map((e) => e.toNodeId));

  nodes.forEach((targetNode) => {
    if (targetNode.id === nodeId || connectedIds.has(targetNode.id)) return;

    let confidence = 0;
    let reason = '';

    // Type-based suggestions
    if (
      (sourceNode.type === 'Start' && targetNode.type === 'Process') ||
      (sourceNode.type === 'Process' && targetNode.type === 'Decision')
    ) {
      confidence = 0.9;
      reason = 'Natural flow progression';
    } else if (
      (sourceNode.type === 'Decision' && targetNode.type === 'Process') ||
      (sourceNode.type === 'Process' && targetNode.type === 'Success')
    ) {
      confidence = 0.8;
      reason = 'Logical next step';
    } else if (
      sourceNode.type === 'Decision' ||
      sourceNode.type === 'Process'
    ) {
      confidence = 0.5;
      reason = 'Possible connection';
    }

    if (confidence > 0.4) {
      suggestions.push({
        targetNodeId: targetNode.id,
        reason,
        confidence,
      });
    }
  });

  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

export function detectPatternAnomalies(
  nodes: EditorNode[],
  edges: Edge[]
): { nodeId: string; issue: string; severity: 'low' | 'medium' | 'high' }[] {
  const issues: {
    nodeId: string;
    issue: string;
    severity: 'low' | 'medium' | 'high';
  }[] = [];

  // Check for orphan nodes
  nodes.forEach((node) => {
    const hasIncoming = edges.some((e) => e.toNodeId === node.id);
    const hasOutgoing = edges.some((e) => e.fromNodeId === node.id);
    const isStart = node.type === 'Start';
    const isEnd = node.type === 'End';

    if (!hasIncoming && !isStart && nodes.length > 1) {
      issues.push({
        nodeId: node.id,
        issue: 'Orphaned node - no incoming connections',
        severity: 'high',
      });
    }

    if (!hasOutgoing && !isEnd && nodes.length > 1) {
      issues.push({
        nodeId: node.id,
        issue: 'Dead end node - no outgoing connections',
        severity: 'medium',
      });
    }
  });

  // Check for missing start/end
  if (!nodes.some((n) => n.type === 'Start') && nodes.length > 0) {
    issues.push({
      nodeId: '',
      issue: 'No start node in graph',
      severity: 'high',
    });
  }

  if (!nodes.some((n) => n.type === 'End') && nodes.length > 0) {
    issues.push({
      nodeId: '',
      issue: 'No end node in graph',
      severity: 'high',
    });
  }

  // Check for duplicate types
  const typeCount = new Map<string, number>();
  nodes.forEach((n) => {
    typeCount.set(n.type, (typeCount.get(n.type) || 0) + 1);
  });

  typeCount.forEach((count, type) => {
    if (count > 5 && (type === 'Process' || type === 'Decision')) {
      issues.push({
        nodeId: '',
        issue: `Too many ${type} nodes (${count})`,
        severity: 'low',
      });
    }
  });

  return issues;
}
