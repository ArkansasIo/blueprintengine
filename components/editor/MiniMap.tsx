import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';

const MINIMAP_WIDTH = 120;
const MINIMAP_HEIGHT = 160;
const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 2000;

export default function MiniMap() {
  const { nodes, setPan, pan, zoom } = useEditorStore();
  const screen = Dimensions.get('window');

  if (nodes.length === 0) return null;

  // Calculate bounds
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  nodes.forEach((node) => {
    minX = Math.min(minX, node.position.x);
    maxX = Math.max(maxX, node.position.x + 160);
    minY = Math.min(minY, node.position.y);
    maxY = Math.max(maxY, node.position.y + 80);
  });

  const width = maxX - minX || 200;
  const height = maxY - minY || 200;
  const scaleX = MINIMAP_WIDTH / width;
  const scaleY = MINIMAP_HEIGHT / height;
  const scale = Math.min(scaleX, scaleY);

  return (
    <View style={styles.container}>
      {/* MiniMap Background */}
      <View style={styles.minimap}>
        {/* Node indicators */}
        {nodes.map((node) => (
          <View
            key={node.id}
            style={[
              styles.miniNode,
              {
                left: (node.position.x - minX) * scale,
                top: (node.position.y - minY) * scale,
                width: 10 * scale,
                height: 8 * scale,
                backgroundColor: getNodeColor(node.type),
              },
            ]}
          />
        ))}

        {/* Viewport indicator */}
        <Pressable
          style={[
            styles.viewport,
            {
              left: (-pan.x / zoom) * scale,
              top: (-pan.y / zoom) * scale,
              width: (screen.width / zoom) * scale,
              height: (screen.height / zoom) * scale,
            },
          ]}
          onPress={(evt) => {
            const x = evt.nativeEvent.locationX;
            const y = evt.nativeEvent.locationY;
            const newX = (x / scale + minX - screen.width / 2 / zoom) * -zoom;
            const newY = (y / scale + minY - screen.height / 2 / zoom) * -zoom;
            setPan({ x: newX, y: newY });
          }}
        />
      </View>
    </View>
  );
}

function getNodeColor(type: string): string {
  switch (type) {
    case 'input':
      return '#3b82f6';
    case 'output':
      return '#10b981';
    case 'logic':
      return '#f59e0b';
    case 'condition':
      return '#ef4444';
    case 'action':
      return '#8b5cf6';
    default:
      return '#64748b';
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 100,
  },
  minimap: {
    width: MINIMAP_WIDTH,
    height: MINIMAP_HEIGHT,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
  },
  miniNode: {
    position: 'absolute',
    borderRadius: 2,
  },
  viewport: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
});
