import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { useEditorStore } from '@/app/stores/editor-store';

const SelectionIndicator: React.FC = () => {
  const { selectedNodes, nodes } = useEditorStore();

  const boundingBox = useMemo(() => {
    if (selectedNodes.length === 0) return null;

    const selectedNodeObjs = nodes.filter((n) => selectedNodes.includes(n.id));
    if (selectedNodeObjs.length === 0) return null;

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    selectedNodeObjs.forEach((node) => {
      minX = Math.min(minX, node.position.x);
      maxX = Math.max(maxX, node.position.x + 140);
      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y + 60);
    });

    return {
      x: minX - 4,
      y: minY - 4,
      width: maxX - minX + 8,
      height: maxY - minY + 8,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
    };
  }, [selectedNodes, nodes]);

  if (!boundingBox) return null;

  return (
    <View
      style={[
        styles.container,
        {
          left: boundingBox.x,
          top: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      ]}
    >
      {/* Bounding Box Border */}
      <View style={styles.boundingBox} />

      {/* Corner Handles */}
      <View style={[styles.handle, styles.topLeft]} />
      <View style={[styles.handle, styles.topRight]} />
      <View style={[styles.handle, styles.bottomLeft]} />
      <View style={[styles.handle, styles.bottomRight]} />

      {/* Selection Info */}
      {selectedNodes.length > 0 && (
        <View
          style={[
            styles.infoLabel,
            {
              left: boundingBox.centerX - 40,
              top: boundingBox.y - 24,
            },
          ]}
        >
          <Text style={styles.infoText}>
            {selectedNodes.length} selected
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    pointerEvents: 'none',
  },

  boundingBox: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: '#06b6d4',
    borderStyle: 'dashed',
    borderRadius: 2,
  },

  handle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#06b6d4',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 4,
  },

  topLeft: {
    top: -4,
    left: -4,
  },

  topRight: {
    top: -4,
    right: -4,
  },

  bottomLeft: {
    bottom: -4,
    left: -4,
  },

  bottomRight: {
    bottom: -4,
    right: -4,
  },

  infoLabel: {
    position: 'absolute',
    backgroundColor: '#06b6d4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },

  infoText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default SelectionIndicator;