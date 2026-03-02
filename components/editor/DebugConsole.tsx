import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ConsoleLog {
  id: string;
  timestamp: Date;
  type: 'log' | 'warning' | 'error' | 'debug' | 'trace';
  message: string;
  details?: any;
}

interface Variable {
  name: string;
  type: string;
  value: any;
  scope: 'local' | 'global' | 'instance';
}

interface BreakpointHit {
  nodeId: string;
  nodeName: string;
  timestamp: Date;
  variables: Variable[];
}

export default function DebugConsole() {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [breakpoints, setBreakpoints] = useState<BreakpointHit[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'variables' | 'breakpoints'>('logs');
  const [filterText, setFilterText] = useState('');
  const [logLevel, setLogLevel] = useState<'all' | 'errors' | 'warnings'>('all');

  const addLog = (type: ConsoleLog['type'], message: string, details?: any) => {
    const newLog: ConsoleLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
      details,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
  };

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = logLevel === 'all' || (logLevel === 'errors' && log.type === 'error') || (logLevel === 'warnings' && log.type === 'warning');
    const matchesText = log.message.toLowerCase().includes(filterText.toLowerCase());
    return matchesLevel && matchesText;
  });

  const clearLogs = () => setLogs([]);

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'debug':
        return '#06b6d4';
      case 'trace':
        return '#8b5cf6';
      default:
        return '#cbd5e1';
    }
  };

  const getLogIcon = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert';
      case 'debug':
        return 'bug';
      case 'trace':
        return 'code-tags';
      default:
        return 'information';
    }
  };

  const renderLogsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.filterBar}>
        <MaterialCommunityIcons name="magnify" size={16} color="#64748b" />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter logs..."
          placeholderTextColor="#64748b"
          value={filterText}
          onChangeText={setFilterText}
        />
        <View style={styles.levelSelector}>
          {(['all', 'warnings', 'errors'] as const).map((level) => (
            <Pressable
              key={level}
              style={[
                styles.levelButton,
                logLevel === level && styles.levelButtonActive,
              ]}
              onPress={() => setLogLevel(level)}
            >
              <Text
                style={[
                  styles.levelButtonText,
                  logLevel === level && styles.levelButtonTextActive,
                ]}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={styles.logsList}>
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logHeader}>
                <MaterialCommunityIcons
                  name={getLogIcon(log.type) as any}
                  size={14}
                  color={getLogColor(log.type)}
                />
                <Text style={[styles.logTime, { color: getLogColor(log.type) }]}>
                  {log.timestamp.toLocaleTimeString()}
                </Text>
              </View>
              <Text style={styles.logMessage}>{log.message}</Text>
              {log.details && (
                <View style={styles.logDetails}>
                  <Text style={styles.logDetailsText}>{JSON.stringify(log.details, null, 2)}</Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="inbox-outline" size={40} color="#64748b" />
            <Text style={styles.emptyText}>No logs to display</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.consoleFooter}>
        <Pressable style={styles.clearButton} onPress={clearLogs}>
          <MaterialCommunityIcons name="trash-can-outline" size={14} color="#ef4444" />
          <Text style={styles.clearButtonText}>Clear Logs</Text>
        </Pressable>
        <Text style={styles.logCount}>{filteredLogs.length} logs</Text>
      </View>
    </View>
  );

  const renderVariablesTab = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.variablesList}>
        {variables.length > 0 ? (
          variables.map((variable, idx) => (
            <View key={idx} style={styles.variableItem}>
              <View style={styles.variableHeader}>
                <View style={styles.variableNameType}>
                  <Text style={styles.variableName}>{variable.name}</Text>
                  <Text style={styles.variableType}>{variable.type}</Text>
                </View>
                <View
                  style={[
                    styles.scopeBadge,
                    {
                      backgroundColor:
                        variable.scope === 'global' ? '#0c4a6e' : variable.scope === 'instance' ? '#064e3b' : '#3f3f00',
                    },
                  ]}
                >
                  <Text style={styles.scopeBadgeText}>{variable.scope}</Text>
                </View>
              </View>
              <View style={styles.variableValue}>
                <Text style={styles.variableValueText}>
                  {typeof variable.value === 'string' ? variable.value : JSON.stringify(variable.value, null, 2)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="variable-box" size={40} color="#64748b" />
            <Text style={styles.emptyText}>No variables to inspect</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  const renderBreakpointsTab = () => (
    <View style={styles.tabContent}>
      <ScrollView style={styles.breakpointsList}>
        {breakpoints.length > 0 ? (
          breakpoints.map((bp, idx) => (
            <View key={idx} style={styles.breakpointItem}>
              <View style={styles.breakpointHeader}>
                <MaterialCommunityIcons name="pause-circle" size={16} color="#ef4444" />
                <Text style={styles.breakpointNodeName}>{bp.nodeName}</Text>
                <Text style={styles.breakpointTime}>{bp.timestamp.toLocaleTimeString()}</Text>
              </View>
              <View style={styles.breakpointVariables}>
                <Text style={styles.breakpointVariablesTitle}>Variables at breakpoint:</Text>
                {bp.variables.map((variable, vidx) => (
                  <Text key={vidx} style={styles.breakpointVariableItem}>
                    • {variable.name}: {String(variable.value)}
                  </Text>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="pause-circle-outline" size={40} color="#64748b" />
            <Text style={styles.emptyText}>No breakpoints hit</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="bug-check-outline" size={18} color="#06b6d4" />
        <Text style={styles.headerTitle}>Debug Console</Text>
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
          <View style={styles.tabBar}>
            {(['logs', 'variables', 'breakpoints'] as const).map((tab) => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === 'logs' && renderLogsTab()}
          {activeTab === 'variables' && renderVariablesTab()}
          {activeTab === 'breakpoints' && renderBreakpointsTab()}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#06b6d4',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#06b6d4',
  },
  tabContent: {
    flex: 1,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 8,
  },
  filterInput: {
    flex: 1,
    height: 32,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#e2e8f0',
    fontSize: 11,
    backgroundColor: '#1e293b',
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  levelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },
  levelButtonActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  levelButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  levelButtonTextActive: {
    color: '#06b6d4',
  },
  logsList: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  logItem: {
    backgroundColor: '#1e293b',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#334155',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  logTime: {
    fontSize: 10,
    fontWeight: '600',
  },
  logMessage: {
    fontSize: 11,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  logDetails: {
    backgroundColor: '#0f172a',
    borderRadius: 3,
    padding: 6,
    marginTop: 4,
  },
  logDetailsText: {
    fontSize: 9,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  consoleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  clearButtonText: {
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  logCount: {
    fontSize: 10,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  variablesList: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  variableItem: {
    backgroundColor: '#1e293b',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
  },
  variableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  variableNameType: {
    flex: 1,
  },
  variableName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#06b6d4',
  },
  variableType: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  scopeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  scopeBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  variableValue: {
    backgroundColor: '#0f172a',
    borderRadius: 3,
    padding: 6,
  },
  variableValueText: {
    fontSize: 10,
    color: '#cbd5e1',
    fontFamily: 'monospace',
  },
  breakpointsList: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  breakpointItem: {
    backgroundColor: '#7f1d1d',
    borderRadius: 4,
    padding: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  breakpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  breakpointNodeName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
  },
  breakpointTime: {
    fontSize: 10,
    color: '#94a3b8',
  },
  breakpointVariables: {
    backgroundColor: '#1e293b',
    borderRadius: 3,
    padding: 6,
  },
  breakpointVariablesTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 4,
  },
  breakpointVariableItem: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 2,
  },
});
