import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Modal,
  ScrollView,
  FlatList,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { GraphExecutor } from '../../app/utils/graph-executor';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExecutionVisualizer() {
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { nodes, edges } = useEditorStore();

  const runExecution = () => {
    const executor = new GraphExecutor(nodes, edges);
    
    // Validate first
    const errors = executor.validateGraph();
    if (errors.length > 0) {
      setResult({
        success: false,
        errors,
        visitedNodes: new Set(),
        nodeOutputs: {},
        executionPath: [],
      });
      return;
    }

    // Execute
    const context = executor.execute();
    setResult({
      ...context,
      success: context.errors.length === 0,
    });
    setVisible(true);
  };

  const hasNodes = nodes.length > 0;

  return (
    <>
      <Pressable
        style={[styles.button, !hasNodes && styles.buttonDisabled]}
        onPress={runExecution}
        disabled={!hasNodes}
      >
        <MaterialCommunityIcons name="play" size={20} color="#fff" />
        <Text style={styles.buttonText}>Execute</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Execution Result</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {result?.success ? (
              <>
                {/* Execution Path */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Execution Path</Text>
                  <FlatList
                    data={result.executionPath || []}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => {
                      const node = nodes.find((n) => n.id === item);
                      return (
                        <View style={styles.pathItem}>
                          <View style={styles.pathNumber}>
                            <Text style={styles.pathNumberText}>{index + 1}</Text>
                          </View>
                          <Text style={styles.pathNodeName}>{node?.label}</Text>
                          <View
                            style={[
                              styles.pathStatus,
                              { backgroundColor: getStatusColor('success') },
                            ]}
                          />
                        </View>
                      );
                    }}
                    keyExtractor={(item, idx) => idx.toString()}
                  />
                </View>

                {/* Node Outputs */}
                {Object.entries(result.nodeOutputs || {}).length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Node Outputs</Text>
                    {Object.entries(result.nodeOutputs).map(([nodeId, output]: any) => {
                      const node = nodes.find((n) => n.id === nodeId);
                      return (
                        <View key={nodeId} style={styles.outputBox}>
                          <Text style={styles.outputLabel}>{node?.label}</Text>
                          <Text style={styles.outputValue}>
                            {JSON.stringify(output, null, 2)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.errorSection}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={48}
                  color="#ef4444"
                />
                <Text style={styles.errorTitle}>Execution Failed</Text>
                {(result?.errors || []).map((error: string, idx: number) => (
                  <View key={idx} style={styles.errorItem}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'success':
      return '#10b981';
    case 'error':
      return '#ef4444';
    case 'pending':
      return '#f59e0b';
    default:
      return '#64748b';
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#8b5cf6',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  pathItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  pathNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pathNumberText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  pathNodeName: {
    flex: 1,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  pathStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  outputBox: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  outputLabel: {
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 6,
  },
  outputValue: {
    color: '#10b981',
    fontFamily: 'monospace',
    fontSize: 11,
  },
  errorSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
    marginTop: 12,
    marginBottom: 16,
  },
  errorItem: {
    width: '100%',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
  },
});
