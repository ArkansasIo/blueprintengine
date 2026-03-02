import React, { useCallback } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenFit } from '@/app/hooks/useScreenFit';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  toolbar?: React.ReactNode;
}

/**
 * ResponsiveLayout
 * Adaptive layout wrapper for the blueprint editor
 */
export default function ResponsiveLayout({
  children,
  leftPanel,
  rightPanel,
  toolbar,
}: ResponsiveLayoutProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const screenFit = useScreenFit(insets);

  const { dimensions, layoutConfig, getResponsiveStyles } = screenFit;
  const responsive = getResponsiveStyles();
  const panelLayout = screenFit.getPanelLayout();

  // Determine layout mode based on screen size
  const layoutMode = dimensions.isSmallPhone && dimensions.isPortrait ? 'mobile' : 'desktop';

  return (
    <View style={styles.container}>
      {/* Toolbar */}
      {toolbar && (
        <View
          style={[
            styles.toolbar,
            {
              height: layoutConfig.toolbarHeight,
              top: insets.top,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          {toolbar}
        </View>
      )}

      {/* Main Content */}
      <View
        style={[
          styles.content,
          {
            top: insets.top + (toolbar ? layoutConfig.toolbarHeight : 0),
            bottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        {/* Left Panel (Mobile: Hidden, Desktop: Visible) */}
        {leftPanel && responsive.showLeftPanel && (
          <View
            style={[
              styles.leftPanel,
              {
                width: responsive.leftPanelWidth,
              },
            ]}
          >
            {leftPanel}
          </View>
        )}

        {/* Canvas/Main Content */}
        <View
          style={[
            styles.canvasContainer,
            {
              flex: 1,
            },
          ]}
        >
          {children}
        </View>

        {/* Right Panel (Mobile: Hidden unless landscape, Desktop: Visible) */}
        {rightPanel && responsive.showRightPanel && (
          <View
            style={[
              styles.rightPanel,
              {
                width: responsive.rightPanelWidth,
              },
            ]}
          >
            {rightPanel}
          </View>
        )}
      </View>

      {/* Mobile Left Panel Overlay */}
      {layoutMode === 'mobile' && leftPanel && responsive.showLeftPanel && (
        <View
          style={[
            styles.mobileOverlay,
            {
              top: insets.top + layoutConfig.toolbarHeight,
              left: insets.left,
              width: responsive.leftPanelWidth,
              bottom: insets.bottom,
            },
          ]}
        >
          {leftPanel}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    zIndex: 100,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftPanel: {
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    overflow: 'hidden',
  },
  canvasContainer: {
    backgroundColor: '#0f172a',
    overflow: 'hidden',
  },
  rightPanel: {
    backgroundColor: '#1e293b',
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    overflow: 'hidden',
  },
  mobileOverlay: {
    position: 'absolute',
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
