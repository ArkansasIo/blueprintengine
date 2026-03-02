import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Modal,
  ScrollView,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EditorInspector() {
  const [visible, setVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [executionContext, setExecutionContext] = useState<any>(null);
  const { nodes, edges } = useEditorStore();

  const hasErrors = validationErrors.length > 0;
  const hasExecuted = executionContext && executionContext.visitedNodes.size > 0;

  const validateCurrent = () => {
    // Validate the current blueprint
    const nodeIds = new Set(nodes.map((n) => n.id));
    const errors: any[] = [];
    
    edges.forEach((edge) => {
      if (!nodeIds.has(edge.fromNodeId) || !nodeIds.has(edge.toNodeId)) {
        errors.push({
          type: 'invalid-connection',
          nodeId: edge.fromNodeId,
          message: `Invalid connection: node not found`,
        });
      }
    });

    setValidationErrors(errors);
  };

  const executeCurrent = () => {
    // Simple execution simulation
    setExecutionContext({
      visitedNodes: new Set(nodes.map((n) => n.id)),
      nodeOutputs: nodes.reduce((acc, n) => ({ ...acc, [n.id]: { out: 'done' } }), {}),
    });
  };

  return (
    <>
      <Pressable
        style={[styles.button, hasErrors && styles.buttonError]}
        onPress={() => {
          validateCurrent();
          setVisible(true);
        }}
      >
        <MaterialCommunityIcons
          name="check-circle"
          size={20}
          color={hasErrors ? '#ef4444' : '#10b981'}
        />
        <Text style={styles.buttonText}>Validate</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => {
          executeCurrent();
          setVisible(true);
        }}
      >
        <MaterialCommunityIcons name="play-circle" size={20} color="#fff" />
        <Text style={styles.buttonText}>Execute</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Blueprint Inspector</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Validation Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Validation {validationErrors.length > 0 ? `(${validationErrors.length} errors)` : '✓'}
              </Text>
              {validationErrors.length === 0 ? (
                <View style={styles.successBox}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#10b981"
                  />
                  <Text style={styles.successText}>No errors found</Text>
                </View>
              ) : (
                validationErrors.map((error, idx) => (
                  <View key={idx} style={styles.errorBox}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={16}
                      color="#ef4444"
                    />
                    <View style={styles.errorContent}>
                      <Text style={styles.errorType}>{error.type}</Text>
                      <Text style={styles.errorMessage}>{error.message}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Execution Section */}
            {hasExecuted && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Execution Result</Text>
                <View style={styles.executionBox}>
                  <View style={styles.executionStat}>
                    <Text style={styles.statLabel}>Nodes Visited:</Text>
                    <Text style={styles.statValue}>
                      {executionContext.visitedNodes.size}
                    </Text>
                  </View>
                  <View style={styles.executionStat}>
                    <Text style={styles.statLabel}>Iterations:</Text>
                    <Text style={styles.statValue}>
                      {Object.keys(executionContext.nodeOutputs).length}
                    </Text>
                  </View>
                </View>

                {/* Node Outputs */}
                <View style={styles.outputsContainer}>
                  {Object.entries(executionContext.nodeOutputs).map(([nodeId, output]) => (
                    <View key={nodeId} style={styles.outputItem}>
                      <Text style={styles.outputNodeId}>{nodeId.slice(0, 8)}</Text>
                      <Text style={styles.outputValue}>
                        {JSON.stringify(output).slice(0, 100)}
                      </Text>
                    </View>
                  ))}
                </View>
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
    borderColor: '#3b82f6',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonError: {
    borderColor: '#ef4444',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064e3b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  successText: {
    color: '#d1fae5',
    marginLeft: 8,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  errorContent: {
    marginLeft: 8,
    flex: 1,
  },
  errorType: {
    color: '#fca5a5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#fecaca',
    fontSize: 11,
    marginTop: 2,
  },
  executionBox: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  executionStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  statValue: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  outputsContainer: {
    marginTop: 12,
  },
  outputItem: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  outputNodeId: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  outputValue: {
    color: '#cbd5e1',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});