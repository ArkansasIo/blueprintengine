/**
 * useScreenFit Hook
 * Manages responsive screen sizing and layout adaptation
 */

import { useEffect, useState, useCallback } from 'react';
import { useWindowDimensions, ScaledSize } from 'react-native';

export interface ScreenDimensions {
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isTablet: boolean;
  isSmallPhone: boolean;
  isMediumPhone: boolean;
  isLargePhone: boolean;
  scale: number;
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
}

export interface ScreenBreakpoints {
  xs: boolean;  // < 320px
  sm: boolean;  // 320-479px
  md: boolean;  // 480-767px
  lg: boolean;  // 768-1023px
  xl: boolean;  // >= 1024px
}

export interface LayoutConfig {
  panelWidth: number;
  toolbarHeight: number;
  miniMapWidth: number;
  inspectorWidth: number;
  nodeSize: number;
  pinSize: number;
  fontSize: number;
  spacing: number;
}

/**
 * useScreenFit Hook
 * Provides responsive screen information and layout configuration
 */
export function useScreenFit(safeAreaInsets?: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}) {
  const windowDimensions = useWindowDimensions();
  const [dimensions, setDimensions] = useState<ScreenDimensions>({
    width: windowDimensions.width,
    height: windowDimensions.height,
    isPortrait: windowDimensions.height > windowDimensions.width,
    isLandscape: windowDimensions.width > windowDimensions.height,
    isTablet: false,
    isSmallPhone: false,
    isMediumPhone: false,
    isLargePhone: false,
    scale: 1,
    safeAreaTop: safeAreaInsets?.top || 0,
    safeAreaBottom: safeAreaInsets?.bottom || 0,
    safeAreaLeft: safeAreaInsets?.left || 0,
    safeAreaRight: safeAreaInsets?.right || 0,
  });

  const [breakpoints, setBreakpoints] = useState<ScreenBreakpoints>({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
    panelWidth: 300,
    toolbarHeight: 50,
    miniMapWidth: 200,
    inspectorWidth: 280,
    nodeSize: 200,
    pinSize: 10,
    fontSize: 12,
    spacing: 8,
  });

  // Calculate dimensions and responsive properties
  useEffect(() => {
    const { width, height } = windowDimensions;
    const isPortrait = height > width;
    const isLandscape = width > height;

    // Determine device type
    const diagonal = Math.sqrt(width * width + height * height);
    const isTablet = diagonal > 1000;
    const isSmallPhone = width < 375;
    const isMediumPhone = width >= 375 && width < 480;
    const isLargePhone = width >= 480;

    // Calculate scale based on width
    const scale = width < 375 ? 0.85 : width > 1024 ? 1.2 : 1;

    setDimensions({
      width,
      height,
      isPortrait,
      isLandscape,
      isTablet,
      isSmallPhone,
      isMediumPhone,
      isLargePhone,
      scale,
      safeAreaTop: safeAreaInsets?.top || 0,
      safeAreaBottom: safeAreaInsets?.bottom || 0,
      safeAreaLeft: safeAreaInsets?.left || 0,
      safeAreaRight: safeAreaInsets?.right || 0,
    });

    // Set breakpoints
    setBreakpoints({
      xs: width < 320,
      sm: width >= 320 && width < 480,
      md: width >= 480 && width < 768,
      lg: width >= 768 && width < 1024,
      xl: width >= 1024,
    });

    // Configure layout based on screen size
    const config = calculateLayoutConfig(width, height, isPortrait, isTablet);
    setLayoutConfig(config);
  }, [windowDimensions, safeAreaInsets]);

  // Calculate panel positions
  const getPanelLayout = useCallback(() => {
    const { width, height, safeAreaTop, safeAreaBottom, safeAreaLeft, safeAreaRight } =
      dimensions;
    const { panelWidth, toolbarHeight, miniMapWidth, inspectorWidth } = layoutConfig;

    const contentWidth = width - safeAreaLeft - safeAreaRight;
    const contentHeight = height - safeAreaTop - safeAreaBottom - toolbarHeight;

    return {
      contentWidth,
      contentHeight,
      canvasWidth: contentWidth - panelWidth - inspectorWidth,
      canvasHeight: contentHeight,
      leftPanelX: safeAreaLeft,
      rightPanelX: width - inspectorWidth - safeAreaRight,
      toolbarHeight,
      toolbarY: safeAreaTop,
    };
  }, [dimensions, layoutConfig]);

  // Calculate node layout
  const getNodeLayout = useCallback(
    (totalNodes: number) => {
      const { nodeSize, spacing } = layoutConfig;
      const { canvasWidth, canvasHeight } = getPanelLayout();

      // Calculate grid dimensions
      const itemsPerRow = Math.max(1, Math.floor(canvasWidth / (nodeSize + spacing)));
      const itemsPerColumn = Math.max(1, Math.floor(canvasHeight / (nodeSize + spacing)));

      return {
        itemsPerRow,
        itemsPerColumn,
        maxVisibleNodes: itemsPerRow * itemsPerColumn,
        nodeWidth: (canvasWidth - spacing * itemsPerRow) / itemsPerRow,
        nodeHeight: (canvasHeight - spacing * itemsPerColumn) / itemsPerColumn,
      };
    },
    [layoutConfig, getPanelLayout]
  );

  // Calculate font sizes
  const getFontSizes = useCallback(() => {
    const { fontSize, scale } = layoutConfig;
    const baseSize = fontSize * scale;

    return {
      xs: baseSize * 0.75,
      sm: baseSize * 0.875,
      base: baseSize,
      lg: baseSize * 1.125,
      xl: baseSize * 1.25,
      '2xl': baseSize * 1.5,
      '3xl': baseSize * 1.875,
      '4xl': baseSize * 2.25,
    };
  }, [layoutConfig]);

  // Calculate spacing scale
  const getSpacing = useCallback(() => {
    const { spacing } = layoutConfig;

    return {
      xs: spacing * 0.5,
      sm: spacing * 0.75,
      base: spacing,
      md: spacing * 1.5,
      lg: spacing * 2,
      xl: spacing * 3,
      '2xl': spacing * 4,
      '3xl': spacing * 6,
      '4xl': spacing * 8,
    };
  }, [layoutConfig]);

  // Get responsive styles
  const getResponsiveStyles = useCallback(() => {
    const { isSmallPhone, isLargePhone, isTablet, isPortrait, isLandscape } = dimensions;
    const { panelWidth, inspectorWidth } = layoutConfig;

    return {
      // Panel visibility
      showLeftPanel: !isSmallPhone,
      showRightPanel: !isSmallPhone || isLandscape,
      
      // Panel sizes
      leftPanelWidth: isSmallPhone ? panelWidth * 0.7 : panelWidth,
      rightPanelWidth: isSmallPhone ? inspectorWidth * 0.7 : inspectorWidth,
      
      // Node sizes
      nodeWidth: isSmallPhone ? 150 : 200,
      nodeHeight: isSmallPhone ? 80 : 100,
      
      // Font sizes
      nodeTitle: isSmallPhone ? 11 : 13,
      nodeLabel: isSmallPhone ? 9 : 11,
      
      // Spacing
      padding: isSmallPhone ? 8 : 12,
      gap: isSmallPhone ? 6 : 8,
      
      // Button sizes
      buttonHeight: isSmallPhone ? 32 : 40,
      buttonPadding: isSmallPhone ? 8 : 12,
      
      // Mini map
      miniMapHeight: isLandscape ? 150 : isPortrait && !isTablet ? 120 : 150,
    };
  }, [dimensions, layoutConfig]);

  return {
    dimensions,
    breakpoints,
    layoutConfig,
    getPanelLayout,
    getNodeLayout,
    getFontSizes,
    getSpacing,
    getResponsiveStyles,
  };
}

/**
 * Calculate layout configuration based on screen dimensions
 */
function calculateLayoutConfig(
  width: number,
  height: number,
  isPortrait: boolean,
  isTablet: boolean
): LayoutConfig {
  // Small phones (< 375px)
  if (width < 375) {
    return {
      panelWidth: 200,
      toolbarHeight: 44,
      miniMapWidth: 140,
      inspectorWidth: 180,
      nodeSize: 140,
      pinSize: 8,
      fontSize: 11,
      spacing: 6,
    };
  }

  // Medium phones (375-480px)
  if (width < 480) {
    return {
      panelWidth: 240,
      toolbarHeight: 48,
      miniMapWidth: 160,
      inspectorWidth: 220,
      nodeSize: 160,
      pinSize: 9,
      fontSize: 12,
      spacing: 7,
    };
  }

  // Large phones (480-768px)
  if (width < 768) {
    return {
      panelWidth: 280,
      toolbarHeight: 50,
      miniMapWidth: 200,
      inspectorWidth: 280,
      nodeSize: 200,
      pinSize: 10,
      fontSize: 13,
      spacing: 8,
    };
  }

  // Tablets and large screens (768px+)
  return {
    panelWidth: 320,
    toolbarHeight: 56,
    miniMapWidth: 240,
    inspectorWidth: 320,
    nodeSize: 240,
    pinSize: 12,
    fontSize: 14,
    spacing: 10,
  };
}
