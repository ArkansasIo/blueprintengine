import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';

const CanvasControls: React.FC = () => {
  const { zoom, setZoom, pan, setPan, nodes } = useEditorStore();

  const handleZoomIn = useCallback(() => {
    setZoom(Math.min((zoom || 1) + 0.1, 3));
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(Math.max((zoom || 1) - 0.1, 0.5));
  }, [zoom, setZoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  const handleZoomFit = useCallback(() => {
    // Calculate bounds to fit all nodes
    if (nodes.length === 0) return;

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    nodes.forEach((node) => {
      minX = Math.min(minX, node.position.x);
      maxX = Math.max(maxX, node.position.x + 140);
      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y + 60);
    });

    const width = maxX - minX + 40;
    const height = maxY - minY + 40;

    // Calculate zoom to fit
    const zoomX = window.innerWidth / width;
    const zoomY = window.innerHeight / height;
    const newZoom = Math.min(zoomX, zoomY, 1.5);

    setZoom(newZoom);
    setPan({
      x: window.innerWidth / 2 - (minX + width / 2) * newZoom,
      y: window.innerHeight / 2 - (minY + height / 2) * newZoom,
    });
  }, [nodes, setZoom, setPan]);

  const zoomPercent = Math.round((zoom || 1) * 100);

  return (
    <View style={styles.container}>
      {/* Zoom Controls */}
      <View style={styles.section}>
        <Pressable
          style={styles.button}
          onPress={handleZoomOut}
          disabled={(zoom || 1) <= 0.5}
        >
          <MaterialCommunityIcons
            name="minus"
            size={14}
            color={(zoom || 1) <= 0.5 ? '#475569' : '#cbd5e1'}
          />
        </Pressable>

        <View style={styles.zoomDisplay}>
          <Text style={styles.zoomText}>{zoomPercent}%</Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={handleZoomIn}
          disabled={(zoom || 1) >= 3}
        >
          <MaterialCommunityIcons
            name="plus"
            size={14}
            color={(zoom || 1) >= 3 ? '#475569' : '#cbd5e1'}
          />
        </Pressable>
      </View>

      {/* View Controls */}
      <View style={styles.divider} />

      <View style={styles.section}>
        <Pressable style={styles.button} onPress={handleZoomReset}>
          <MaterialCommunityIcons name="refresh" size={14} color="#cbd5e1" />
        </Pressable>

        <Pressable style={styles.button} onPress={handleZoomFit}>
          <MaterialCommunityIcons name="fit-to-screen" size={14} color="#cbd5e1" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 100,
  },

  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 4,
  },

  button: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },

  zoomDisplay: {
    paddingHorizontal: 8,
    minWidth: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  zoomText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#334155',
  },
});

export default CanvasControls;