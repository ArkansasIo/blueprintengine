import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHistoryStore } from '@/app/stores/history-store';

const UndoRedoControls: React.FC = () => {
  const { canUndo, canRedo, undo, redo } = useHistoryStore();

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, !canUndo && styles.buttonDisabled]}
        onPress={handleUndo}
        disabled={!canUndo}
      >
        <MaterialCommunityIcons
          name="undo"
          size={16}
          color={canUndo ? '#06b6d4' : '#475569'}
        />
        <Text style={[styles.text, !canUndo && styles.textDisabled]}>
          Undo
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, !canRedo && styles.buttonDisabled]}
        onPress={handleRedo}
        disabled={!canRedo}
      >
        <MaterialCommunityIcons
          name="redo"
          size={16}
          color={canRedo ? '#06b6d4' : '#475569'}
        />
        <Text style={[styles.text, !canRedo && styles.textDisabled]}>
          Redo
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  text: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '500',
  },

  textDisabled: {
    color: '#475569',
  },
});

export default UndoRedoControls;