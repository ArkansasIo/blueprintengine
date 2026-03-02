import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SaveExportButton() {
  const { nodes, edges } = useEditorStore();

  const exportAsJson = async () => {
    const blueprint = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(blueprint, null, 2);

    Alert.alert('Export Options', 'How would you like to export?', [
      {
        text: 'Copy to Clipboard',
        onPress: async () => {
          try {
            await Clipboard.setStringAsync(jsonString);
            Alert.alert('Success', 'Blueprint copied to clipboard!');
          } catch (error) {
            Alert.alert('Error', 'Failed to copy to clipboard');
          }
        },
      },
      {
        text: 'Share',
        onPress: async () => {
          try {
            await Share.share({
              message: jsonString,
              title: 'Blueprint Export',
            });
          } catch (error) {
            Alert.alert('Error', 'Failed to share');
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const hasContent = nodes.length > 0 || edges.length > 0;

  return (
    <Pressable
      style={[styles.button, !hasContent && styles.buttonDisabled]}
      onPress={exportAsJson}
      disabled={!hasContent}
    >
      <MaterialCommunityIcons name="download" size={20} color="#fff" />
      <Text style={styles.buttonText}>Export</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});
