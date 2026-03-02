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
import { exportBlueprint, ExportFormat } from '../../app/utils/export-formats';

interface ExportOption {
  id: ExportFormat;
  label: string;
  icon: string;
  description: string;
  extension: string;
}

const exportOptions: ExportOption[] = [
  {
    id: 'json',
    label: 'JSON',
    icon: 'code-braces',
    description: 'Structured data format, easy to parse',
    extension: '.json',
  },
  {
    id: 'csv',
    label: 'CSV',
    icon: 'table',
    description: 'Spreadsheet-compatible format',
    extension: '.csv',
  },
  {
    id: 'svg',
    label: 'SVG',
    icon: 'image-outline',
    description: 'Visual diagram as scalable graphic',
    extension: '.svg',
  },
  {
    id: 'yaml',
    label: 'YAML',
    icon: 'file-document',
    description: 'Human-readable configuration format',
    extension: '.yaml',
  },
];

export default function AdvancedExport() {
  const [visible, setVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [options, setOptions] = useState({
    includeMetadata: true,
    includeComments: true,
    prettyPrint: true,
  });
  const [exportedData, setExportedData] = useState<string | null>(null);

  const { nodes, edges } = useEditorStore();

  const handleExport = () => {
    try {
      const data = exportBlueprint(nodes, edges, selectedFormat, options);
      setExportedData(data);
      Alert.alert('Success', `Blueprint exported as ${selectedFormat.toUpperCase()}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export blueprint');
    }
  };

  const handleCopyToClipboard = async () => {
    if (!exportedData) return;
    try {
      // In a real app, you'd use clipboard library
      console.log('Exported data:', exportedData);
      Alert.alert('Success', 'Exported data copied to console');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    if (!exportedData) return;
    const option = exportOptions.find((o) => o.id === selectedFormat);
    const fileName = `blueprint_${Date.now()}${option?.extension}`;
    console.log(`Downloading: ${fileName}`);
    Alert.alert('Download', `File would be saved as: ${fileName}`);
  };

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setVisible(true)}
      >
        <MaterialCommunityIcons
          name="download-circle-outline"
          size={20}
          color="#fff"
        />
        <Text style={styles.buttonText}>Export</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide">
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Advanced Export</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            {/* Format Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Export Format</Text>
              {exportOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.formatCard,
                    selectedFormat === option.id && styles.formatCardSelected,
                  ]}
                  onPress={() => setSelectedFormat(option.id)}
                >
                  <MaterialCommunityIcons
                    name={option.icon as any}
                    size={24}
                    color={
                      selectedFormat === option.id ? '#06b6d4' : '#64748b'
                    }
                  />
                  <View style={styles.formatInfo}>
                    <Text style={styles.formatLabel}>{option.label}</Text>
                    <Text style={styles.formatDesc}>{option.description}</Text>
                  </View>
                  {selectedFormat === option.id && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#06b6d4"
                    />
                  )}
                </Pressable>
              ))}
            </View>

            {/* Export Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Options</Text>

              <View style={styles.optionRow}>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Include Metadata</Text>
                  <Text style={styles.optionDesc}>
                    Add export date and counts
                  </Text>
                </View>
                <Switch
                  value={options.includeMetadata}
                  onValueChange={(val) =>
                    setOptions({ ...options, includeMetadata: val })
                  }
                />
              </View>

              <View style={styles.optionRow}>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Include Comments</Text>
                  <Text style={styles.optionDesc}>
                    Add node comments if available
                  </Text>
                </View>
                <Switch
                  value={options.includeComments}
                  onValueChange={(val) =>
                    setOptions({ ...options, includeComments: val })
                  }
                />
              </View>

              <View style={styles.optionRow}>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>Pretty Print</Text>
                  <Text style={styles.optionDesc}>
                    Format with indentation
                  </Text>
                </View>
                <Switch
                  value={options.prettyPrint}
                  onValueChange={(val) =>
                    setOptions({ ...options, prettyPrint: val })
                  }
                />
              </View>
            </View>

            {/* Preview */}
            {exportedData && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preview</Text>
                <ScrollView style={styles.previewBox}>
                  <Text style={styles.previewText}>
                    {exportedData.substring(0, 500)}
                    {exportedData.length > 500 ? '...' : ''}
                  </Text>
                </ScrollView>
              </View>
            )}

            {/* Graph Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Graph Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="cube-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.summaryValue}>{nodes.length}</Text>
                  <Text style={styles.summaryLabel}>Nodes</Text>
                </View>
                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="vector-link"
                    size={20}
                    color="#10b981"
                  />
                  <Text style={styles.summaryValue}>{edges.length}</Text>
                  <Text style={styles.summaryLabel}>Edges</Text>
                </View>
                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color="#f59e0b"
                  />
                  <Text style={styles.summaryValue}>
                    {(nodes.length + edges.length) * 50}B
                  </Text>
                  <Text style={styles.summaryLabel}>Est. Size</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.section}>
              <Pressable
                style={styles.exportButton}
                onPress={handleExport}
              >
                <MaterialCommunityIcons
                  name="download"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.exportButtonText}>Generate Export</Text>
              </Pressable>

              {exportedData && (
                <>
                  <Pressable
                    style={[styles.actionButton, styles.copyButton]}
                    onPress={handleCopyToClipboard}
                  >
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={18}
                      color="#06b6d4"
                    />
                    <Text style={styles.actionButtonText}>Copy to Clipboard</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.downloadButton]}
                    onPress={handleDownload}
                  >
                    <MaterialCommunityIcons
                      name="download"
                      size={18}
                      color="#10b981"
                    />
                    <Text style={styles.actionButtonText}>Download File</Text>
                  </Pressable>
                </>
              )}
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
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
    gap: 12,
  },
  formatCardSelected: {
    backgroundColor: '#0c4a6e',
    borderColor: '#06b6d4',
  },
  formatInfo: {
    flex: 1,
  },
  formatLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  formatDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 11,
    color: '#94a3b8',
  },
  previewBox: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    maxHeight: 200,
  },
  previewText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontFamily: 'monospace',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  exportButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  copyButton: {
    backgroundColor: '#0c4a6e',
    borderColor: '#06b6d4',
  },
  downloadButton: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e2e8f0',
  },
});
