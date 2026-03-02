import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useEditorStore } from '@/app/stores/editor-store';

const LiveConnectionRenderer: React.FC = () => {
  const { draggedConnection, nodes } = useEditorStore();

  const connectionPath = useMemo(() => {
    if (!draggedConnection) return null;

    const fromNode = nodes.find((n) => n.id === draggedConnection.fromNodeId);
    if (!fromNode) return null;

    const fromX = fromNode.position.x + 140;
    const fromY = fromNode.position.y + 30;
    const toX = draggedConnection.toPosition?.x || fromX;
    const toY = draggedConnection.toPosition?.y || fromY;

    return { fromX, fromY, toX, toY };
  }, [draggedConnection, nodes]);

  if (!connectionPath) return null;

  const { fromX, fromY, toX, toY } = connectionPath;
  const distance = Math.sqrt(
    Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2)
  );
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);

  return (
    <View
      style={[
        styles.container,
        {
          left: Math.min(fromX, toX),
          top: Math.min(fromY, toY),
          width: Math.abs(toX - fromX) + 20,
          height: Math.abs(toY - fromY) + 20,
        },
      ]}
    >
      <View
        style={[
          styles.connectionLine,
          {
            height: distance,
            transform: [{ rotate: `${angle}deg` }],
          },
        ]}
      />

      {/* Target Pin Preview */}
      {draggedConnection.toPosition && (
        <View
          style={[
            styles.targetPin,
            {
              left: toX - Math.min(fromX, toX) - 6,
              top: toY - Math.min(fromY, toY) - 6,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    pointerEvents: 'none',
  },

  connectionLine: {
    width: 2,
    backgroundColor: '#06b6d4',
    transformOrigin: '0 0',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },

  targetPin: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#06b6d4',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});

export default LiveConnectionRenderer;