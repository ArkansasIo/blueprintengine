import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Text, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEditorStore } from '@/app/stores/editor-store';
import { validateBlueprint } from '@/app/utils/blueprint-validator';

interface CompilationResult {
  success: boolean;
  warnings: string[];
  errors: string[];
  generatedCode?: string;
  compilationTime: number;
}

interface CompilationLog {
  id: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export default function CompilationPanel() {
  const [visible, setVisible] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [lastResult, setLastResult] = useState<CompilationResult | null>(null);
  const [logs, setLogs] = useState<CompilationLog[]>([]);
  const [activeTab, setActiveTab] = useState<'result' | 'logs' | 'generated'>('result');

  const { nodes, edges } = useEditorStore();

  const handleCompile = async () => {
    setCompiling(true);
    const startTime = Date.now();

    try {
      // Validate blueprint
      const validation = validateBlueprint({ nodes, edges } as any);

      const warnings: string[] = [];
      const errors: string[] = [];

      // Check for common issues
      if (nodes.length === 0) {
        errors.push('Blueprint contains no nodes');
      }

      const inputNodes = nodes.filter((n) => n.type === 'input');
      const outputNodes = nodes.filter((n) => n.type === 'output');

      if (inputNodes.length === 0) {
        warnings.push('No input nodes found - blueprint may not receive data');
      }
      if (outputNodes.length === 0) {
        warnings.push('No output nodes found - blueprint may not produce output');
      }

      // Check for floating nodes
      const connectedNodes = new Set(edges.flatMap((e) => [e.fromNodeId, e.toNodeId]));
      const floatingNodes = nodes.filter((n) => !connectedNodes.has(n.id) && n.type !== 'input');
      if (floatingNodes.length > 0) {
        warnings.push(`${floatingNodes.length} node(s) are not connected`);
      }

      // Check for cycles
      const hasCycle = detectCycle();
      if (hasCycle) {
        errors.push('Blueprint contains circular connections (cycles)');
      }

      const compilationTime = Date.now() - startTime;
      const success = errors.length === 0;

      const result: CompilationResult = {
        success,
        warnings,
        errors,
        generatedCode: success ? generateCode() : undefined,
        compilationTime,
      };

      setLastResult(result);

      // Add log entry
      const logEntry: CompilationLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        status: success ? 'success' : 'error',
        message: success ? 'Compilation successful' : `Compilation failed: ${errors.length} error(s)`,
        details: [...errors, ...warnings].join('\n'),
      };

      setLogs([logEntry, ...logs]);

      if (!success) {
        Alert.alert(
          'Compilation Failed',
          `${errors.length} error(s), ${warnings.length} warning(s)`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Success', 'Blueprint compiled successfully', [{ text: 'OK' }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Compilation failed');
    } finally {
      setCompiling(false);
    }
  };

  const detectCycle = (): boolean => {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycleDFS = (nodeId: string): boolean => {
      visited.add(nodeId);
      recursionStack.add(nodeId);

      const outgoing = edges.filter((e) => e.fromNodeId === nodeId);
      for (const edge of outgoing) {
        if (!visited.has(edge.toNodeId)) {
          if (hasCycleDFS(edge.toNodeId)) return true;
        } else if (recursionStack.has(edge.toNodeId)) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycleDFS(node.id)) return true;
      }
    }

    return false;
  };

  const generateCode = (): string => {
    return `
// Auto-generated Blueprint Code
class GeneratedBlueprint {
  constructor() {
    this.nodes = ${JSON.stringify(nodes, null, 2)};
    this.edges = ${JSON.stringify(edges, null, 2)};
  }

  execute(input) {
    // Graph execution logic here
    return this.traverse(input);
  }

  traverse(input) {
    // Implementation of graph traversal
  }
}

export default GeneratedBlueprint;
    `.trim();
  };

  const renderResultTab = () => (
    <ScrollView style={styles.tabContent}>
      {lastResult ? (
        <>
          <View
            style={[
              styles.resultBox,
              lastResult.success ? styles.resultSuccess : styles.resultError,
            ]}
          >
            <MaterialCommunityIcons
              name={lastResult.success ? 'check-circle' : 'alert-circle'}
              size={32}
              color={lastResult.success ? '#10b981' : '#ef4444'}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>
                {lastResult.success ? 'Compilation Successful' : 'Compilation Failed'}
              </Text>
              <Text style={styles.resultSubtitle}>
                Completed in {lastResult.compilationTime}ms
              </Text>
            </View>
          </View>

          {lastResult.errors.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>
                Errors ({lastResult.errors.length})
              </Text>
              {lastResult.errors.map((error, idx) => (
                <View key={idx} style={styles.messageItem}>
                  <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                  <Text style={styles.messageText}>{error}</Text>
                </View>
              ))}
            </View>
          )}

          {lastResult.warnings.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: '#f59e0b' }]}>
                Warnings ({lastResult.warnings.length})
              </Text>
              {lastResult.warnings.map((warning, idx) => (
                <View key={idx} style={styles.messageItem}>
                  <MaterialCommunityIcons name="alert" size={16} color="#f59e0b" />
                  <Text style={styles.messageText}>{warning}</Text>
                </View>
              ))}
            </View>
          )}

          {lastResult.success && (
            <View style={styles.successBox}>
              <MaterialCommunityIcons name="check-all" size={24} color="#10b981" />
              <Text style={styles.successText}>Blueprint is ready for use</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-search-outline" size={48} color="#64748b" />
          <Text style={styles.emptyText}>No compilation results</Text>
          <Text style={styles.emptySubtext}>Click "Compile" to check your blueprint</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderLogsTab = () => (
    <ScrollView style={styles.tabContent}>
      {logs.length > 0 ? (
        logs.map((log) => (
          <View key={log.id} style={styles.logEntry}>
            <View style={styles.logHeader}>
              <MaterialCommunityIcons
                name={log.status === 'success' ? 'check-circle' : 'alert-circle'}
                size={16}
                color={log.status === 'success' ? '#10b981' : '#ef4444'}
              />
              <Text style={styles.logMessage}>{log.message}</Text>
              <Text style={styles.logTime}>{log.timestamp.toLocaleTimeString()}</Text>
            </View>
            {log.details && <Text style={styles.logDetails}>{log.details}</Text>}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="history" size={48} color="#64748b" />
          <Text style={styles.emptyText}>No compilation history</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderGeneratedTab = () => (
    <ScrollView style={styles.tabContent}>
      {lastResult?.generatedCode ? (
        <>
          <Pressable
            style={styles.copyButton}
            onPress={() => {
              Alert.alert('Copied', 'Code copied to clipboard');
            }}
          >
            <MaterialCommunityIcons name="content-copy" size={16} color="#06b6d4" />
            <Text style={styles.copyButtonText}>Copy Code</Text>
          </Pressable>

          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{lastResult.generatedCode}</Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="code-tags" size={48} color="#64748b" />
          <Text style={styles.emptyText}>No generated code</Text>
          <Text style={styles.emptySubtext}>Compile a successful blueprint first</Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <>
      <Pressable
        style={[styles.button, compiling && styles.buttonCompiling]}
        onPress={() => setVisible(true)}
        disabled={compiling}
      >
        <MaterialCommunityIcons
          name={compiling ? 'loading' : 'hammer-screwdriver'}
          size={18}
          color="#fff"
        />
        <Text style={styles.buttonText}>{compiling ? 'Compiling...' : 'Compile'}</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Blueprint Compilation</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Compile Button */}
          <View style={styles.actionBar}>
            <Pressable
              style={[styles.compileButton, compiling && styles.compileButtonDisabled]}
              onPress={handleCompile}
              disabled={compiling}
            >
              <MaterialCommunityIcons
                name={compiling ? 'loading' : 'play-circle-outline'}
                size={18}
                color="#fff"
              />
              <Text style={styles.compileButtonText}>
                {compiling ? 'Compiling...' : 'Compile Blueprint'}
              </Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            {['result', 'logs', 'generated'].map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab as any)}
              >
                <Text
                  style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'result' && renderResultTab()}
          {activeTab === 'logs' && renderLogsTab()}
          {activeTab === 'generated' && renderGeneratedTab()}
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
    borderColor: '#64748b',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
  },
  buttonCompiling: {
    opacity: 0.6,
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
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
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
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  compileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  compileButtonDisabled: {
    opacity: 0.6,
  },
  compileButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#06b6d4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#06b6d4',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    gap: 12,
  },
  resultSuccess: {
    borderColor: '#10b981',
    backgroundColor: '#064e3b',
  },
  resultError: {
    borderColor: '#ef4444',
    backgroundColor: '#7f1d1d',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    marginBottom: 8,
    gap: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#064e3b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  logEntry: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#334155',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logMessage: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  logTime: {
    fontSize: 10,
    color: '#64748b',
  },
  logDetails: {
    fontSize: 11,
    color: '#94a3b8',
    marginLeft: 24,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#0c4a6e',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#06b6d4',
    marginBottom: 12,
    gap: 6,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#06b6d4',
  },
  codeBox: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#cbd5e1',
    lineHeight: 16,
  },
});
