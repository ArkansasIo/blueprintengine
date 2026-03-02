import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  ScrollView,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { BLUEPRINT_TEMPLATES, listTemplates } from '../../app/utils/blueprint-templates';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TemplateLibrary() {
  const [visible, setVisible] = useState(false);
  const { loadBlueprint } = useEditorStore();

  const templates = listTemplates();

  const handleLoadTemplate = (templateName: string) => {
    const template = BLUEPRINT_TEMPLATES[templateName as keyof typeof BLUEPRINT_TEMPLATES];
    if (template) {
      loadBlueprint(template);
      setVisible(false);
    }
  };

  return (
    <>
      <Pressable
        style={[styles.button, styles.templateButton]}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="library" size={20} color="#fff" />
        <Text style={styles.buttonText}>Templates</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Blueprint Templates</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Template List */}
          <ScrollView style={styles.content}>
            {templates.map((templateName) => (
              <Pressable
                key={templateName}
                style={styles.templateCard}
                onPress={() => handleLoadTemplate(templateName)}
              >
                <View style={styles.templateHeader}>
                  <Text style={styles.templateTitle}>
                    {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color="#cbd5e1"
                  />
                </View>
                <Text style={styles.templateDescription}>
                  {getTemplateDescription(templateName)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function getTemplateDescription(name: string): string {
  const descriptions: Record<string, string> = {
    counter: 'A simple counter that increments a value',
    conditional: 'Decision branching with if-then-else logic',
    loop: 'Loop iteration pattern for repetitive tasks',
    transform: 'Data transformation pipeline pattern',
  };
  return descriptions[name] || 'No description available';
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  templateButton: {
    borderColor: '#3b82f6',
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
  templateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  templateDescription: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
  },
});
