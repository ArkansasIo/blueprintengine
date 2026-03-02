import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';

interface EdgeRendererProps {
  selectedEdgeId?: string;
  onEdgePress?: (edgeId: string) => void;
  onEdgeDelete?: (edgeId: string) => void;
}

/**
 * Calculate Bezier curve points for smooth connections
 */
const calculateBezierPath = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): string => {
  const distance = Math.abs(toX - fromX) / 2;
  const cpX1 = fromX + distance;
  const cpX2 = toX - distance;

  return `M ${fromX} ${fromY} C ${cpX1} ${fromY}, ${cpX2} ${toY}, ${toX} ${toY}`;
};

const EdgeRenderer: React.FC<EdgeRendererProps> = ({
  selectedEdgeId,
  onEdgePress,
  onEdgeDelete,
}) => {
  const { edges, nodes } = useEditorStore();

  // Create a map of nodes by ID for quick lookup
  const nodeMap = useMemo(() => {
    const map: Record<string, any> = {};
    nodes.forEach((node) => {
      map[node.id] = node;
    });
    return map;
  }, [nodes]);

  return (
    <View style={styles.container}>
      {edges.map((edge) => {
        const fromNode = nodeMap[edge.fromNodeId];
        const toNode = nodeMap[edge.toNodeId];

        if (!fromNode || !toNode) return null;

        const isSelected = edge.id === selectedEdgeId;
        const fromX = fromNode.position.x + 120;
        const fromY = fromNode.position.y + 30;
        const toX = toNode.position.x;
        const toY = toNode.position.y + 30;

        const distance = Math.sqrt(
          Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2)
        );
        const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

        return (
          <Pressable
            key={edge.id}
            style={[
              styles.edgeContainer,
              {
                top: Math.min(fromY, toY),
                left: Math.min(fromX, toX),
                width: Math.abs(toX - fromX) + 20,
                height: Math.abs(toY - fromY) + 20,
              },
              isSelected && styles.edgeSelected,
            ]}
            onPress={() => onEdgePress?.(edge.id)}
          >
            <View
              style={[
                styles.connectionLine,
                {
                  height: distance,
                  transform: [{ rotate: `${angle}deg` }],
                  borderColor: isSelected ? '#fbbf24' : '#3b82f6',
                },
              ]}
            />

            {isSelected && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => onEdgeDelete?.(edge.id)}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color="#ef4444"
                />
              </Pressable>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },

  edgeContainer: {
    position: 'absolute',
    pointerEvents: 'auto',
  },

  connectionLine: {
    position: 'absolute',
    width: 2,
    borderTopWidth: 2,
    borderColor: '#3b82f6',
    transformOrigin: '0 0',
  },

  edgeSelected: {
    zIndex: 100,
  },

  deleteButton: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    zIndex: 10,
  },
});

export default EdgeRenderer;