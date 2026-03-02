import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ExecutionEvent {
  id: string;
  nodeId: string;
  nodeName: string;
  startTime: number;
  endTime?: number;
  status: 'running' | 'completed' | 'error';
  inputData?: any;
  outputData?: any;
}

interface ExecutionTrace {
  id: string;
  timestamp: Date;
  totalDuration: number;
  events: ExecutionEvent[];
  status: 'running' | 'completed' | 'failed';
}

export default function GraphExecutionVisualizer() {
  const [visible, setVisible] = useState(false);
  const [traces, setTraces] = useState<ExecutionTrace[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<ExecutionTrace | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ExecutionEvent | null>(null);

  const startNewExecution = () => {
    const newTrace: ExecutionTrace = {
      id: Date.now().toString(),
      timestamp: new Date(),
      totalDuration: 0,
      events: [],
      status: 'running',
    };
    setTraces([newTrace, ...traces]);
    setSelectedTrace(newTrace);
  };

  const getEventColor = (status: ExecutionEvent['status']) => {
    switch (status) {
      case 'running':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#06b6d4';
    }
  };

  const getEventIcon = (status: ExecutionEvent['status']) => {
    switch (status) {
      case 'running':
        return 'loading';
      case 'completed':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'circle-outline';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="play-network" size={18} color="#06b6d4" />
        <Text style={styles.headerTitle}>Graph Execution</Text>
        <Pressable onPress={() => setVisible(!visible)} style={styles.toggleButton}>
          <MaterialCommunityIcons
            name={visible ? 'chevron-down' : 'chevron-up'}
            size={18}
            color="#06b6d4"
          />
        </Pressable>
      </View>

      {visible && (
        <>
          <View style={styles.controlBar}>
            <Pressable style={styles.executeButton} onPress={startNewExecution}>
              <MaterialCommunityIcons name="play-circle" size={16} color="#fff" />
              <Text style={styles.executeButtonText}>Execute</Text>
            </Pressable>

            <View style={styles.statsDisplay}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Traces</Text>
                <Text style={styles.statValue}>{traces.length}</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Events</Text>
                <Text style={styles.statValue}>{selectedTrace?.events.length || 0}</Text>
              </View>
            </View>
          </View>

          <View style={styles.mainContent}>
            {/* Traces List */}
            <View style={styles.tracesList}>
              <Text style={styles.sectionTitle}>Execution Traces</Text>
              <ScrollView style={styles.tracesListContent}>
                {traces.length > 0 ? (
                  traces.map((trace) => (
                    <Pressable
                      key={trace.id}
                      style={[
                        styles.traceItem,
                        selectedTrace?.id === trace.id && styles.traceItemActive,
                      ]}
                      onPress={() => setSelectedTrace(trace)}
                    >
                      <View style={styles.traceItemHeader}>
                        <MaterialCommunityIcons
                          name={trace.status === 'running' ? 'loading' : trace.status === 'completed' ? 'check-circle' : 'alert-circle'}
                          size={14}
                          color={trace.status === 'completed' ? '#10b981' : trace.status === 'running' ? '#f59e0b' : '#ef4444'}
                        />
                        <Text style={styles.traceItemTime}>{trace.timestamp.toLocaleTimeString()}</Text>
                      </View>
                      <Text style={styles.traceItemDuration}>{trace.totalDuration}ms</Text>
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="play-outline" size={32} color="#64748b" />
                    <Text style={styles.emptyText}>No traces yet</Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* Timeline */}
            {selectedTrace && (
              <View style={styles.timeline}>
                <Text style={styles.sectionTitle}>Execution Timeline</Text>
                <ScrollView style={styles.timelineContent}>
                  {selectedTrace.events.length > 0 ? (
                    selectedTrace.events.map((event, idx) => (
                      <Pressable
                        key={event.id}
                        style={[
                          styles.timelineItem,
                          selectedEvent?.id === event.id && styles.timelineItemActive,
                        ]}
                        onPress={() => setSelectedEvent(event)}
                      >
                        <View style={styles.timelineItemLeft}>
                          <View
                            style={[
                              styles.eventDot,
                              { backgroundColor: getEventColor(event.status) },
                            ]}
                          />
                          <View style={styles.timelineItemContent}>
                            <Text style={styles.eventNodeName}>{event.nodeName}</Text>
                            <Text style={styles.eventTime}>
                              {event.endTime
                                ? `${event.endTime - event.startTime}ms`
                                : 'running...'}
                            </Text>
                          </View>
                        </View>
                        <MaterialCommunityIcons
                          name={getEventIcon(event.status) as any}
                          size={14}
                          color={getEventColor(event.status)}
                        />
                      </Pressable>
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <MaterialCommunityIcons name="history" size={32} color="#64748b" />
                      <Text style={styles.emptyText}>No events recorded</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Event Details */}
            {selectedEvent && (
              <View style={styles.eventDetails}>
                <Text style={styles.sectionTitle}>Event Details</Text>
                <ScrollView style={styles.eventDetailsContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Node:</Text>
                    <Text style={styles.detailValue}>{selectedEvent.nodeName}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{selectedEvent.status}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>
                      {selectedEvent.endTime
                        ? `${selectedEvent.endTime - selectedEvent.startTime}ms`
                        : 'pending'}
                    </Text>
                  </View>

                  {selectedEvent.inputData && (
                    <View style={styles.dataSection}>
                      <Text style={styles.dataTitle}>Input Data</Text>
                      <View style={styles.dataBox}>
                        <Text style={styles.dataText}>
                          {JSON.stringify(selectedEvent.inputData, null, 2)}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedEvent.outputData && (
                    <View style={styles.dataSection}>
                      <Text style={styles.dataTitle}>Output Data</Text>
                      <View style={styles.dataBox}>
                        <Text style={styles.dataText}>
                          {JSON.stringify(selectedEvent.outputData, null, 2)}
                        </Text>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
    textTransform: 'uppercase',
  },
  toggleButton: {
    padding: 4,
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 12,
  },
  executeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#10b981',
    borderRadius: 4,
    gap: 6,
  },
  executeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statsDisplay: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#06b6d4',
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  tracesList: {
    width: '25%',
    borderRightWidth: 1,
    borderRightColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    textTransform: 'uppercase',
  },
  tracesListContent: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  traceItem: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 2,
    borderRadius: 4,
    backgroundColor: '#1e293b',
  },
  traceItemActive: {
    backgroundColor: '#0c4a6e',
    borderLeftWidth: 2,
    borderLeftColor: '#06b6d4',
  },
  traceItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  traceItemTime: {
    flex: 1,
    fontSize: 10,
    color: '#cbd5e1',
  },
  traceItemDuration: {
    fontSize: 10,
    fontWeight: '700',
    color: '#06b6d4',
  },
  timeline: {
    width: '37%',
    borderRightWidth: 1,
    borderRightColor: '#1e293b',
  },
  timelineContent: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 2,
    borderRadius: 4,
    backgroundColor: '#1e293b',
  },
  timelineItemActive: {
    backgroundColor: '#0c4a6e',
  },
  timelineItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineItemContent: {
    flex: 1,
  },
  eventNodeName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  eventTime: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  eventDetails: {
    width: '38%',
  },
  eventDetailsContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  detailLabel: {
    width: 80,
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  detailValue: {
    flex: 1,
    fontSize: 11,
    color: '#cbd5e1',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#0c4a6e',
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#06b6d4',
  },
  dataSection: {
    marginTop: 12,
  },
  dataTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  dataBox: {
    backgroundColor: '#1e293b',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dataText: {
    fontSize: 9,
    color: '#cbd5e1',
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
});
