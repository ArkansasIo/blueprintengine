import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';

const ConnectionHints: React.FC = () => {
  const { selectedNodes, nodes } = useEditorStore();

  const hints = useMemo(() => {
    if (selectedNodes.length === 0) {
      return [
        '💡 Click nodes to select them',
        '🔗 Drag from pins to create connections',
        '🗑️ Press Delete to remove selected',
      ];
    }

    if (selectedNodes.length === 1) {
      return [
        '➕ Hold Shift+Click to multi-select',
        '🔄 Press D to duplicate',
        '🔌 Connect pins for data flow',
      ];
    }

    return [
      `✓ ${selectedNodes.length} nodes selected`,
      '🔄 Press D to duplicate all',
      '🗑️ Press Delete to remove all',
    ];
  }, [selectedNodes]);

  return (
    <View style={styles.container}>
      {hints.map((hint, idx) => (
        <View key={idx} style={styles.hintItem}>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: 300,
    zIndex: 100,
  },

  hintItem: {
    marginVertical: 2,
  },
  hintText: {
    fontSize: 11,
    color: '#cbd5e1',
    lineHeight: 16,
  },
});

export default ConnectionHints;