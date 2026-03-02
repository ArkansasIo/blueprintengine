import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Edge } from '../../app/types/editor';
import { useEditorStore } from '../../app/stores/editor-store';
import Svg, { Path } from 'react-native-svg';

interface Props {
  edge: Edge;
}

export default function EditorEdge({ edge }: Props) {
  const { nodes, selectEdge, deleteEdge, selectedEdgeId } = useEditorStore();

  const fromNode = nodes.find((n) => n.id === edge.fromNodeId);
  const toNode = nodes.find((n) => n.id === edge.toNodeId);

  if (!fromNode || !toNode) return null;

  const isSelected = selectedEdgeId === edge.id;

  // Calculate pin positions
  const fromX = fromNode.position.x + 160;
  const fromY = fromNode.position.y + 40;
  const toX = toNode.position.x;
  const toY = toNode.position.y + 40;

  // Bezier curve path
  const controlX = (fromX + toX) / 2;
  const pathD = `M ${fromX} ${fromY} C ${controlX} ${fromY} ${controlX} ${toY} ${toX} ${toY}`;

  return (
    <Pressable
      onPress={() => selectEdge(edge.id)}
      onLongPress={() => deleteEdge(edge.id)}
    >
      <Svg
        width="800"
        height="600"
        style={styles.svg}
        pointerEvents="none"
      >
        <Path
          d={pathD}
          stroke={isSelected ? '#fbbf24' : '#64748b'}
          strokeWidth={isSelected ? 3 : 2}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
});