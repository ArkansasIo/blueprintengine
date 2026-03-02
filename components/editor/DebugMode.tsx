import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useEditorStore } from '../../app/stores/editor-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DebugMode() {
  const [visible, setVisible] = useState(false);
  const [debugFlags, setDebugFlags] = useState({
    showNodeIds: false,
    showNodeData: false,
    showPinIds: false,
    showEdgeData: false,
    highlightOrphans: false,
    highlightCycles: false,
    showGridLines: false,
    showBoundingBox: false,
  });

  const { nodes, edges } = useEditorStore();

  const toggleDebugFlag = (flag: keyof typeof debugFlags) => {
    setDebugFlags((prev) => ({
      ...prev,
      [flag]: !prev[flag],
    }));
  };

  const findOrphanNodes = () => {
    const connectedNodeIds = new Set<string>();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.fromNodeId);
      connectedNodeIds.add(edge.toNodeId);
    });
    return nodes.filter((n) => !connectedNodeIds.has(n.id)).length;
  };

  const findCycles = () => {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const outgoingEdges = edges.filter((e) => e.fromNodeId === nodeId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.toNodeId)) {
          if (hasCycle(edge.toNodeId)) return true;
        } else if (recStack.has(edge.toNodeId)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    let cycleCount = 0;
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (hasCycle(node.id)) cycleCount++;
      }
    }

    return cycleCount;
  };

  const orphanCount = findOrphanNodes();
  const cycleCount = findCycles();

  const stats = [
    { label: 'Total Nodes', value: nodes.length, icon: 'cube-outline', color: '#3b82f6' },
    { label: 'Total Edges', value: edges.length, icon: 'vector-link', color: '#10b981' },
    { label: 'Orphan Nodes', value: orphanCount, icon: 'alert-circle-outline', color: '#f59e0b' },
    { label: 'Cycles Found', value: cycleCount, icon: 'alert-octagon-outline', color: '#ef4444' },
  ];

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons name="bug-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Debug</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Debug Mode</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Graph Statistics</Text>
              <View style={styles.statsGrid}>
                {stats.map((stat) => (
                  <View key={stat.label} style={styles.statCard}>
                    <MaterialCommunityIcons
                      name={stat.icon as any}
                      size={24}
                      color={stat.color}
                    />
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Issues */}
            {(orphanCount > 0 || cycleCount > 0) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Issues Found</Text>
                {orphanCount > 0 && (
                  <View style={[styles.issueCard, styles.issueWarning]}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={20}
                      color="#f59e0b"
                    />
                    <View style={styles.issueContent}>
                      <Text style={styles.issueTitle}>Orphan Nodes</Text>
                      <Text style={styles.issueDesc}>
                        {orphanCount} node(s) not connected to graph
                      </Text>
                    </View>
                  </View>
                )}
                {cycleCount > 0 && (
                  <View style={[styles.issueCard, styles.issueDanger]}>
                    <MaterialCommunityIcons
                      name="alert-octagon"
                      size={20}
                      color="#ef4444"
                    />
                    <View style={styles.issueContent}>
                      <Text style={styles.issueTitle}>Circular References</Text>
                      <Text style={styles.issueDesc}>
                        {cycleCount} cycle(s) detected in graph
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Debug Flags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visual Debug Flags</Text>

              {Object.entries(debugFlags).map(([flag, enabled]) => (
                <View key={flag} style={styles.flagRow}>
                  <View style={styles.flagInfo}>
                    <Text style={styles.flagLabel}>
                      {flag.replace(/([A-Z])/g, ' $1').trim()}
                    </Text>
                    <Text style={styles.flagDesc}>
                      {flag === 'showNodeIds' && 'Display node IDs on canvas'}
                      {flag === 'showNodeData' && 'Show node data objects'}
                      {flag === 'showPinIds' && 'Display pin IDs'}
                      {flag === 'showEdgeData' && 'Show edge connection info'}
                      {flag === 'highlightOrphans' && 'Highlight unconnected nodes'}
                      {flag === 'highlightCycles' && 'Highlight cyclic connections'}
                      {flag === 'showGridLines' && 'Display background grid'}
                      {flag === 'showBoundingBox' && 'Show node bounding boxes'}
                    </Text>
                  </View>
                  <Switch
                    value={enabled}
                    onValueChange={() =>
                      toggleDebugFlag(flag as keyof typeof debugFlags)
                    }
                  />
                </View>
              ))}
            </View>

            {/* Debug Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Export Debug Info</Text>

              <Pressable
                style={styles.exportButton}
                onPress={() => {
                  const debugInfo = {
                    timestamp: new Date().toISOString(),
                    nodes: nodes.length,
                    edges: edges.length,
                    orphans: orphanCount,
                    cycles: cycleCount,
                    debugFlags,
                  };
                  console.log('Debug Info:', debugInfo);
                  Alert.alert(
                    'Debug Info Logged',
                    JSON.stringify(debugInfo, null, 2)
                  );
                }}
              >
                <MaterialCommunityIcons
                  name="console"
                  size={18}
                  color="#06b6d4"
                />
                <Text style={styles.exportButtonText}>Log to Console</Text>
              </Pressable>

              <Pressable
                style={styles.exportButton}
                onPress={() => {
                  const nodeDataExport = nodes.map((n) => ({
                    id: n.id,
                    label: n.label,
                    type: n.type,
                    pins: n.pins.length,
                    data: n.data,
                  }));
                  console.log('Nodes:', nodeDataExport);
                  Alert.alert('Node Data Exported', 'Check console');
                }}
              >
                <MaterialCommunityIcons
                  name="cube-outline"
                  size={18}
                  color="#3b82f6"
                />
                <Text style={styles.exportButtonText}>Export Nodes</Text>
              </Pressable>

              <Pressable
                style={styles.exportButton}
                onPress={() => {
                  const edgeDataExport = edges.map((e) => ({
                    id: e.id,
                    from: e.fromNodeId,
                    to: e.toNodeId,
                    fromPin: e.fromPinId,
                    toPin: e.toPinId,
                  }));
                  console.log('Edges:', edgeDataExport);
                  Alert.alert('Edge Data Exported', 'Check console');
                }}
              >
                <MaterialCommunityIcons
                  name="vector-link"
                  size={18}
                  color="#10b981"
                />
                <Text style={styles.exportButtonText}>Export Edges</Text>
              </Pressable>
            </View>
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
    borderColor: '#64748b',
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#1e293b',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  issueWarning: {
    backgroundColor: '#78350f',
    borderLeftColor: '#f59e0b',
  },
  issueDanger: {
    backgroundColor: '#7f1d1d',
    borderLeftColor: '#ef4444',
  },
  issueContent: {
    flex: 1,
    marginLeft: 12,
  },
  issueTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  issueDesc: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  flagInfo: {
    flex: 1,
  },
  flagLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  flagDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
});
