import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CompileStatusBarProps {
  status: 'compiling' | 'success' | 'error';
  errors: string[];
}

const CompileStatusBar: React.FC<CompileStatusBarProps> = ({ status, errors }) => {
  const [expandErrors, setExpandErrors] = useState(false);

  const statusConfig = {
    compiling: {
      icon: 'loading',
      label: 'Compiling...',
      color: '#06b6d4',
      backgroundColor: '#0c4a6e',
    },
    success: {
      icon: 'check-circle',
      label: 'Compiled Successfully',
      color: '#10b981',
      backgroundColor: '#064e3b',
    },
    error: {
      icon: 'alert-circle',
      label: `Compilation Failed (${errors.length} errors)`,
      color: '#ef4444',
      backgroundColor: '#7c2d12',
    },
  };

  const config = statusConfig[status];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor, borderTopColor: config.color },
      ]}
    >
      {/* Status Bar */}
      <Pressable
        style={styles.statusBar}
        onPress={() => setExpandErrors(!expandErrors)}
      >
        <View style={styles.statusContent}>
          <MaterialCommunityIcons
            name={config.icon}
            size={16}
            color={config.color}
            style={status === 'compiling' && styles.spinning}
          />
          <Text style={[styles.statusLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </View>

        {status === 'error' && (
          <MaterialCommunityIcons
            name={expandErrors ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={config.color}
          />
        )}
      </Pressable>

      {/* Error List (Expanded) */}
      {status === 'error' && expandErrors && errors.length > 0 && (
        <View style={styles.errorList}>
          {errors.map((error, idx) => (
            <View key={idx} style={styles.errorItem}>
              <MaterialCommunityIcons name="alert" size={12} color="#ef4444" />
              <Text style={styles.errorText} numberOfLines={2}>
                {error}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 2,
  },

  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  spinning: {
    transform: [{ rotate: '360deg' }],
  },

  errorList: {
    maxHeight: 120,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
  },

  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },

  errorText: {
    flex: 1,
    fontSize: 10,
    color: '#fca5a5',
    lineHeight: 14,
  },
});

export default CompileStatusBar;
