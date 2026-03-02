import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useEditorStore } from './stores/editor-store';
import { BlueprintClass } from './utils/ue5-blueprint-generator';
import BlueprintEditorHub from '../components/editor/BlueprintEditorHub';
import EditorToolbar from '../components/editor/EditorToolbar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function EditorScreen() {
  useKeyboardShortcuts();
  const [blueprint, setBlueprint] = useState<BlueprintClass | null>(null);

  const handleBlueprintChange = (newBlueprint: BlueprintClass) => {
    setBlueprint(newBlueprint);
  };

  const handleCompile = async (bp: BlueprintClass): Promise<boolean> => {
    // Compile logic here
    console.log('Compiling blueprint:', bp.name);
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <BlueprintEditorHub
        blueprint={blueprint}
        onBlueprintChange={handleBlueprintChange}
        onCompile={handleCompile}
      />
      <EditorToolbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});