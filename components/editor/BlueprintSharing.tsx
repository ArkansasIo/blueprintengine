import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function BlueprintSharing() {
  const [visible, setVisible] = useState(false);
  const [shareText, setShareText] = useState('');
  const [blueprintName, setBlueprintName] = useState('My Blueprint');
  const { nodes, edges } = useEditorStore();

  const generateBlueprintJson = () => {
    const blueprint = {
      name: blueprintName,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(blueprint, null, 2);
  };

  const handleExport = () => {
    const json = generateBlueprintJson();
    setShareText(json);
  };

  const handleCopyToClipboard = async () => {
    try {
      const json = generateBlueprintJson();
      await Clipboard.setStringAsync(json);
      Alert.alert('Copied', 'Blueprint copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleImportFromText = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      const blueprint = JSON.parse(text);
      
      if (blueprint.nodes && blueprint.edges) {
        Alert.alert(
          'Import Blueprint',
          `Load "${blueprint.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Import',
              onPress: () => {
                const { loadBlueprint } = useEditorStore.getState();
                loadBlueprint(blueprint);
                setVisible(false);
                Alert.alert('Success', 'Blueprint imported');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Invalid blueprint format');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid JSON in clipboard');
    }
  };

  const hasNodes = nodes.length > 0;

  return (
    <>
      <Pressable
        style={[styles.button, !hasNodes && styles.buttonDisabled]}
        onPress={() => {
          handleExport();
          setVisible(true);
        }}
        disabled={!hasNodes}
      >
        <MaterialCommunityIcons name="share-variant" size={20} color="#fff" />
        <Text style={styles.buttonText}>Share</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share Blueprint</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Blueprint Name */}
            <View style={styles.section}>
              <Text style={styles.label}>Blueprint Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter blueprint name"
                placeholderTextColor="#64748b"
                value={blueprintName}
                onChangeText={setBlueprintName}
              />
            </View>

            {/* Export Options */}
            <View style={styles.section}>
              <Text style={styles.label}>Export Options</Text>
              <Pressable
                style={styles.optionButton}
                onPress={handleCopyToClipboard}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={20}
                  color="#06b6d4"
                />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Copy JSON</Text>
                  <Text style={styles.optionDescription}>
                    Copy blueprint as JSON to clipboard
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={handleImportFromText}
              >
                <MaterialCommunityIcons
                  name="content-paste"
                  size={20}
                  color="#10b981"
                />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Import from Clipboard</Text>
                  <Text style={styles.optionDescription}>
                    Load a blueprint from clipboard JSON
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* JSON Preview */}
            {shareText && (
              <View style={styles.section}>
                <Text style={styles.label}>JSON Preview</Text>
                <ScrollView
                  style={styles.jsonPreview}
                  horizontal
                  scrollEnabled
                >
                  <Text style={styles.jsonText}>{shareText}</Text>
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
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
  modal: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 24,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e2e8f0',
    fontSize: 14,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionContent: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: '#94a3b8',
  },
  jsonPreview: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#334155',
  },
  jsonText: {
    color: '#10b981',
    fontFamily: 'monospace',
    fontSize: 10,
  },
});
