import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Text, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PreferencesState {
  // Appearance
  darkMode: boolean;
  showGrid: boolean;
  gridSize: number;
  nodeSize: 'small' | 'medium' | 'large';

  // Behavior
  autoSave: boolean;
  autoSaveInterval: number;
  snapToGrid: boolean;
  smoothPanning: boolean;
  reverseZoom: boolean;

  // Node Settings
  nodeColorMode: 'type' | 'custom' | 'category';
  showNodeIDs: boolean;
  showNodeTypes: boolean;
  showPinLabels: boolean;

  // Advanced
  enableDebugMode: boolean;
  enablePerformanceMonitor: boolean;
  enableCollaboration: boolean;
  maxUndoSteps: number;
}

interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

export default function PreferencesPanel() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const [prefs, setPrefs] = useState<PreferencesState>({
    darkMode: true,
    showGrid: true,
    gridSize: 20,
    nodeSize: 'medium',
    autoSave: true,
    autoSaveInterval: 30,
    snapToGrid: true,
    smoothPanning: true,
    reverseZoom: false,
    nodeColorMode: 'type',
    showNodeIDs: true,
    showNodeTypes: true,
    showPinLabels: true,
    enableDebugMode: false,
    enablePerformanceMonitor: false,
    enableCollaboration: false,
    maxUndoSteps: 100,
  });

  const tabs: TabConfig[] = [
    { id: 'appearance', label: 'Appearance', icon: 'palette-outline' },
    { id: 'behavior', label: 'Behavior', icon: 'cog-outline' },
    { id: 'nodes', label: 'Nodes', icon: 'cube-outline' },
    { id: 'advanced', label: 'Advanced', icon: 'flash-outline' },
  ];

  const togglePreference = (key: keyof PreferencesState) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const updatePreference = (key: keyof PreferencesState, value: any) => {
    setPrefs({ ...prefs, [key]: value });
  };

  const renderAppearanceTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Visual Settings</Text>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Text style={styles.settingDesc}>Use dark theme throughout the editor</Text>
        </View>
        <Switch
          value={prefs.darkMode}
          onValueChange={() => togglePreference('darkMode')}
          thumbColor={prefs.darkMode ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Show Grid</Text>
          <Text style={styles.settingDesc}>Display background grid on canvas</Text>
        </View>
        <Switch
          value={prefs.showGrid}
          onValueChange={() => togglePreference('showGrid')}
          thumbColor={prefs.showGrid ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Grid Size</Text>
          <Text style={styles.settingDesc}>Pixel spacing between grid lines</Text>
        </View>
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{prefs.gridSize}px</Text>
        </View>
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Node Size</Text>
          <Text style={styles.settingDesc}>Default node display size</Text>
        </View>
        <View style={styles.sizeSelector}>
          {['small', 'medium', 'large'].map((size) => (
            <Pressable
              key={size}
              style={[
                styles.sizeButton,
                prefs.nodeSize === size && styles.sizeButtonActive,
              ]}
              onPress={() => updatePreference('nodeSize', size)}
            >
              <Text style={styles.sizeButtonText}>{size[0].toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderBehaviorTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Editor Behavior</Text>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Auto Save</Text>
          <Text style={styles.settingDesc}>Automatically save blueprints</Text>
        </View>
        <Switch
          value={prefs.autoSave}
          onValueChange={() => togglePreference('autoSave')}
          thumbColor={prefs.autoSave ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      {prefs.autoSave && (
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Auto Save Interval</Text>
            <Text style={styles.settingDesc}>Seconds between auto saves</Text>
          </View>
          <View style={styles.valueDisplay}>
            <Text style={styles.valueText}>{prefs.autoSaveInterval}s</Text>
          </View>
        </View>
      )}

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Snap to Grid</Text>
          <Text style={styles.settingDesc}>Snap nodes to grid when moving</Text>
        </View>
        <Switch
          value={prefs.snapToGrid}
          onValueChange={() => togglePreference('snapToGrid')}
          thumbColor={prefs.snapToGrid ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Smooth Panning</Text>
          <Text style={styles.settingDesc}>Enable smooth canvas movement</Text>
        </View>
        <Switch
          value={prefs.smoothPanning}
          onValueChange={() => togglePreference('smoothPanning')}
          thumbColor={prefs.smoothPanning ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Reverse Zoom</Text>
          <Text style={styles.settingDesc}>Invert scroll wheel zoom direction</Text>
        </View>
        <Switch
          value={prefs.reverseZoom}
          onValueChange={() => togglePreference('reverseZoom')}
          thumbColor={prefs.reverseZoom ? '#06b6d4' : '#cbd5e1'}
        />
      </View>
    </View>
  );

  const renderNodesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Node Display</Text>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Color Mode</Text>
          <Text style={styles.settingDesc}>How nodes are colored</Text>
        </View>
        <View style={styles.modeSelector}>
          {['type', 'custom', 'category'].map((mode) => (
            <Pressable
              key={mode}
              style={[
                styles.modeButton,
                prefs.nodeColorMode === mode && styles.modeButtonActive,
              ]}
              onPress={() => updatePreference('nodeColorMode', mode)}
            >
              <Text style={styles.modeButtonText}>{mode}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Show Node IDs</Text>
          <Text style={styles.settingDesc}>Display node identification numbers</Text>
        </View>
        <Switch
          value={prefs.showNodeIDs}
          onValueChange={() => togglePreference('showNodeIDs')}
          thumbColor={prefs.showNodeIDs ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Show Node Types</Text>
          <Text style={styles.settingDesc}>Display node type labels</Text>
        </View>
        <Switch
          value={prefs.showNodeTypes}
          onValueChange={() => togglePreference('showNodeTypes')}
          thumbColor={prefs.showNodeTypes ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Show Pin Labels</Text>
          <Text style={styles.settingDesc}>Display labels on connection pins</Text>
        </View>
        <Switch
          value={prefs.showPinLabels}
          onValueChange={() => togglePreference('showPinLabels')}
          thumbColor={prefs.showPinLabels ? '#06b6d4' : '#cbd5e1'}
        />
      </View>
    </View>
  );

  const renderAdvancedTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Advanced Settings</Text>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Debug Mode</Text>
          <Text style={styles.settingDesc}>Enable debug logging and tools</Text>
        </View>
        <Switch
          value={prefs.enableDebugMode}
          onValueChange={() => togglePreference('enableDebugMode')}
          thumbColor={prefs.enableDebugMode ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Performance Monitor</Text>
          <Text style={styles.settingDesc}>Show FPS and performance metrics</Text>
        </View>
        <Switch
          value={prefs.enablePerformanceMonitor}
          onValueChange={() => togglePreference('enablePerformanceMonitor')}
          thumbColor={prefs.enablePerformanceMonitor ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Collaboration</Text>
          <Text style={styles.settingDesc}>Enable real-time collaboration</Text>
        </View>
        <Switch
          value={prefs.enableCollaboration}
          onValueChange={() => togglePreference('enableCollaboration')}
          thumbColor={prefs.enableCollaboration ? '#06b6d4' : '#cbd5e1'}
        />
      </View>

      <View style={styles.settingRow}>
        <View>
          <Text style={styles.settingLabel}>Max Undo Steps</Text>
          <Text style={styles.settingDesc}>Maximum history entries to keep</Text>
        </View>
        <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>{prefs.maxUndoSteps}</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="information-outline" size={16} color="#06b6d4" />
        <Text style={styles.infoText}>Advanced settings require editor restart</Text>
      </View>
    </View>
  );

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="cog-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>Settings</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Preferences</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            {tabs.map((tab) => (
              <Pressable
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <MaterialCommunityIcons name={tab.icon as any} size={16} color={activeTab === tab.id ? '#06b6d4' : '#64748b'} />
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.content}>
            {activeTab === 'appearance' && renderAppearanceTab()}
            {activeTab === 'behavior' && renderBehaviorTab()}
            {activeTab === 'nodes' && renderNodesTab()}
            {activeTab === 'advanced' && renderAdvancedTab()}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 6,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabContent: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  valueDisplay: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#06b6d4',
  },
  sizeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeButtonActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  sizeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },
  modeButtonActive: {
    borderColor: '#06b6d4',
    backgroundColor: '#0c4a6e',
  },
  modeButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c4a6e',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#06b6d4',
    marginTop: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: '#cbd5e1',
  },
});
