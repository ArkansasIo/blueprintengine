/**
 * Screen Fit Utilities
 * Canvas scaling, zoom, and viewport management
 */

import { Dimensions } from 'react-native';

export interface ViewportBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface ZoomLevel {
  scale: number;
  label: string;
  percentage: number;
}

export interface CanvasTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
}

/**
 * Standard zoom levels
 */
export const ZOOM_LEVELS: ZoomLevel[] = [
  { scale: 0.1, label: '10%', percentage: 10 },
  { scale: 0.25, label: '25%', percentage: 25 },
  { scale: 0.5, label: '50%', percentage: 50 },
  { scale: 0.75, label: '75%', percentage: 75 },
  { scale: 1, label: '100%', percentage: 100 },
  { scale: 1.25, label: '125%', percentage: 125 },
  { scale: 1.5, label: '150%', percentage: 150 },
  { scale: 2, label: '200%', percentage: 200 },
  { scale: 2.5, label: '250%', percentage: 250 },
  { scale: 4, label: '400%', percentage: 400 },
];

/**
 * Fit canvas to viewport (zoom to fit)
 */
export function calculateZoomToFit(
  contentBounds: ViewportBounds,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 20
): CanvasTransform {
  const contentWidth = contentBounds.maxX - contentBounds.minX;
  const contentHeight = contentBounds.maxY - contentBounds.minY;

  if (contentWidth === 0 || contentHeight === 0) {
    return { offsetX: 0, offsetY: 0, scale: 1 };
  }

  // Calculate scale to fit content with padding
  const scaleX = (viewportWidth - padding * 2) / contentWidth;
  const scaleY = (viewportHeight - padding * 2) / contentHeight;
  const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

  // Calculate center offset
  const offsetX = (viewportWidth - contentWidth * scale) / 2 - contentBounds.minX * scale;
  const offsetY = (viewportHeight - contentHeight * scale) / 2 - contentBounds.minY * scale;

  return {
    offsetX,
    offsetY,
    scale: Math.max(0.1, Math.min(1, scale)),
  };
}

/**
 * Calculate zoom to center
 */
export function calculateZoomToCenter(
  targetX: number,
  targetY: number,
  viewportWidth: number,
  viewportHeight: number,
  scale: number
): CanvasTransform {
  const offsetX = viewportWidth / 2 - targetX * scale;
  const offsetY = viewportHeight / 2 - targetY * scale;

  return {
    offsetX,
    offsetY,
    scale,
  };
}

/**
 * Calculate zoom to point
 */
export function calculateZoomToPoint(
  pointX: number,
  pointY: number,
  viewportWidth: number,
  viewportHeight: number,
  currentScale: number,
  newScale: number
): CanvasTransform {
  // Calculate the position of the point in viewport space
  const viewportX = pointX * currentScale;
  const viewportY = pointY * currentScale;

  // Calculate new offset to keep the point at same viewport position
  const offsetX = viewportWidth / 2 - pointX * newScale;
  const offsetY = viewportHeight / 2 - pointY * newScale;

  return {
    offsetX,
    offsetY,
    scale: newScale,
  };
}

/**
 * Pan canvas
 */
export function calculatePan(
  currentOffsetX: number,
  currentOffsetY: number,
  deltaX: number,
  deltaY: number,
  contentBounds: ViewportBounds,
  viewportWidth: number,
  viewportHeight: number,
  scale: number
): CanvasTransform {
  const contentWidth = contentBounds.maxX - contentBounds.minX;
  const contentHeight = contentBounds.maxY - contentBounds.minY;

  // Calculate max offsets to prevent panning too far
  const maxOffsetX = viewportWidth - contentBounds.minX * scale;
  const maxOffsetY = viewportHeight - contentBounds.minY * scale;
  const minOffsetX = viewportWidth - (contentBounds.maxX * scale + 100);
  const minOffsetY = viewportHeight - (contentBounds.maxY * scale + 100);

  const offsetX = Math.max(minOffsetX, Math.min(maxOffsetX, currentOffsetX + deltaX));
  const offsetY = Math.max(minOffsetY, Math.min(maxOffsetY, currentOffsetY + deltaY));

  return {
    offsetX,
    offsetY,
    scale,
  };
}

/**
 * Convert screen coordinates to canvas coordinates
 */
export function screenToCanvasCoordinates(
  screenX: number,
  screenY: number,
  offsetX: number,
  offsetY: number,
  scale: number
): { x: number; y: number } {
  return {
    x: (screenX - offsetX) / scale,
    y: (screenY - offsetY) / scale,
  };
}

/**
 * Convert canvas coordinates to screen coordinates
 */
export function canvasToScreenCoordinates(
  canvasX: number,
  canvasY: number,
  offsetX: number,
  offsetY: number,
  scale: number
): { x: number; y: number } {
  return {
    x: canvasX * scale + offsetX,
    y: canvasY * scale + offsetY,
  };
}

/**
 * Get optimal zoom level
 */
export function getOptimalZoomLevel(scale: number): ZoomLevel {
  let closest = ZOOM_LEVELS[0];
  let minDiff = Math.abs(scale - closest.scale);

  for (const level of ZOOM_LEVELS) {
    const diff = Math.abs(scale - level.scale);
    if (diff < minDiff) {
      minDiff = diff;
      closest = level;
    }
  }

  return closest;
}

/**
 * Get next zoom level
 */
export function getNextZoomLevel(currentScale: number, direction: 'in' | 'out'): ZoomLevel {
  const currentLevel = getOptimalZoomLevel(currentScale);
  const currentIndex = ZOOM_LEVELS.indexOf(currentLevel);

  if (direction === 'in') {
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      return ZOOM_LEVELS[currentIndex + 1];
    }
    return ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
  } else {
    if (currentIndex > 0) {
      return ZOOM_LEVELS[currentIndex - 1];
    }
    return ZOOM_LEVELS[0];
  }
}

/**
 * Fit node on canvas
 */
export function calculateFitNode(
  nodeX: number,
  nodeY: number,
  nodeWidth: number,
  nodeHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 50
): CanvasTransform {
  const bounds: ViewportBounds = {
    minX: nodeX,
    minY: nodeY,
    maxX: nodeX + nodeWidth,
    maxY: nodeY + nodeHeight,
    width: nodeWidth,
    height: nodeHeight,
    centerX: nodeX + nodeWidth / 2,
    centerY: nodeY + nodeHeight / 2,
  };

  return calculateZoomToFit(bounds, viewportWidth, viewportHeight, padding);
}

/**
 * Fit selection on canvas
 */
export function calculateFitSelection(
  nodeIds: string[],
  nodeMap: Map<string, { x: number; y: number; width: number; height: number }>,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = 50
): CanvasTransform {
  if (nodeIds.length === 0) {
    return { offsetX: 0, offsetY: 0, scale: 1 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const nodeId of nodeIds) {
    const node = nodeMap.get(nodeId);
    if (node) {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + node.width);
      maxY = Math.max(maxY, node.y + node.height);
    }
  }

  const bounds: ViewportBounds = {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };

  return calculateZoomToFit(bounds, viewportWidth, viewportHeight, padding);
}

/**
 * Check if point is in viewport
 */
export function isPointInViewport(
  pointX: number,
  pointY: number,
  viewportWidth: number,
  viewportHeight: number,
  offsetX: number,
  offsetY: number,
  scale: number
): boolean {
  const screenX = pointX * scale + offsetX;
  const screenY = pointY * scale + offsetY;

  return screenX >= 0 && screenX <= viewportWidth && screenY >= 0 && screenY <= viewportHeight;
}

/**
 * Check if bounds intersect viewport
 */
export function boundsIntersectViewport(
  bounds: ViewportBounds,
  viewportWidth: number,
  viewportHeight: number,
  offsetX: number,
  offsetY: number,
  scale: number
): boolean {
  const screenMinX = bounds.minX * scale + offsetX;
  const screenMinY = bounds.minY * scale + offsetY;
  const screenMaxX = bounds.maxX * scale + offsetX;
  const screenMaxY = bounds.maxY * scale + offsetY;

  return !(
    screenMaxX < 0 ||
    screenMinX > viewportWidth ||
    screenMaxY < 0 ||
    screenMinY > viewportHeight
  );
}

/**
 * Calculate responsive scale factor
 */
export function getResponsiveScale(): number {
  const { width, height } = Dimensions.get('window');
  const isSmallScreen = width < 375;
  const isTablet = Math.sqrt(width * width + height * height) > 1000;

  if (isSmallScreen) return 0.85;
  if (isTablet) return 1.15;
  return 1;
}

/**
 * Clamp scale within bounds
 */
export function clampScale(scale: number, min: number = 0.1, max: number = 4): number {
  return Math.max(min, Math.min(max, scale));
}

/**
 * Smooth zoom animation
 */
export function calculateSmoothZoom(
  startScale: number,
  targetScale: number,
  progress: number
): number {
  // Use easing function for smooth transition
  const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
  return startScale + (targetScale - startScale) * easeProgress;
}

/**
 * Calculate grid snap point
 */
export function getGridSnapPoint(
  value: number,
  gridSize: number
): number {
  return Math.round(value / gridSize) * gridSize;
}
